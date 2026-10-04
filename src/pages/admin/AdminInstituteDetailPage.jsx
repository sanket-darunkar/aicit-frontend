import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getInstitute, approveInstitute, rejectInstitute,
  suspendInstitute, activateInstitute, deactivateInstitute,
  resetInstitutePassword, deleteInstitute,
} from '../../services/adminService.js';

const STATUS_COLORS = {
  PENDING_REVIEW: 'bg-amber-100 text-amber-800',
  APPROVED:       'bg-green-100 text-green-800',
  SUSPENDED:      'bg-orange-100 text-orange-800',
  DEACTIVATED:    'bg-gray-100 text-gray-600',
  REJECTED:       'bg-red-100 text-red-800',
};

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2 border-b border-gray-50">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider sm:w-44 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-900">{value || '—'}</span>
    </div>
  );
}

/** Generic confirmation modal supporting optional reason textarea */
function ConfirmModal({ title, message, requireReason = false, reasonLabel = 'Reason (optional)',
                        confirmLabel = 'Confirm', confirmClass = 'bg-red-600 hover:bg-red-700',
                        onConfirm, onClose }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
        <h3 className="text-lg font-heading font-bold text-primary-900">{title}</h3>
        <p className="text-sm text-gray-600">{message}</p>
        {requireReason !== false && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{reasonLabel}</label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Enter reason…"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
        )}
        <div className="flex gap-3 justify-end pt-1">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={() => onConfirm(reason)}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${confirmClass}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Modal that shows a newly reset password */
function PasswordResetModal({ password, email, onClose }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(password).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
        <h3 className="text-lg font-heading font-bold text-primary-900">🔑 Password Reset</h3>
        <p className="text-sm text-gray-600">A new password has been generated for <strong>{email}</strong>. Please share it securely with the institute.</p>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <span className="font-mono text-sm font-bold text-primary-900 flex-1 select-all">{password}</span>
          <button onClick={copy}
            className="text-xs font-medium text-primary-600 hover:text-primary-800 transition-colors">
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
          ⚠️ This password will not be shown again. Copy it now.
        </p>
        <div className="flex justify-end">
          <button onClick={onClose} className="btn-primary text-sm">Done</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminInstituteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [institute, setInstitute] = useState(null);
  const [loading,    setLoading]  = useState(true);
  const [error,      setError]    = useState(null);
  const [actionLoading, setAL]    = useState(false);

  // Modal state
  const [modal, setModal]             = useState(null);  // { type, ... }
  const [newPassword, setNewPassword] = useState(null);  // for reset-password result

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

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;
  if (error && !institute) return <div className="p-6 text-red-600">{error}</div>;
  if (!institute) return null;

  const st = institute.status;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/admin/institutes" className="hover:text-primary-700">Institutes</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{institute.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-900">{institute.name}</h1>
          <p className="text-sm text-gray-500 font-mono mt-1">{institute.instituteCode}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[st] || 'bg-gray-100 text-gray-600'}`}>
          {st?.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {/* PENDING_REVIEW: approve + reject */}
        {st === 'PENDING_REVIEW' && (
          <>
            <button disabled={actionLoading}
              onClick={() => doAction(() => approveInstitute(id))}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
              ✅ Approve
            </button>
            <button disabled={actionLoading}
              onClick={() => setModal({ type: 'reject' })}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
              ❌ Reject
            </button>
          </>
        )}

        {/* APPROVED: suspend + deactivate */}
        {st === 'APPROVED' && (
          <>
            <button disabled={actionLoading}
              onClick={() => setModal({ type: 'suspend' })}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
              ⏸ Suspend
            </button>
            <button disabled={actionLoading}
              onClick={() => setModal({ type: 'deactivate' })}
              className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
              🚫 Deactivate
            </button>
          </>
        )}

        {/* SUSPENDED: re-activate + deactivate */}
        {st === 'SUSPENDED' && (
          <>
            <button disabled={actionLoading}
              onClick={() => doAction(() => activateInstitute(id))}
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
              ▶ Re-activate
            </button>
            <button disabled={actionLoading}
              onClick={() => setModal({ type: 'deactivate' })}
              className="px-5 py-2.5 bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
              🚫 Deactivate
            </button>
          </>
        )}

        {/* DEACTIVATED: re-activate */}
        {st === 'DEACTIVATED' && (
          <button disabled={actionLoading}
            onClick={() => doAction(() => activateInstitute(id))}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
            ▶ Re-activate
          </button>
        )}

        {/* REJECTED: re-approve */}
        {st === 'REJECTED' && (
          <button disabled={actionLoading}
            onClick={() => doAction(() => approveInstitute(id))}
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
            ✅ Approve Anyway
          </button>
        )}

        {/* Reset password — only for institutes that have a user account */}
        {(st === 'APPROVED' || st === 'SUSPENDED' || st === 'DEACTIVATED') && (
          <button disabled={actionLoading}
            onClick={() => setModal({ type: 'reset-password' })}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
            🔑 Reset Password
          </button>
        )}

        {/* Delete — only safe for PENDING_REVIEW or REJECTED (no data attached) */}
        {(st === 'PENDING_REVIEW' || st === 'REJECTED') && (
          <button disabled={actionLoading}
            onClick={() => setModal({ type: 'delete' })}
            className="px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
            🗑 Delete
          </button>
        )}
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-heading font-bold text-primary-900 mb-4">Institute Details</h2>
        <DetailRow label="Institute Code"   value={institute.instituteCode} />
        <DetailRow label="Name"             value={institute.name} />
        <DetailRow label="Type"             value={institute.type} />
        <DetailRow label="Address"          value={[institute.addressLine1, institute.addressLine2, institute.city, institute.district, institute.state, institute.pinCode].filter(Boolean).join(', ')} />
        <DetailRow label="Website"          value={institute.websiteUrl} />
        <DetailRow label="Contact Person"   value={institute.contactPersonName} />
        <DetailRow label="Email"            value={institute.contactEmail} />
        <DetailRow label="Mobile"           value={institute.contactMobile} />
        <DetailRow label="Applied On"       value={institute.createdAt ? new Date(institute.createdAt).toLocaleDateString('en-IN') : '—'} />
        {institute.approvedAt    && <DetailRow label="Approved On"      value={new Date(institute.approvedAt).toLocaleDateString('en-IN')} />}
        {institute.rejectionReason  && <DetailRow label="Rejection Reason"  value={institute.rejectionReason} />}
        {institute.suspensionReason && <DetailRow label="Suspension Reason" value={institute.suspensionReason} />}
      </div>

      <div className="flex gap-3">
        <Link to={`/admin/students?instituteId=${id}`} className="btn-outline text-sm">
          View Students
        </Link>
        <Link to="/admin/institutes" className="text-sm text-gray-500 hover:text-gray-700 self-center">
          ← Back to Institutes
        </Link>
      </div>

      {/* ── Modals ─────────────────────────────────────────── */}
      {modal?.type === 'reject' && (
        <ConfirmModal
          title="Reject Institute Application"
          message={`Reject "${institute.name}"? The applicant will be notified.`}
          requireReason
          reasonLabel="Rejection reason (optional)"
          confirmLabel="Reject"
          confirmClass="bg-red-600 hover:bg-red-700"
          onClose={() => setModal(null)}
          onConfirm={async (reason) => {
            setModal(null);
            await doAction(() => rejectInstitute(id, reason));
          }}
        />
      )}

      {modal?.type === 'suspend' && (
        <ConfirmModal
          title="Suspend Institute"
          message={`Suspend "${institute.name}"? The institute will lose portal access immediately.`}
          requireReason
          reasonLabel="Suspension reason (optional)"
          confirmLabel="Suspend"
          confirmClass="bg-orange-600 hover:bg-orange-700"
          onClose={() => setModal(null)}
          onConfirm={async (reason) => {
            setModal(null);
            await doAction(() => suspendInstitute(id, reason));
          }}
        />
      )}

      {modal?.type === 'deactivate' && (
        <ConfirmModal
          title="Deactivate Institute"
          message={`Permanently deactivate "${institute.name}"? This action is difficult to reverse.`}
          requireReason={false}
          confirmLabel="Deactivate"
          confirmClass="bg-gray-700 hover:bg-gray-800"
          onClose={() => setModal(null)}
          onConfirm={async () => {
            setModal(null);
            await doAction(() => deactivateInstitute(id));
          }}
        />
      )}

      {modal?.type === 'reset-password' && (
        <ConfirmModal
          title="Reset Institute Password"
          message={`Generate a new login password for "${institute.name}"? The current password will be invalidated.`}
          requireReason={false}
          confirmLabel="Reset Password"
          confirmClass="bg-indigo-600 hover:bg-indigo-700"
          onClose={() => setModal(null)}
          onConfirm={async () => {
            setModal(null);
            setAL(true);
            try {
              const res = await resetInstitutePassword(id);
              setNewPassword(res.data);
            } catch (err) { setError(err.message); }
            finally { setAL(false); }
          }}
        />
      )}

      {modal?.type === 'delete' && (
        <ConfirmModal
          title="⚠️ Permanently Delete Institute"
          message={`Delete "${institute.name}" permanently? This cannot be undone. Only institutes with no students or certificates can be deleted.`}
          requireReason={false}
          confirmLabel="Yes, Delete"
          confirmClass="bg-red-700 hover:bg-red-800"
          onClose={() => setModal(null)}
          onConfirm={async () => {
            setModal(null);
            setAL(true);
            try {
              await deleteInstitute(id);
              navigate('/admin/institutes', { replace: true });
            } catch (err) { setError(err.message); }
            finally { setAL(false); }
          }}
        />
      )}

      {newPassword && (
        <PasswordResetModal
          password={newPassword}
          email={institute.contactEmail}
          onClose={() => setNewPassword(null)}
        />
      )}
    </div>
  );
}
