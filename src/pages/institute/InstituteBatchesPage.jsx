import React, { useState, useEffect, useCallback } from 'react';
import { listBatches, getBatch, downloadBatchZip } from '../../services/instituteService.js';
import { PAYMENT } from '../../config/siteConfig.js';
import NewBatchModal from '../../components/institute/NewBatchModal.jsx';
import BatchPaymentPanel from '../../components/institute/BatchPaymentPanel.jsx';

const money = (n) => `${PAYMENT.currencySymbol}${Number(n ?? 0).toLocaleString('en-IN')}`;

const PAY_BADGE = {
  PENDING:              'badge-gold',
  UTR_SUBMITTED:        'badge-blue',
  VERIFICATION_PENDING: 'badge-blue',
  PAID:                 'badge-green',
  REJECTED:             'badge-red',
};
const BATCH_BADGE = {
  DRAFT:      'badge-gray',
  VALIDATED:  'badge-gray',
  SUBMITTED:  'badge-blue',
  PROCESSING: 'badge-blue',
  GENERATED:  'badge-green',
  COMPLETED:  'badge-green',
  REJECTED:   'badge-red',
};
const pretty = (s) => (s || '').replace(/_/g, ' ');

export default function InstituteBatchesPage() {
  const [batches, setBatches]       = useState([]);
  const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0 });
  const [filter, setFilter]         = useState('');
  const [page, setPage]             = useState(0);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [showNew, setShowNew]       = useState(false);
  const [payBatch, setPayBatch]     = useState(null);   // batch to pay for
  const [busyId, setBusyId]         = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await listBatches({ page, size: 20, paymentStatus: filter });
      setBatches(res.data?.content ?? []);
      setPagination({ totalElements: res.data?.totalElements ?? 0, totalPages: res.data?.totalPages ?? 0 });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [page, filter]);

  useEffect(() => { load(); }, [load]);

  const openPayment = async (batchRow) => {
    // list rows carry null certificates; fetch full batch for the payment summary
    setBusyId(batchRow.id);
    try {
      const res = await getBatch(batchRow.id);
      setPayBatch(res.data ?? batchRow);
    } catch {
      setPayBatch(batchRow);
    } finally { setBusyId(null); }
  };

  const handleDownloadZip = async (batchRow) => {
    setBusyId(batchRow.id);
    try {
      const blob = await downloadBatchZip(batchRow.id);
      if (!blob || blob.size === 0) { alert('No issued certificates to download yet.'); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${batchRow.batchCode}.zip`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Download failed: ' + err.message);
    } finally { setBusyId(null); }
  };

  const canPay      = (b) => b.paymentStatus === 'PENDING' || b.paymentStatus === 'REJECTED';
  const canDownload = (b) => ['GENERATED', 'COMPLETED'].includes(b.batchStatus);

  const TABS = [
    ['', 'All'],
    ['PENDING', 'Awaiting payment'],
    ['VERIFICATION_PENDING', 'Under verification'],
    ['PAID', 'Paid'],
    ['REJECTED', 'Rejected'],
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-900">Certificate Batches</h1>
          <p className="text-sm text-gray-500">{pagination.totalElements} total · {money(PAYMENT.unitAmount)} per certificate</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary text-sm">+ New Application</button>
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
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🧾</div>
            <p className="text-gray-500 font-medium">No batches yet</p>
            <button onClick={() => setShowNew(true)} className="mt-3 text-sm text-primary-700 underline">
              Create your first application →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Batch', 'Type', 'Certs', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {batches.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{b.batchCode}</td>
                    <td className="px-4 py-3 text-gray-600">{b.type === 'BULK' ? 'Bulk' : 'Single'}</td>
                    <td className="px-4 py-3 text-gray-800">{b.certificateCount}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{money(b.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={PAY_BADGE[b.paymentStatus] || 'badge-gray'}>{pretty(b.paymentStatus)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={BATCH_BADGE[b.batchStatus] || 'badge-gray'}>{pretty(b.batchStatus)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {canPay(b) && (
                          <button onClick={() => openPayment(b)} disabled={busyId === b.id}
                            className="text-xs text-primary-600 hover:underline font-semibold disabled:opacity-50">
                            {b.paymentStatus === 'REJECTED' ? 'Re-pay' : 'Pay now'}
                          </button>
                        )}
                        {canDownload(b) && (
                          <button onClick={() => handleDownloadZip(b)} disabled={busyId === b.id}
                            className="text-xs text-trust-700 hover:underline font-semibold disabled:opacity-50">
                            ⬇ Download ZIP
                          </button>
                        )}
                        {b.paymentStatus === 'REJECTED' && b.paymentRejectionReason && (
                          <span className="text-xs text-red-500" title={b.paymentRejectionReason}>ⓘ</span>
                        )}
                      </div>
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

      {/* New application modal */}
      {showNew && (
        <NewBatchModal onClose={() => setShowNew(false)}
          onComplete={() => { setShowNew(false); load(); }} />
      )}

      {/* Resume-payment modal */}
      {payBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-hero max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
              <h3 className="text-lg font-heading font-bold text-primary-900">Payment</h3>
              <button onClick={() => setPayBatch(null)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100" aria-label="Close">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <BatchPaymentPanel batch={payBatch}
                onClose={() => { setPayBatch(null); load(); }}
                onPaid={() => { /* confirmation shown; close via Done */ }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
