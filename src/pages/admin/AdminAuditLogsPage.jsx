import React, { useState, useEffect, useCallback } from 'react';
import { listAuditLogs } from '../../services/adminService.js';
import {
  PageHeader, DataTable, Pagination, ErrorBanner,
} from '../../components/ui/index.js';

const ACTION_COLORS = {
  INSTITUTE_APPROVED:  'bg-green-100 text-green-800',
  INSTITUTE_REJECTED:  'bg-red-100 text-red-700',
  INSTITUTE_SUSPENDED: 'bg-orange-100 text-orange-700',
  INSTITUTE_ACTIVATED: 'bg-blue-100 text-blue-700',
  INSTITUTE_DEACTIVATED: 'bg-gray-100 text-gray-600',
  CERT_ISSUED:         'bg-emerald-100 text-emerald-800',
  CERT_REJECTED:       'bg-red-100 text-red-700',
  CERT_REVOKED:        'bg-gray-200 text-gray-600',
};

function formatDate(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return d.toLocaleDateString('en-IN') + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function ActionChip({ action }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${ACTION_COLORS[action] || 'bg-gray-100 text-gray-700'}`}>
      {action?.replace(/_/g, ' ')}
    </span>
  );
}

export default function AdminAuditLogsPage() {
  const [logs,       setLogs]       = useState([]);
  const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0 });
  const [page,       setPage]       = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await listAuditLogs({ page, size: 50 });
      setLogs(res.data?.content ?? []);
      setPagination({
        totalElements: res.data?.totalElements ?? 0,
        totalPages:    res.data?.totalPages ?? 0,
      });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const columns = [
    {
      key: 'when', header: 'When', primary: true,
      render: (log) => <span className="text-xs text-gray-500 whitespace-nowrap">{formatDate(log.createdAt)}</span>,
    },
    {
      key: 'actor', header: 'Actor',
      render: (log) => (
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-900 truncate">{log.actorEmail || log.actorType}</p>
          <p className="text-xs text-gray-400">{log.actorType}</p>
        </div>
      ),
    },
    {
      key: 'action', header: 'Action',
      render: (log) => <ActionChip action={log.action} />,
    },
    {
      key: 'entity', header: 'Entity',
      render: (log) => (
        <span className="text-xs text-gray-600">
          {log.entityType && log.entityId ? `${log.entityType} #${log.entityId}` : '—'}
        </span>
      ),
    },
    {
      key: 'description', header: 'Description', hideOnMobile: true,
      render: (log) => (
        <span className="text-xs text-gray-700 block max-w-xs truncate" title={log.description}>
          {log.description || '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Audit Logs" icon="🔍"
        subtitle={`${pagination.totalElements} total ${pagination.totalElements === 1 ? 'entry' : 'entries'}`}
        actions={
          <button onClick={load} disabled={loading} className="btn-outline text-sm">
            {loading ? 'Refreshing…' : '↻ Refresh'}
          </button>
        } />

      <ErrorBanner message={error} onRetry={load} />

      <DataTable
        columns={columns}
        rows={logs}
        rowKey={(log) => log.id}
        loading={loading}
        empty={{
          icon: '🔍',
          title: 'No audit log entries yet',
          message: 'Actions like approvals, rejections, and certificate issuances will appear here.',
        }}
      />

      <Pagination page={page} totalPages={pagination.totalPages}
        pageSize={50} totalElements={pagination.totalElements}
        onChange={setPage} />
    </div>
  );
}
