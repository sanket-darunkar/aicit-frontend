import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { listCertificates, downloadCertificatePdf } from '../../services/instituteService.js';
import CertificatePreview from '../../components/certificates/CertificatePreview.jsx';
import {
  PageHeader, Toolbar, FilterPills, DataTable,
  Pagination, StatusBadge, ErrorBanner,
} from '../../components/ui/index.js';

const STATUS_TABS = [
  { value: '',             label: 'All' },
  { value: 'REQUESTED',    label: 'Requested' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'ISSUED',       label: 'Issued' },
  { value: 'REJECTED',     label: 'Rejected' },
];

export default function InstituteCertificatesPage() {
  const [certs,      setCerts]      = useState([]);
  const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0 });
  const [statusFilter, setStatus]   = useState('');
  const [page,        setPage]      = useState(0);
  const [loading,     setLoading]   = useState(false);
  const [error,       setError]     = useState(null);
  const [preview,     setPreview]   = useState(null);  // cert being previewed
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await listCertificates({ page, size: 20, status: statusFilter });
      setCerts(res.data?.content ?? []);
      setPagination({ totalElements: res.data?.totalElements ?? 0, totalPages: res.data?.totalPages ?? 0 });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleDownload = async (id, certNumber) => {
    try {
      const blob = await downloadCertificatePdf(id);
      if (!blob || blob.size === 0) { alert('PDF not available yet.'); return; }
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href = url; a.download = `${certNumber}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { alert('Download failed: ' + err.message); }
  };

  const columns = [
    {
      key: 'certificateNumber', header: 'Cert Number', primary: true,
      render: (c) => (
        <div className="min-w-0">
          <span className="font-semibold text-gray-900 block truncate">{c.studentName}</span>
          <span className="font-mono text-[11px] text-gray-400">{c.certificateNumber || '—'}</span>
        </div>
      ),
    },
    { key: 'courseName', header: 'Course',
      render: (c) => <span className="text-gray-600 truncate block max-w-[200px]">{c.courseName}</span> },
    { key: 'status', header: 'Status', render: (c) => <StatusBadge status={c.status} /> },
    {
      key: 'actions', header: 'Actions', align: 'right',
      render: (c) => (
        c.status === 'ISSUED' ? (
          <div className="flex gap-2.5 flex-wrap justify-end items-center">
            <button onClick={() => setPreview(c)}
              className="text-xs font-semibold text-primary-700 hover:underline">👁 Preview</button>
            <button onClick={() => handleDownload(c.id, c.certificateNumber)}
              className="text-xs font-semibold text-gray-500 hover:underline">
              {c.certificateType === 'TYPING' ? '⬇ Typing Certificate' : '⬇ AICIT Certificate'}
            </button>
          </div>
        ) : <span className="text-gray-300 text-xs">—</span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Certificates" icon="📜"
        subtitle={`${pagination.totalElements} total`}
        actions={
          <button onClick={() => navigate('/institute/batches')} className="btn-primary text-sm">
            + Apply for Certificate
          </button>
        } />

      <Toolbar>
        <div className="flex-1 min-w-0">
          <FilterPills options={STATUS_TABS} value={statusFilter}
            onChange={(v) => { setStatus(v); setPage(0); }} />
        </div>
      </Toolbar>

      <ErrorBanner message={error} onRetry={load} />

      <DataTable
        columns={columns}
        rows={certs}
        rowKey={(c) => c.id}
        loading={loading}
        empty={{
          icon: '📜',
          title: 'No certificates found',
          message: 'Apply for your first certificate to get started.',
          action: { onClick: () => navigate('/institute/batches'), label: '+ Apply for Certificate' },
        }}
      />

      <Pagination page={page} totalPages={pagination.totalPages}
        pageSize={20} totalElements={pagination.totalElements}
        onChange={setPage} />

      {preview && (
        <CertificatePreview
          cert={preview}
          scope="institute"
          onClose={() => setPreview(null)}
          serverPdf={{
            label: 'Official PDF',
            onDownload: () => handleDownload(preview.id, preview.certificateNumber),
          }}
        />
      )}
    </div>
  );
}
