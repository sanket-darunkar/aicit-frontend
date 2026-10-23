import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getInstitute, approveInstitute, rejectInstitute,
  suspendInstitute, activateInstitute, deactivateInstitute,
  resetInstitutePassword, deleteInstitute,
} from '../../services/adminService.js';
import {
  PageHeader, DetailCard, DetailRow, StatusBadge, Modal,
  LoadingState, ErrorState, ErrorBanner,
} from '../../components/ui/index.js';

/** Confirmation modal (optional reason) built on the shared Modal shell. */
function ConfirmModal({ title, message, requireReason = false, reasonLabel = 'Reason (optional)',
                        confirmLabel = 'Confirm', confirmClass = 'bg-red-600 hover:bg-red-700',
                        onConfirm, onClose }) {
  const [reason, setReason] = useState('');
  const [busy, setBusy]     = useState(false);
  const handleConfirm = async () => {
    if (busy) return;
    setBusy(true);
    try { await onConfirm(reason); } finally { setBusy(false); }
  };
  return (
    <Modal open onClose={busy ? undefined : onClose} title={title}
      footer={<>
        <button onClick={onClose} disabled={busy} className="btn-ghost text-sm">Cancel</button>
        <button onClick={handleConfirm} disabled={busy}
          className={`text-sm px-4 py-2 rounded-xl font-semibold text-white transition-colors disabled:opacity-60 ${confirmClass}`}>
          {busy ? 'Please wait…' : confirmLabel}
        </button>
      </>}>
      <p className="text-sm text-gray-600">{message}</p>
      {requireReason && (
        <div className="mt-4">
          <label className="label">{reasonLabel}</label>
          <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)}
            placeholder="Enter reason…" className="input resize-none" />
        </div>
      )}
    </Modal>
  );
}

/** Shows a newly reset password with copy-to-clipboard. */
function PasswordResetModal({ password, email, onClose }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(password).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };
  return (
    <Modal open onClose={onClose} title="Password Reset" subtitle={email}
      footer={<button onClick={onClose} className="btn-primary text-sm">Done</button>}>
      <p className="text-sm text-gray-600">
        A new password has been generated for <strong>{email}</strong>. Share it securely with the institute.
      </p>
      <div className="flex items-center gap-2 bg-surface-50 border border-gray-200 rounded-xl px-4 py-3 mt-4">
        <span className="font-mono text-base font-bold text-primary-900 flex-1 select-all tracking-wide break-all">{password}</span>
        <button onClick={copy}
          className="px-3 py-1.5 rounded-lg bg-primary-100 text-xs font-semibold text-primary-700 hover:bg-primary-200 transition-colors flex-shrink-0">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mt-3">
        <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className="text-xs text-amber-800">
          This password won&apos;t be shown again. Copy it now. The institute has also been emailed these credentials.
        </p>
      </div>
    </Modal>
  );
}

const btn = 'px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50';

export default function AdminInstituteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [actionLoading, setAL]    = useState(false);
  const [modal, setModal]         = useState(null);
  const [newPassword, setNewPassword] = useState(null);

  const load = async () => {
    setLoading(true); setError(null);
    try { const res = await getInstitute(id); setInstitute(res.data); }
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

  if (loading) return <LoadingState label="Loading institute…" />;
  if (error && !institute) return <ErrorState message={error} onRetry={load} backTo="/admin/institutes" backLabel="Back to Institutes" />;
  if (!institute) return null;

  const st = institute.status;

  return (
    <div className="space-y-5 max-w-3xl">
      <PageHeader
        title={institute.name}
        subtitle={<span className="font-mono">{institute.instituteCode}</span>}
        breadcrumbs={[{ label: 'Institutes', to: '/admin/institutes' }, { label: institute.name }]}
        actions={<StatusBadge status={st} />}
      />

      {/* Action buttons (identical logic & conditions to before) */}
      <div className="flex flex-wrap gap-2.5">
        {st === 'PENDING_REVIEW' && <>
          <button disabled={actionLoading} onClick={() => doAction(() => approveInstitute(id))}
            className={`${btn} bg-trust-600 hover:bg-trust-700`}>Approve</button>
          <button disabled={actionLoading} onClick={() => setModal({ type: 'reject' })}
            className={`${btn} bg-red-600 hover:bg-red-700`}>Reject</button>
        </>}
        {st === 'APPROVED' && <>
          <button disabled={actionLoading} onClick={() => setModal({ type: 'suspend' })}
            className={`${btn} bg-orange-500 hover:bg-orange-600`}>Suspend</button>
          <button disabled={actionLoading} onClick={() => setModal({ type: 'deactivate' })}
            className={`${btn} bg-gray-600 hover:bg-gray-700`}>Deactivate</button>
        </>}
        {st === 'SUSPENDED' && <>
          <button disabled={actionLoading} onClick={() => doAction(() => activateInstitute(id))}
            className={`${btn} bg-trust-600 hover:bg-trust-700`}>Re-activate</button>
          <button disabled={actionLoading} onClick={() => setModal({ type: 'deactivate' })}
            className={`${btn} bg-gray-600 hover:bg-gray-700`}>Deactivate</button>
        </>}
        {st === 'DEACTIVATED' && (
          <button disabled={actionLoading} onClick={() => doAction(() => activateInstitute(id))}
            className={`${btn} bg-trust-600 hover:bg-trust-700`}>Re-activate</button>
        )}
        {st === 'REJECTED' && (
          <button disabled={actionLoading} onClick={() => doAction(() => approveInstitute(id))}
            className={`${btn} bg-trust-600 hover:bg-trust-700`}>Approve Anyway</button>
        )}
        {(st === 'APPROVED' || st === 'SUSPENDED' || st === 'DEACTIVATED') && (
          <button disabled={actionLoading} onClick={() => setModal({ type: 'reset-password' })}
            className={`${btn} bg-indigo-600 hover:bg-indigo-700`}>Reset Password</button>
        )}
        {(st === 'PENDING_REVIEW' || st === 'REJECTED') && (
          <button disabled={actionLoading} onClick={() => setModal({ type: 'delete' })}
            className={`${btn} bg-red-700 hover:bg-red-800`}>Delete</button>
        )}
      </div>

      <ErrorBanner message={error} />

      <DetailCard title="Institute Details" icon="🏫"
        actions={<Link to={`/admin/students?instituteId=${id}`} className="text-xs font-semibold text-primary-700 hover:underline">View Students →</Link>}>
        <DetailRow label="Institute Code" value={institute.instituteCode} mono />
        <DetailRow label="Name" value={institute.name} />
        <DetailRow label="Type" value={institute.type} />
        <DetailRow label="Address" value={[institute.addressLine1, institute.addressLine2, institute.city, institute.district, institute.state, institute.pinCode].filter(Boolean).join(', ') || null} />
        <DetailRow label="Website" value={institute.websiteUrl} />
        <DetailRow label="Contact Person" value={institute.contactPersonName} />
        <DetailRow label="Email" value={institute.contactEmail} />
        <DetailRow label="Mobile" value={institute.contactMobile} />
        <DetailRow label="Applied On" value={institute.createdAt ? new Date(institute.createdAt).toLocaleDateString('en-IN') : null} />
        {institute.approvedAt && <DetailRow label="Approved On" value={new Date(institute.approvedAt).toLocaleDateString('en-IN')} />}
        {institute.rejectionReason && <DetailRow label="Rejection Reason" value={institute.rejectionReason} />}
        {institute.suspensionReason && <DetailRow label="Suspension Reason" value={institute.suspensionReason} />}
      </DetailCard>

      {/* ── Modals (same actions/handlers as before) ── */}
      {modal?.type === 'reject' && (
        <ConfirmModal title="Reject Institute Application"
          message={`Reject "${institute.name}"? The applicant will be notified.`}
          requireReason reasonLabel="Rejection reason (optional)" confirmLabel="Reject"
          confirmClass="bg-red-600 hover:bg-red-700"
          onClose={() => setModal(null)}
          onConfirm={async (reason) => { setModal(null); await doAction(() => rejectInstitute(id, reason)); }} />
      )}
      {modal?.type === 'suspend' && (
        <ConfirmModal title="Suspend Institute"
          message={`Suspend "${institute.name}"? The institute will lose portal access immediately.`}
          requireReason reasonLabel="Suspension reason (optional)" confirmLabel="Suspend"
          confirmClass="bg-orange-600 hover:bg-orange-700"
          onClose={() => setModal(null)}
          onConfirm={async (reason) => { setModal(null); await doAction(() => suspendInstitute(id, reason)); }} />
      )}
      {modal?.type === 'deactivate' && (
        <ConfirmModal title="Deactivate Institute"
          message={`Permanently deactivate "${institute.name}"? This action is difficult to reverse.`}
          confirmLabel="Deactivate" confirmClass="bg-gray-700 hover:bg-gray-800"
          onClose={() => setModal(null)}
          onConfirm={async () => { setModal(null); await doAction(() => deactivateInstitute(id)); }} />
      )}
      {modal?.type === 'reset-password' && (
        <ConfirmModal title="Reset Institute Password"
          message={`Generate a new login password for "${institute.name}"? The current password will be invalidated.`}
          confirmLabel="Reset Password" confirmClass="bg-indigo-600 hover:bg-indigo-700"
          onClose={() => setModal(null)}
          onConfirm={async () => {
            setModal(null); setAL(true);
            try { const res = await resetInstitutePassword(id); setNewPassword(res.data); }
            catch (err) { setError(err.message); } finally { setAL(false); }
          }} />
      )}
      {modal?.type === 'delete' && (
        <ConfirmModal title="Permanently Delete Institute"
          message={`Delete "${institute.name}" permanently? This cannot be undone. Only institutes with no students or certificates can be deleted.`}
          confirmLabel="Yes, Delete" confirmClass="bg-red-700 hover:bg-red-800"
          onClose={() => setModal(null)}
          onConfirm={async () => {
            setModal(null); setAL(true);
            try { await deleteInstitute(id); navigate('/admin/institutes', { replace: true }); }
            catch (err) { setError(err.message); } finally { setAL(false); }
          }} />
      )}
      {newPassword && (
        <PasswordResetModal password={newPassword} email={institute.contactEmail} onClose={() => setNewPassword(null)} />
      )}
    </div>
  );
}
