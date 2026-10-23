import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  listInstitutes, approveInstitute, rejectInstitute,
  suspendInstitute, activateInstitute, deleteInstitute,
} from '../../services/adminService.js';
import {
  PageHeader, Toolbar, SearchInput, FilterPills, DataTable,
  Pagination, StatusBadge, Modal, ErrorBanner,
} from '../../components/ui/index.js';

const STATUS_TABS = [
  { value: '',               label: 'All' },
  { value: 'PENDING_REVIEW', label: 'Pending' },
  { value: 'APPROVED',       label: 'Approved' },
  { value: 'SUSPENDED',      label: 'Suspended' },
  { value: 'DEACTIVATED',    label: 'Deactivated' },
  { value: 'REJECTED',       label: 'Rejected' },
];

export default function AdminInstitutesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [institutes, setInstitutes] = useState([]);
  const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0 });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [modal, setModal]       = useState(null);
  const [reason, setReason]     = useState('');
  const [busy, setBusy]         = useState(false);

  const status = searchParams.get('status') || '';
  const search = searchParams.get('search') || '';
  const page   = parseInt(searchParams.get('page') || '0');

  const fetchInstitutes = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await listInstitutes({ page, size: 15, status, search });
      setInstitutes(res.data?.content ?? []);
      setPagination({ totalElements: res.data?.totalElements ?? 0, totalPages: res.data?.totalPages ?? 0 });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [page, status, search]);

  useEffect(() => { fetchInstitutes(); }, [fetchInstitutes]);

  const setParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val); else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const openModal = (m) => { setReason(''); setModal(m); };

  const handleAction = async () => {
    if (!modal) return;
    setBusy(true);
    try {
      const { action, id } = modal;
      if (action === 'approve')  await approveInstitute(id);
      if (action === 'reject')   await rejectInstitute(id, reason);
      if (action === 'suspend')  await suspendInstitute(id, reason);
      if (action === 'activate') await activateInstitute(id);
      if (action === 'delete')   await deleteInstitute(id);
      setModal(null);
      fetchInstitutes();
    } catch (err) { setError(err.message); setModal(null); }
    finally { setBusy(false); }
  };

  const actionLink = (label, cls, m) => (
    <button onClick={() => openModal(m)} className={`text-xs font-semibold hover:underline ${cls}`}>{label}</button>
  );

  const columns = [
    {
      key: 'name', header: 'Institute', primary: true,
      render: (i) => (
        <div className="min-w-0">
          <Link to={`/admin/institutes/${i.id}`} className="font-semibold text-primary-800 hover:underline block truncate">
            {i.name}
          </Link>
          <span className="font-mono text-[11px] text-gray-400">{i.instituteCode}</span>
        </div>
      ),
    },
    { key: 'city', header: 'City', render: (i) => i.city || '—' },
    { key: 'email', header: 'Contact', hideOnMobile: true,
      render: (i) => <span className="text-gray-500 truncate block max-w-[200px]">{i.contactEmail}</span> },
    { key: 'status', header: 'Status', render: (i) => <StatusBadge status={i.status} /> },
    {
      key: 'actions', header: 'Actions', align: 'right',
      render: (i) => (
        <div className="flex gap-2.5 flex-wrap justify-end items-center">
          <Link to={`/admin/institutes/${i.id}`} className="text-xs font-semibold text-primary-600 hover:underline">View</Link>
          {i.status === 'PENDING_REVIEW' && <>
            {actionLink('Approve', 'text-trust-600', { action:'approve', id:i.id, name:i.name, title:'Approve Institute', message:`Approve "${i.name}"? Login credentials will be emailed.`, confirmLabel:'Approve' })}
            {actionLink('Reject', 'text-red-500', { action:'reject', id:i.id, name:i.name, title:'Reject Application', message:`Reject "${i.name}"?`, confirmLabel:'Reject', danger:true, showReason:true })}
            {actionLink('Delete', 'text-red-700', { action:'delete', id:i.id, name:i.name, title:'Delete Institute', message:`Permanently delete "${i.name}"? This cannot be undone.`, confirmLabel:'Delete', danger:true })}
          </>}
          {i.status === 'APPROVED' &&
            actionLink('Suspend', 'text-orange-600', { action:'suspend', id:i.id, name:i.name, title:'Suspend Institute', message:`Suspend "${i.name}"? Their login will be disabled.`, confirmLabel:'Suspend', danger:true, showReason:true })}
          {i.status === 'SUSPENDED' &&
            actionLink('Activate', 'text-trust-600', { action:'activate', id:i.id, name:i.name, title:'Re-activate Institute', message:`Re-activate "${i.name}"?`, confirmLabel:'Activate' })}
          {i.status === 'DEACTIVATED' &&
            actionLink('Re-activate', 'text-trust-600', { action:'activate', id:i.id, name:i.name, title:'Re-activate Institute', message:`Re-activate "${i.name}"? They will regain portal access.`, confirmLabel:'Activate' })}
          {i.status === 'REJECTED' && <>
            {actionLink('Approve', 'text-trust-600', { action:'approve', id:i.id, name:i.name, title:'Approve Institute', message:`Approve "${i.name}" despite previous rejection?`, confirmLabel:'Approve' })}
            {actionLink('Delete', 'text-red-700', { action:'delete', id:i.id, name:i.name, title:'Delete Institute', message:`Permanently delete "${i.name}"? This cannot be undone.`, confirmLabel:'Delete', danger:true })}
          </>}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Institutes" icon="🏫"
        subtitle={`${pagination.totalElements} registered institute${pagination.totalElements === 1 ? '' : 's'}`} />

      <Toolbar>
        <div className="flex-1 min-w-0"><FilterPills options={STATUS_TABS} value={status} onChange={(v) => setParam('status', v)} /></div>
        <SearchInput className="sm:w-64" defaultValue={search}
          onSubmit={(v) => setParam('search', v)} placeholder="Search institutes…" />
      </Toolbar>

      <ErrorBanner message={error} onRetry={fetchInstitutes} />

      <DataTable
        columns={columns}
        rows={institutes}
        rowKey={(i) => i.id}
        loading={loading}
        empty={{ icon: '🏫', title: 'No institutes found', message: 'Try adjusting the filters or search.' }}
      />

      <Pagination page={page} totalPages={pagination.totalPages}
        pageSize={15} totalElements={pagination.totalElements}
        onChange={(p) => setParam('page', p)} />

      {/* Confirm / reason modal */}
      <Modal open={!!modal} onClose={() => !busy && setModal(null)}
        title={modal?.title} subtitle={modal?.name}
        footer={modal && <>
          <button onClick={() => setModal(null)} disabled={busy} className="btn-ghost text-sm">Cancel</button>
          <button onClick={handleAction} disabled={busy}
            className={`text-sm px-4 py-2 rounded-xl font-semibold text-white transition-colors
              ${modal.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-800 hover:bg-primary-700'}`}>
            {busy ? 'Working…' : (modal.confirmLabel || 'Confirm')}
          </button>
        </>}>
        <p className="text-sm text-gray-600">{modal?.message}</p>
        {modal?.showReason && (
          <textarea rows={3} placeholder="Reason (optional)" value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="input mt-4 resize-none" />
        )}
      </Modal>
    </div>
  );
}
