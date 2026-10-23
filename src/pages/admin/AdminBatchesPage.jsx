import React, { useState, useEffect, useCallback } from 'react';
import {
  listAdminBatches,
  getAdminBatch,
  verifyBatchPayment,
  rejectBatchPayment,
  processBatch,
  downloadAdminBatchZip,
} from '../../services/adminService.js';
import {
  PageHeader, Toolbar, FilterPills, DataTable, Pagination,
  StatusBadge, Modal, ErrorBanner, Spinner,
} from '../../components/ui/index.js';

const money = (n) => `₹${Number(n ?? 0).toLocaleString('en-IN')}`;

// Reason modal (reject) — kit Modal
function ReasonModal({ title, message, confirmLabel, onConfirm, onCancel, busy }) {
  const [reason, setReason] = useState('');
  return (
    <Modal open onClose={() => !busy && onCancel()} title={title}
      footer={<>
        <button onClick={onCancel} disabled={busy} className="btn-ghost text-sm">Cancel</button>
        <button onClick={() => onConfirm(reason)} disabled={busy}
          className="text-sm px-4 py-2 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50">
          {busy ? 'Working…' : confirmLabel}
        </button>
      </>}>
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      <textarea rows={3} placeholder="Reason (optional)" value={reason}
        onChange={e => setReason(e.target.value)}
        className="input resize-none" />
    </Modal>
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
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-primary-950/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white h-full overflow-y-auto shadow-hero flex flex-col animate-slide-in-left">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 flex-shrink-0">
          <h3 className="text-base font-heading font-bold text-primary-900 truncate">
            {batch?.batchCode || 'Batch'}
          </h3>
          <button onClick={onClose}
            className="p-1.5 -mr-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-surface-100 transition-colors flex-shrink-0"
            aria-label="Close">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <ErrorBanner message={error} />

          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <Spinner className="w-7 h-7" label="Loading…" />
            </div>
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
                <Info label="Payment" value={<StatusBadge status={batch.paymentStatus} />} />
                <Info label="Status" value={<StatusBadge status={batch.batchStatus} />} />
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
                <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                  {(batch.certificates ?? []).map(c => (
                    <div key={c.id} className="flex items-center gap-3 px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-800 truncate">{c.studentName}</p>
                        <p className="text-xs text-gray-500 truncate">{c.courseName}</p>
                      </div>
                      <span className="font-mono text-xs text-gray-400 hidden sm:block truncate max-w-[140px]">
                        {c.certificateNumber || '—'}
                      </span>
                      <StatusBadge status={c.status} size="sm" />
                    </div>
                  ))}
                  {(!batch.certificates || batch.certificates.length === 0) && (
                    <div className="px-3 py-4 text-center text-gray-400 text-xs">No certificates</div>
                  )}
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

const TABS = [
  { value: 'VERIFICATION_PENDING', label: 'To verify' },
  { value: 'PAID',                 label: 'Paid' },
  { value: 'PENDING',              label: 'Awaiting payment' },
  { value: 'REJECTED',             label: 'Rejected' },
  { value: '',                     label: 'All' },
];

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

  const columns = [
    {
      key: 'batchCode', header: 'Batch', primary: true,
      render: (b) => (
        <div className="min-w-0">
          <span className="font-mono text-xs text-primary-800 font-semibold block truncate">{b.batchCode}</span>
          <span className="text-[11px] text-gray-400 truncate block max-w-[160px]">{b.instituteName}</span>
        </div>
      ),
    },
    { key: 'type', header: 'Type', hideOnMobile: true, render: (b) => b.type === 'BULK' ? 'Bulk' : 'Single' },
    { key: 'certs', header: 'Certs', render: (b) => b.certificateCount },
    { key: 'amount', header: 'Amount', render: (b) => <span className="font-semibold text-gray-800">{money(b.totalAmount)}</span> },
    { key: 'utr', header: 'UTR', hideOnMobile: true, render: (b) => <span className="font-mono text-xs text-gray-400">{b.utrNumber || '—'}</span> },
    { key: 'payment', header: 'Payment', render: (b) => <StatusBadge status={b.paymentStatus} /> },
    { key: 'status', header: 'Status', render: (b) => <StatusBadge status={b.batchStatus} /> },
    {
      key: 'actions', header: 'Actions', align: 'right',
      render: (b) => (
        <button onClick={(e) => { e.stopPropagation(); setDetailId(b.id); }}
          className="text-xs font-semibold text-primary-600 hover:underline">Review →</button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Certificate Batches" icon="🧾"
        subtitle={`${pagination.totalElements} total · verify payments & generate certificates`} />

      <Toolbar>
        <div className="flex-1 min-w-0">
          <FilterPills options={TABS} value={filter} onChange={(v) => { setFilter(v); setPage(0); }} />
        </div>
      </Toolbar>

      <ErrorBanner message={error} onRetry={load} />

      <DataTable
        columns={columns}
        rows={batches}
        rowKey={(b) => b.id}
        onRowClick={(b) => setDetailId(b.id)}
        loading={loading}
        empty={{ icon: '🧾', title: 'No batches found', message: 'Try a different filter.' }}
      />

      <Pagination page={page} totalPages={pagination.totalPages}
        pageSize={20} totalElements={pagination.totalElements}
        onChange={setPage} />

      {detailId && (
        <BatchDetail batchId={detailId}
          onClose={() => setDetailId(null)}
          onChanged={load} />
      )}
    </div>
  );
}
