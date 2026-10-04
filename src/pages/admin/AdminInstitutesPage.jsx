import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  listInstitutes, approveInstitute, rejectInstitute,
  suspendInstitute, activateInstitute, deleteInstitute,
} from '../../services/adminService.js';

const STATUS_COLORS = {
  PENDING_REVIEW: 'bg-amber-100 text-amber-800',
  APPROVED:       'bg-green-100 text-green-800',
  SUSPENDED:      'bg-orange-100 text-orange-800',
  DEACTIVATED:    'bg-gray-100 text-gray-600',
  REJECTED:       'bg-red-100 text-red-800',
};

const STATUS_TABS = [
  { key: '',               label: 'All' },
  { key: 'PENDING_REVIEW', label: 'Pending' },
  { key: 'APPROVED',       label: 'Approved' },
  { key: 'SUSPENDED',      label: 'Suspended' },
  { key: 'DEACTIVATED',    label: 'Deactivated' },
  { key: 'REJECTED',       label: 'Rejected' },
];

function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = 'Confirm', danger = false, showReason = false }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        {showReason && (
          <textarea
            rows={3}
            placeholder="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4 resize-none"
          />
        )}
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300
                       rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={() => onConfirm(reason)}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors
                        ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-800 hover:bg-primary-700'}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminInstitutesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [institutes, setInstitutes] = useState([]);
  const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0 });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [modal, setModal]       = useState(null);

  const status = searchParams.get('status') || '';
  const search = searchParams.get('search') || '';
  const page   = parseInt(searchParams.get('page') || '0');

  const fetchInstitutes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listInstitutes({ page, size: 15, status, search });
      setInstitutes(res.data?.content ?? []);
      setPagination({ totalElements: res.data?.totalElements ?? 0, totalPages: res.data?.totalPages ?? 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => { fetchInstitutes(); }, [fetchInstitutes]);

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const handleAction = async (action, id, reason = '') => {
    try {
      if (action === 'approve')             await approveInstitute(id);
      if (action === 'reject')              await rejectInstitute(id, reason);
      if (action === 'suspend')             await suspendInstitute(id, reason);
      if (action === 'activate')            await activateInstitute(id);
      if (action === 'delete')              await deleteInstitute(id);
      setModal(null);
      fetchInstitutes();
    } catch (err) {
      setError(err.message);
      setModal(null);
    }
  };

  return (
    <div className="space-y-5">
      {modal && (
        <ConfirmModal
          {...modal}
          onCancel={() => setModal(null)}
          onConfirm={(reason) => handleAction(modal.action, modal.id, reason)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-heading font-bold text-primary-900">Institutes</h1>
        <span className="text-sm text-gray-500">{pagination.totalElements} total</span>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button key={tab.key}
            onClick={() => setParam('status', tab.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors
              ${(status === tab.key) ? 'bg-primary-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
        </svg>
        <input
          type="search"
          placeholder="Search institutes..."
          defaultValue={search}
          onKeyDown={(e) => e.key === 'Enter' && setParam('search', e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Loading...
          </div>
        ) : institutes.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">🏫</div>
            <p>No institutes found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Code','Name','City','Contact Email','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {institutes.map((inst) => (
                  <tr key={inst.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{inst.instituteCode}</td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/institutes/${inst.id}`}
                        className="font-medium text-primary-700 hover:underline">{inst.name}</Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{inst.city || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 truncate max-w-[180px]">{inst.contactEmail}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[inst.status] || 'bg-gray-100 text-gray-600'}`}>
                        {inst.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap items-center">
                        <Link to={`/admin/institutes/${inst.id}`}
                          className="text-xs text-primary-600 hover:underline font-medium">View</Link>

                        {inst.status === 'PENDING_REVIEW' && (<>
                          <button onClick={() => setModal({ action:'approve', id:inst.id, title:'Approve Institute', message:`Approve "${inst.name}"? Login credentials will be emailed.`, confirmLabel:'Approve' })}
                            className="text-xs text-green-600 hover:underline font-medium">Approve</button>
                          <button onClick={() => setModal({ action:'reject', id:inst.id, title:'Reject Application', message:`Reject "${inst.name}"?`, confirmLabel:'Reject', danger:true, showReason:true })}
                            className="text-xs text-red-500 hover:underline font-medium">Reject</button>
                          <button onClick={() => setModal({ action:'delete', id:inst.id, title:'Delete Institute', message:`Permanently delete "${inst.name}"? This cannot be undone.`, confirmLabel:'Delete', danger:true })}
                            className="text-xs text-red-700 hover:underline font-medium">Delete</button>
                        </>)}

                        {inst.status === 'APPROVED' && (
                          <button onClick={() => setModal({ action:'suspend', id:inst.id, title:'Suspend Institute', message:`Suspend "${inst.name}"? Their login will be disabled.`, confirmLabel:'Suspend', danger:true, showReason:true })}
                            className="text-xs text-orange-600 hover:underline font-medium">Suspend</button>
                        )}

                        {inst.status === 'SUSPENDED' && (
                          <button onClick={() => setModal({ action:'activate', id:inst.id, title:'Re-activate Institute', message:`Re-activate "${inst.name}"?`, confirmLabel:'Activate' })}
                            className="text-xs text-green-600 hover:underline font-medium">Activate</button>
                        )}

                        {inst.status === 'DEACTIVATED' && (
                          <button onClick={() => setModal({ action:'activate', id:inst.id, title:'Re-activate Institute', message:`Re-activate "${inst.name}"? They will regain portal access.`, confirmLabel:'Activate' })}
                            className="text-xs text-green-600 hover:underline font-medium">Re-activate</button>
                        )}

                        {inst.status === 'REJECTED' && (<>
                          <button onClick={() => setModal({ action:'approve', id:inst.id, title:'Approve Institute', message:`Approve "${inst.name}" despite previous rejection?`, confirmLabel:'Approve' })}
                            className="text-xs text-green-600 hover:underline font-medium">Approve</button>
                          <button onClick={() => setModal({ action:'delete', id:inst.id, title:'Delete Institute', message:`Permanently delete "${inst.name}"? This cannot be undone.`, confirmLabel:'Delete', danger:true })}
                            className="text-xs text-red-700 hover:underline font-medium">Delete</button>
                        </>)}
                      </div>
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
          <button disabled={page === 0}
            onClick={() => setParam('page', page - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300
                       rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
            ← Previous
          </button>
          <span className="text-sm text-gray-500">Page {page + 1} of {pagination.totalPages}</span>
          <button disabled={page >= pagination.totalPages - 1}
            onClick={() => setParam('page', page + 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300
                       rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
