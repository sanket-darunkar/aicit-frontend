import React, { useState, useEffect, useCallback } from 'react';
import { listBatches, getBatch, downloadBatchZip } from '../../services/instituteService.js';
import { PAYMENT } from '../../config/siteConfig.js';
import NewBatchModal from '../../components/institute/NewBatchModal.jsx';
import BatchPaymentPanel from '../../components/institute/BatchPaymentPanel.jsx';
import {
  PageHeader, Toolbar, FilterPills, DataTable,
  Pagination, StatusBadge, Modal, ErrorBanner,
} from '../../components/ui/index.js';

const money = (n) => `${PAYMENT.currencySymbol}${Number(n ?? 0).toLocaleString('en-IN')}`;

const STATUS_TABS = [
  { value: '',                     label: 'All' },
  { value: 'PENDING',              label: 'Awaiting payment' },
  { value: 'VERIFICATION_PENDING', label: 'Under verification' },
  { value: 'PAID',                 label: 'Paid' },
  { value: 'REJECTED',             label: 'Rejected' },
];

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

  const columns = [
    {
      key: 'batchCode', header: 'Batch', primary: true,
      render: (b) => (
        <div className="min-w-0">
          <span className="font-mono text-xs font-semibold text-primary-800 block truncate">{b.batchCode}</span>
          <span className="text-[11px] text-gray-400">{b.type === 'BULK' ? 'Bulk' : 'Single'}</span>
        </div>
      ),
    },
    { key: 'type', header: 'Type', hideOnMobile: true, render: (b) => (b.type === 'BULK' ? 'Bulk' : 'Single') },
    { key: 'certificateCount', header: 'Certs', render: (b) => b.certificateCount },
    { key: 'totalAmount', header: 'Amount', render: (b) => <span className="font-semibold text-gray-800">{money(b.totalAmount)}</span> },
    { key: 'paymentStatus', header: 'Payment', render: (b) => <StatusBadge status={b.paymentStatus} /> },
    { key: 'batchStatus', header: 'Status', render: (b) => <StatusBadge status={b.batchStatus} /> },
    {
      key: 'actions', header: 'Actions', align: 'right',
      render: (b) => (
        <div className="flex items-center gap-2.5 flex-wrap justify-end">
          {canPay(b) && (
            <button onClick={() => openPayment(b)} disabled={busyId === b.id}
              className="text-xs font-semibold text-primary-600 hover:underline disabled:opacity-50">
              {b.paymentStatus === 'REJECTED' ? 'Re-pay' : 'Pay now'}
            </button>
          )}
          {canDownload(b) && (
            <button onClick={() => handleDownloadZip(b)} disabled={busyId === b.id}
              className="text-xs font-semibold text-trust-700 hover:underline disabled:opacity-50">
              ⬇ Download ZIP
            </button>
          )}
          {b.paymentStatus === 'REJECTED' && b.paymentRejectionReason && (
            <span className="text-xs text-red-500 cursor-help" title={b.paymentRejectionReason}>ⓘ</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Certificate Batches" icon="🧾"
        subtitle={`${pagination.totalElements} total · ${money(PAYMENT.unitAmount)} per certificate`}
        actions={<button onClick={() => setShowNew(true)} className="btn-primary text-sm">+ New Application</button>} />

      <Toolbar>
        <div className="flex-1 min-w-0">
          <FilterPills options={STATUS_TABS} value={filter}
            onChange={(v) => { setFilter(v); setPage(0); }} />
        </div>
      </Toolbar>

      <ErrorBanner message={error} onRetry={load} />

      <DataTable
        columns={columns}
        rows={batches}
        rowKey={(b) => b.id}
        loading={loading}
        empty={{
          icon: '🧾',
          title: 'No batches yet',
          message: 'Create your first application to request certificates.',
          action: { onClick: () => setShowNew(true), label: '+ New Application' },
        }}
      />

      <Pagination page={page} totalPages={pagination.totalPages}
        pageSize={20} totalElements={pagination.totalElements}
        onChange={setPage} />

      {/* New application modal */}
      {showNew && (
        <NewBatchModal onClose={() => setShowNew(false)}
          onComplete={() => { setShowNew(false); load(); }} />
      )}

      {/* Resume-payment modal */}
      <Modal open={!!payBatch} onClose={() => { setPayBatch(null); load(); }}
        title="Payment" size="lg">
        {payBatch && (
          <BatchPaymentPanel batch={payBatch}
            onClose={() => { setPayBatch(null); load(); }}
            onPaid={() => { /* confirmation shown; close via Done */ }} />
        )}
      </Modal>
    </div>
  );
}
