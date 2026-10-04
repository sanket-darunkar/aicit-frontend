import React, { useState, useEffect, useCallback } from 'react';
import { listAuditLogs } from '../../services/adminService.js';

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

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-900">Audit Logs</h1>
          <p className="text-sm text-gray-500">{pagination.totalElements} total entries</p>
        </div>
        <button onClick={load} disabled={loading}
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
          {loading ? 'Refreshing…' : '↻ Refresh'}
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading && logs.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>Loading…
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500 font-medium">No audit log entries yet</p>
            <p className="text-sm text-gray-400 mt-1">Actions like approvals, rejections, and certificate issuances will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['When', 'Actor', 'Action', 'Entity', 'Description'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatDate(log.createdAt)}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-gray-900">{log.actorEmail || log.actorType}</p>
                      <p className="text-xs text-gray-400">{log.actorType}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-700'}`}>
                        {log.action?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {log.entityType && log.entityId ? `${log.entityType} #${log.entityId}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700 max-w-xs truncate" title={log.description}>
                      {log.description || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40">
            ← Previous
          </button>
          <span className="text-sm text-gray-500">Page {page + 1} of {pagination.totalPages}</span>
          <button disabled={page >= pagination.totalPages - 1} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
