import React, { useState, useEffect, useCallback } from 'react';
import {
  listAdminBatches,
  getAdminBatch,
  verifyBatchPayment,
  rejectBatchPayment,
  processBatch,
  downloadAdminBatchZip,
} from '../../services/adminService.js';

const money = (n) => `₹${Number(n ?? 0).toLocaleString('en-IN')}`;
const pretty = (s) => (s || '').replace(/_/g, ' ');

const PAY_BADGE = {
  PENDING:              'bg-yellow-100 text-yellow-800',
  UTR_SUBMITTED:        'bg-blue-100 text-blue-700',
  VERIFICATION_PENDING: 'bg-blue-100 text-blue-700',
  PAID:                 'bg-green-100 text-green-700',
  REJECTED:             'bg-red-100 text-red-700',
};
const BATCH_BADGE = {
  DRAFT:      'bg-gray-100 text-gray-600',
  VALIDATED:  'bg-gray-100 text-gray-600',
  SUBMITTED:  'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-amber-100 text-amber-700',
  GENERATED:  'bg-emerald-100 text-emerald-800',
  COMPLETED:  'bg-green-100 text-green-700',
  REJECTED:   'bg-red-100 text-red-700',
};

const Badge = ({ map, value }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[value] || 'bg-gray-100 text-gray-600'}`}>
    {pretty(value)}
  </span>
);

// Reason modal (reject)
function ReasonModal({ title, message, confirmLabel, onConfirm, onCancel, busy }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <textarea rows={3} placeholder="Reason (optional)" value={reason}
          onChange={e => setReason(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-4 resize-none
                     focus:outline-none focus:ring-2 focus:ring-primary-500" />
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} disabled={busy}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">Cancel</button>
          <button onClick={() => onConfirm(reason)} disabled={busy}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50">
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Batch detail drawer with verify / reject / process actions
function BatchDetail({ batchId, onClose, onChanged }) {
  const [batch, setBatch]   = useState(null);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState(null);
  const [busy, setBusy]     = useState(false);
  const [reject, setReject] = useState(false);

  const load = useCallback(async () => {
    setLoad(true); setError(null);
    try { const res = await getAdminBatch(batchId); setBatch(res.data); }
    catch (err) { setError(err.message); }
    finally { setLoad(false); }
  }, [batchId]);

  useEffect(() => { load(); }, [load]);

  const run = async (fn) => {
    setBusy(true); setError(null);
    try { const res = await fn(); setBatch(res.data); onChanged?.(); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const handleVerify  = () => run(() => verifyBatchPayment(batchId));
  const handleProcess = () => run(() => processBatch(batchId));
  const handleReject  = (reason) => { setReject(false); run(() => rejectBatchPayment(batchId, reason)); };

  const handleZip = async () => {
    setBusy(true);
    try {
      const blob = await downloadAdminBatchZip(batchId);
      if (!blob || blob.size === 0) { alert('No issued certificates to download yet.'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${batch?.batchCode || 'batch'}.zip`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { alert('Download failed: ' + err.message); }
    finally { setBusy(false); }
  };

  const canVerify  = batch && (batch.paymentStatus === 'VERIFICATION_PENDING' || batch.paymentStatus === 'UTR_SUBMITTED') && !!batch.utrNumber;
  const canReject  = batch && batch.paymentStatus !== 'PAID';
  const canProcess = batch && batch.paymentStatus === 'PAID' && !['PROCESSING', 'COMPLETED'].includes(batch.batchStatus);
  const canZip     = batch && ['GENERATED', 'COMPLETED'].includes(batch.batchStatus);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl animate-slide-in-left">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-heading font-bold text-primary-900">
            {batch?.batchCode || 'Batch'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100" aria-label="Close">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

          {loading ? (
            <div className="py-16 text-center text-gray-400">Loading…</div>
          ) : !batch ? (
            <div className="py-16 text-center text-gray-400">Batch not found.</div>
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label="Institute" value={batch.instituteName} />
                <Info label="Type" value={batch.type === 'BULK' ? 'Bulk' : 'Single'} />
                <Info label="Certificates" value={batch.certificateCount} />
                <Info label="Amount" value={money(batch.totalAmount)} />
                <Info label="Payment" value={<Badge map={PAY_BADGE} value={batch.paymentStatus} />} />
                <Info label="Status" value={<Badge map={BATCH_BADGE} value={batch.batchStatus} />} />
                <Info label="UTR" value={batch.utrNumber || '—'} mono />
                <Info label="Paid at" value={batch.paidAt ? new Date(batch.paidAt).toLocaleString() : '—'} />
              </div>

              {batch.paymentRejectionReason && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <strong>Rejection reason:</strong> {batch.paymentRejectionReason}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                {canVerify && (
                  <button onClick={handleVerify} disabled={busy}
                    className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50">
                    ✓ Verify payment
                  </button>
                )}
                {canReject && (
                  <button onClick={() => setReject(true)} disabled={busy}
                    className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 rounded-lg disabled:opacity-50">
                    Reject payment
                  </button>
                )}
                {canProcess && (
                  <button onClick={handleProcess} disabled={busy}
                    className="px-4 py-2 text-sm font-semibold text-white bg-primary-800 hover:bg-primary-700 rounded-lg disabled:opacity-50">
                    ⚙ Process &amp; generate
                  </button>
                )}
                {canZip && (
                  <button onClick={handleZip} disabled={busy}
                    className="px-4 py-2 text-sm font-semibold text-primary-700 border border-primary-200 hover:bg-primary-50 rounded-lg disabled:opacity-50">
                    ⬇ Download ZIP
                  </button>
                )}
                {batch.paymentStatus === 'PENDING' && (
                  <p className="text-xs text-gray-400 self-center">Awaiting institute payment / UTR.</p>
                )}
              </div>

              {/* Certificates */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Certificates</p>
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-50">
                      {(batch.certificates ?? []).map(c => (
                        <tr key={c.id}>
                          <td className="px-3 py-2 text-gray-800">{c.studentName}</td>
                          <td className="px-3 py-2 text-gray-500 max-w-[160px] truncate">{c.courseName}</td>
                          <td className="px-3 py-2 font-mono text-xs text-gray-400">{c.certificateNumber || '—'}</td>
                          <td className="px-3 py-2">
                            <span className="text-xs font-semibold text-gray-600">{pretty(c.status)}</span>
                          </td>
                        </tr>
                      ))}
                      {(!batch.certificates || batch.certificates.length === 0) && (
                        <tr><td className="px-3 py-4 text-center text-gray-400 text-xs">No certificates</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {reject && (
        <ReasonModal
          title="Reject payment"
          message={`Reject payment for ${batch?.batchCode}? The institute can re-submit a new UTR.`}
          confirmLabel="Reject"
          busy={busy}
          onCancel={() => setReject(false)}
          onConfirm={handleReject}
        />
      )}
    </div>
  );
}

function Info({ label, value, mono }) {
  return (
    <div>
      <div className="text-xs text-gray-400 uppercase">{label}</div>
      <div className={`font-medium text-gray-800 ${mono ? 'font-mono text-xs' : ''}`}>{value}</div>
    </div>
  );
}

export default function AdminBatchesPage() {
  const [batches, setBatches]       = useState([]);
  const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0 });
  const [filter, setFilter]         = useState('VERIFICATION_PENDING');
  const [page, setPage]             = useState(0);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [detailId, setDetailId]     = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await listAdminBatches({ page, size: 20, paymentStatus: filter });
      setBatches(res.data?.content ?? []);
      setPagination({ totalElements: res.data?.totalElements ?? 0, totalPages: res.data?.totalPages ?? 0 });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  const TABS = [
    ['VERIFICATION_PENDING', 'To verify'],
    ['PAID', 'Paid'],
    ['PENDING', 'Awaiting payment'],
    ['REJECTED', 'Rejected'],
    ['', 'All'],
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-900">Certificate Batches</h1>
          <p className="text-sm text-gray-500">{pagination.totalElements} total · verify payments &amp; generate certificates</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map(([val, label]) => (
          <button key={val} onClick={() => { setFilter(val); setPage(0); }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors
              ${filter === val ? 'bg-primary-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>Loading…
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">🧾</div>
            <p>No batches found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Batch', 'Institute', 'Type', 'Certs', 'Amount', 'UTR', 'Payment', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {batches.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setDetailId(b.id)}>
                    <td className="px-4 py-3 font-mono text-xs">{b.batchCode}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-[140px] truncate">{b.instituteName}</td>
                    <td className="px-4 py-3 text-gray-600">{b.type === 'BULK' ? 'Bulk' : 'Single'}</td>
                    <td className="px-4 py-3 text-gray-800">{b.certificateCount}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{money(b.totalAmount)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{b.utrNumber || '—'}</td>
                    <td className="px-4 py-3"><Badge map={PAY_BADGE} value={b.paymentStatus} /></td>
                    <td className="px-4 py-3"><Badge map={BATCH_BADGE} value={b.batchStatus} /></td>
                    <td className="px-4 py-3">
                      <button onClick={(e) => { e.stopPropagation(); setDetailId(b.id); }}
                        className="text-xs text-primary-600 hover:underline font-semibold">Review →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40">← Previous</button>
          <span className="text-sm text-gray-500">Page {page + 1} of {pagination.totalPages}</span>
          <button disabled={page >= pagination.totalPages - 1} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40">Next →</button>
        </div>
      )}

      {detailId && (
        <BatchDetail batchId={detailId}
          onClose={() => setDetailId(null)}
          onChanged={load} />
      )}
    </div>
  );
}
