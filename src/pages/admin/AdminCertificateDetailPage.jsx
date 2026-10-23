import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getAdminCertificate, approveCertificate, rejectCertificate,
  revokeCertificate, downloadAdminCertificatePdf,
} from '../../services/adminService.js';
import CertificatePreview from '../../components/certificates/CertificatePreview.jsx';
import {
  PageHeader, DetailCard, DetailRow, StatusBadge, Modal,
  LoadingState, ErrorState, ErrorBanner,
} from '../../components/ui/index.js';

const CERT_FORMAT = /^AICIT-\d{4}-\d{6}$/;

/** Modal body for approve/reject/revoke — preserves the original fields + validation. */
function ActionModalBody({ type, cert, onConfirm, onClose, busy }) {
  const [reason, setReason] = useState('');
  const [marks, setMarks]   = useState(cert.marks || '');
  const [grade, setGrade]   = useState(cert.grade || '');
  const [certNumber, setCertNumber] = useState('');
  const [certError, setCertError]   = useState('');
  const isApprove = type === 'approve';

  const confirm = () => {
    if (isApprove) {
      const trimmed = certNumber.trim().toUpperCase();
      if (trimmed && !CERT_FORMAT.test(trimmed)) {
        setCertError('Format must be AICIT-YYYY-XXXXXX  (e.g. AICIT-2026-000042)');
        return;
      }
      onConfirm({ reason, marks, grade, customCertNumber: trimmed || null });
    } else {
      onConfirm({ reason, marks, grade, customCertNumber: null });
    }
  };

  const meta = {
    approve: { title: 'Approve Certificate', msg: `Approve and issue the certificate for ${cert.studentName}? A PDF will be generated automatically.`, btn: 'Approve & Issue', cls: 'bg-trust-600 hover:bg-trust-700' },
    reject:  { title: 'Reject Certificate Request', msg: `Reject the certificate request for ${cert.studentName}?`, btn: 'Reject', cls: 'bg-red-600 hover:bg-red-700' },
    revoke:  { title: 'Revoke Certificate', msg: `Revoke certificate ${cert.certificateNumber}? It will show as REVOKED on public verification.`, btn: 'Revoke', cls: 'bg-orange-600 hover:bg-orange-700' },
  }[type];

  return (
    <Modal open onClose={busy ? undefined : onClose} title={meta.title}
      footer={<>
        <button onClick={onClose} disabled={busy} className="btn-ghost text-sm">Cancel</button>
        <button onClick={confirm} disabled={busy}
          className={`text-sm px-4 py-2 rounded-xl font-semibold text-white transition-colors ${meta.cls}`}>
          {busy ? 'Working…' : meta.btn}
        </button>
      </>}>
      <p className="text-sm text-gray-600">{meta.msg}</p>

      {isApprove && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="label">Certificate Number
              <span className="ml-1 text-gray-400 font-normal text-xs">(blank = auto-generate)</span>
            </label>
            <input type="text" value={certNumber}
              onChange={e => { setCertNumber(e.target.value); setCertError(''); }}
              placeholder="e.g. AICIT-2026-000042"
              className={`input font-mono tracking-wide ${certError ? 'border-red-400 bg-red-50' : ''}`} />
            <p className={`mt-1 text-xs ${certError ? 'text-red-600' : 'text-gray-400'}`}>
              {certError || 'Format: AICIT-YYYY-XXXXXX'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Marks <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
              <input type="text" value={marks} onChange={e => setMarks(e.target.value)} placeholder="e.g. 450/500" className="input" />
            </div>
            <div>
              <label className="label">Grade <span className="text-gray-400 font-normal text-xs">(optional)</span></label>
              <input type="text" value={grade} onChange={e => setGrade(e.target.value)} placeholder="e.g. A+" className="input" />
            </div>
          </div>
        </div>
      )}

      {!isApprove && (
        <div className="mt-4">
          <label className="label">{type === 'reject' ? 'Rejection' : 'Revocation'} reason (optional)</label>
          <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)}
            placeholder="Enter reason…" className="input resize-none" />
        </div>
      )}
    </Modal>
  );
}

export default function AdminCertificateDetailPage() {
  const { id } = useParams();
  const [cert, setCert]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [actionLoading, setAL] = useState(false);
  const [modal, setModal]     = useState(null);
  const [preview, setPreview] = useState(false);

  const load = async () => {
    setLoading(true); setError(null);
    try { const res = await getAdminCertificate(id); setCert(res.data); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const doAction = async (fn) => {
    setAL(true); setError(null);
    try { await fn(); setModal(null); await load(); }
    catch (err) { setError(err.message); setModal(null); }
    finally { setAL(false); }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadAdminCertificatePdf(id);
      if (!blob || blob.size === 0) { alert('PDF not available.'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${cert?.certificateNumber || id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { alert('Download failed: ' + err.message); }
  };

  if (loading) return <LoadingState label="Loading certificate…" />;
  if (error && !cert) return <ErrorState message={error} onRetry={load} backTo="/admin/certificates" backLabel="Back to Certificates" />;
  if (!cert) return null;

  const st = cert.status;
  const canReview = st === 'REQUESTED' || st === 'UNDER_REVIEW';

  return (
    <div className="space-y-5 max-w-3xl">
      <PageHeader
        title={cert.certificateNumber || 'Certificate Request'}
        subtitle={`${cert.studentName} · ${cert.courseName}`}
        breadcrumbs={[{ label: 'Certificates', to: '/admin/certificates' }, { label: cert.certificateNumber || `Request #${id}` }]}
        actions={<StatusBadge status={st} />}
      />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2.5">
        {canReview && <>
          <button disabled={actionLoading} onClick={() => setModal('approve')}
            className="px-4 py-2.5 bg-trust-600 hover:bg-trust-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-colors">
            Approve &amp; Issue
          </button>
          <button disabled={actionLoading} onClick={() => setModal('reject')}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-colors">
            Reject
          </button>
        </>}
        {st === 'ISSUED' && <>
          <button onClick={() => setPreview(true)}
            className="px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold rounded-xl transition-colors">
            Preview Certificate
          </button>
          <button onClick={handleDownload}
            className="px-4 py-2.5 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold rounded-xl transition-colors">
            {cert.certificateType === 'TYPING' ? 'Download Typing Certificate' : 'Download AICIT Certificate'}
          </button>
          <button disabled={actionLoading} onClick={() => setModal('revoke')}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-colors">
            Revoke
          </button>
        </>}
      </div>

      <ErrorBanner message={error} />

      <DetailCard title="Certificate Details" icon="📜">
        <DetailRow label="Certificate Number" value={cert.certificateNumber} mono />
        <DetailRow label="Student" value={cert.studentName} />
        <DetailRow label="Course" value={cert.courseName} />
        <DetailRow label="Institute" value={cert.instituteName} />
        <DetailRow label="Marks" value={cert.marks} />
        <DetailRow label="Grade" value={cert.grade} />
        <DetailRow label="Issue Date" value={cert.issueDate} />
        <DetailRow label="Status" value={<StatusBadge status={st} />} />
        {cert.rejectionReason && <DetailRow label="Rejection Reason" value={cert.rejectionReason} />}
        {cert.revokeReason && <DetailRow label="Revoke Reason" value={cert.revokeReason} />}
        <DetailRow label="Requested On" value={cert.createdAt ? new Date(cert.createdAt).toLocaleDateString('en-IN') : null} />
        {cert.reviewedAt && <DetailRow label="Reviewed On" value={new Date(cert.reviewedAt).toLocaleDateString('en-IN')} />}
        <DetailRow label="Has PDF" value={cert.hasPdf ? 'Yes' : 'No'} />
      </DetailCard>

      {modal && (
        <ActionModalBody type={modal} cert={cert} busy={actionLoading}
          onClose={() => setModal(null)}
          onConfirm={({ reason, marks, grade, customCertNumber }) => {
            if (modal === 'approve') doAction(() => approveCertificate(id, { marks: marks || null, grade: grade || null, customCertNumber: customCertNumber || null }));
            if (modal === 'reject')  doAction(() => rejectCertificate(id, reason));
            if (modal === 'revoke')  doAction(() => revokeCertificate(id, reason));
          }} />
      )}

      {preview && (
        <CertificatePreview cert={cert} scope="admin" onClose={() => setPreview(false)}
          serverPdf={{ label: 'Official PDF', onDownload: handleDownload }} />
      )}
    </div>
  );
}
