import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdminCertificate, approveCertificate, rejectCertificate, revokeCertificate } from '../../services/adminService.js';
import { auth } from '../../services/api.js';

const STATUS_COLORS = {
  REQUESTED:    'bg-yellow-100 text-yellow-800',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  APPROVED:     'bg-green-100 text-green-700',
  ISSUED:       'bg-emerald-100 text-emerald-800',
  REJECTED:     'bg-red-100 text-red-700',
  REVOKED:      'bg-gray-200 text-gray-600',
};

function Row({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2.5 border-b border-gray-50">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider sm:w-48 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-900">{value || '—'}</span>
    </div>
  );
}

function ActionModal({ title, message, requireReason = false, reasonLabel = 'Reason (optional)',
                       confirmLabel, confirmClass, onConfirm, onClose,
                       initialMarks = '', initialGrade = '' }) {
  const [reason,     setReason]     = useState('');
  const [marks,      setMarks]      = useState(initialMarks);
  const [grade,      setGrade]      = useState(initialGrade);
  const [certNumber, setCertNumber] = useState('');
  const [certError,  setCertError]  = useState('');
  const isApprove = confirmLabel === 'Approve';

  const CERT_FORMAT = /^AICIT-\d{4}-\d{6}$/;

  const handleConfirm = () => {
    if (isApprove) {
      const trimmed = certNumber.trim().toUpperCase();
      if (trimmed && !CERT_FORMAT.test(trimmed)) {
        setCertError('Format must be AICIT-YYYY-XXXXXX  (e.g. AICIT-2026-000042)');
        return;
      }
      setCertError('');
      onConfirm({ reason, marks, grade, customCertNumber: trimmed || null });
    } else {
      onConfirm({ reason, marks, grade, customCertNumber: null });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
        <h3 className="text-lg font-heading font-bold text-primary-900">{title}</h3>
        <p className="text-sm text-gray-600">{message}</p>

        {isApprove && (
          <>
            {/* Certificate Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                Certificate Number
                <span className="ml-1 text-gray-400 normal-case font-normal">(leave blank to auto-generate)</span>
              </label>
              <input
                type="text"
                value={certNumber}
                onChange={e => { setCertNumber(e.target.value); setCertError(''); }}
                placeholder="e.g. AICIT-2026-000042  or leave blank"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2
                  focus:ring-primary-500 font-mono tracking-wide
                  ${certError ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              />
              {certError
                ? <p className="mt-1 text-xs text-red-600">{certError}</p>
                : <p className="mt-1 text-xs text-gray-400">Format: AICIT-YYYY-XXXXXX</p>
              }
            </div>

            {/* Marks & Grade */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marks <span className="text-gray-400 font-normal text-xs">(optional)</span>
                </label>
                <input type="text" value={marks} onChange={e => setMarks(e.target.value)}
                  placeholder="e.g. 450/500"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade <span className="text-gray-400 font-normal text-xs">(optional)</span>
                </label>
                <input type="text" value={grade} onChange={e => setGrade(e.target.value)}
                  placeholder="e.g. A+"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
          </>
        )}

        {requireReason && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{reasonLabel}</label>
            <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)}
              placeholder="Enter reason…"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
          </div>
        )}

        <div className="flex gap-3 justify-end pt-1">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleConfirm}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${confirmClass}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCertificateDetailPage() {
  const { id } = useParams();
  const [cert,    setCert]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [actionLoading, setAL] = useState(false);
  const [modal,   setModal]   = useState(null);

  const load = async () => {
    setLoading(true); setError(null);
    try { const res = await getAdminCertificate(id); setCert(res.data); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const doAction = async (fn) => {
    setAL(true); setError(null);
    try { await fn(); await load(); }
    catch (err) { setError(err.message); }
    finally { setAL(false); }
  };

  const handleDownload = async () => {
    try {
      const token = auth.getAdminToken();
      const res = await fetch(`/api/admin/certificates/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { alert('PDF not available.'); return; }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = `${cert?.certificateNumber || id}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { alert('Download failed: ' + err.message); }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;
  if (error && !cert) return <div className="p-6 text-red-600">{error}</div>;
  if (!cert) return null;

  const st = cert.status;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/admin/certificates" className="hover:text-primary-700">Certificates</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{cert.certificateNumber || `Request #${id}`}</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-900">
            {cert.certificateNumber || 'Certificate Request'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{cert.studentName} · {cert.courseName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[st] || 'bg-gray-100 text-gray-600'}`}>
          {st?.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {(st === 'REQUESTED' || st === 'UNDER_REVIEW') && (
          <>
            <button disabled={actionLoading}
              onClick={() => setModal({ type: 'approve' })}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
              ✅ Approve & Issue
            </button>
            <button disabled={actionLoading}
              onClick={() => setModal({ type: 'reject' })}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
              ❌ Reject
            </button>
          </>
        )}
        {st === 'ISSUED' && (
          <>
            <button onClick={handleDownload}
              className="px-5 py-2.5 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold rounded-lg">
              {cert.certificateType === 'TYPING'
                ? '⬇ Download Typing Certificate'
                : '⬇ Download AICIT Certificate'}
            </button>
            <button disabled={actionLoading}
              onClick={() => setModal({ type: 'revoke' })}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg disabled:opacity-50">
              🚫 Revoke
            </button>
          </>
        )}
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      {/* Certificate details */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-heading font-bold text-primary-900 mb-4">Certificate Details</h2>
        <Row label="Certificate Number" value={cert.certificateNumber} />
        <Row label="Student Name"       value={cert.studentName} />
        <Row label="Course"             value={cert.courseName} />
        <Row label="Institute"          value={cert.instituteName} />
        <Row label="Marks"              value={cert.marks} />
        <Row label="Grade"              value={cert.grade} />
        <Row label="Issue Date"         value={cert.issueDate} />
        <Row label="Status"             value={st?.replace(/_/g, ' ')} />
        {cert.rejectionReason  && <Row label="Rejection Reason"  value={cert.rejectionReason} />}
        {cert.revokeReason     && <Row label="Revoke Reason"     value={cert.revokeReason} />}
        <Row label="Requested On"       value={cert.createdAt ? new Date(cert.createdAt).toLocaleDateString('en-IN') : '—'} />
        {cert.reviewedAt && <Row label="Reviewed On" value={new Date(cert.reviewedAt).toLocaleDateString('en-IN')} />}
        <Row label="Has PDF"            value={cert.hasPdf ? 'Yes' : 'No'} />
      </div>

      <div>
        <Link to="/admin/certificates" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to Certificates
        </Link>
      </div>

      {/* ── Modals ─────────────────────────────── */}
      {modal?.type === 'approve' && (
        <ActionModal
          title="Approve Certificate"
          message={`Approve and issue certificate for ${cert.studentName}? A PDF will be generated automatically.`}
          requireReason={false}
          confirmLabel="Approve"
          confirmClass="bg-green-600 hover:bg-green-700"
          initialMarks={cert.marks || ''}
          initialGrade={cert.grade || ''}
          onClose={() => setModal(null)}
          onConfirm={({ marks, grade, customCertNumber }) => {
            setModal(null);
            doAction(() => approveCertificate(id, { marks: marks || null, grade: grade || null, customCertNumber: customCertNumber || null }));
          }}
        />
      )}
      {modal?.type === 'reject' && (
        <ActionModal
          title="Reject Certificate Request"
          message={`Reject the certificate request for ${cert.studentName}?`}
          requireReason
          reasonLabel="Rejection reason (optional)"
          confirmLabel="Reject"
          confirmClass="bg-red-600 hover:bg-red-700"
          onClose={() => setModal(null)}
          onConfirm={({ reason }) => {
            setModal(null);
            doAction(() => rejectCertificate(id, reason));
          }}
        />
      )}
      {modal?.type === 'revoke' && (
        <ActionModal
          title="Revoke Certificate"
          message={`Revoke certificate ${cert.certificateNumber}? It will show as REVOKED on public verification.`}
          requireReason
          reasonLabel="Revocation reason (optional)"
          confirmLabel="Revoke"
          confirmClass="bg-orange-600 hover:bg-orange-700"
          onClose={() => setModal(null)}
          onConfirm={({ reason }) => {
            setModal(null);
            doAction(() => revokeCertificate(id, reason));
          }}
        />
      )}
    </div>
  );
}
