import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listAllStudents, getAdminStudent } from '../../services/adminService.js';
import {
  PageHeader, Toolbar, SearchInput, DataTable, Pagination,
  StatusBadge, Modal, ErrorBanner, DetailCard, DetailRow, Spinner,
} from '../../components/ui/index.js';

export default function AdminStudentsPage() {
  const [searchParams] = useSearchParams();
  const presetInstituteId = searchParams.get('instituteId') || '';

  const [students,   setStudents]   = useState([]);
  const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0 });
  const [search,     setSearch]     = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [instituteId, setInstituteId] = useState(presetInstituteId);
  const [page,       setPage]       = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [selected,   setSelected]   = useState(null);   // student detail drawer
  const [detailLoading, setDetailLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await listAllStudents({
        page, size: 20,
        search: debouncedSearch,
        instituteId: instituteId || '',
      });
      setStudents(res.data?.content ?? []);
      setPagination({ totalElements: res.data?.totalElements ?? 0, totalPages: res.data?.totalPages ?? 0 });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [page, debouncedSearch, instituteId]);

  useEffect(() => { setPage(0); }, [debouncedSearch, instituteId]);
  useEffect(() => { load(); }, [load]);

  const openDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await getAdminStudent(id);
      setSelected(res.data);
    } catch { setSelected(null); }
    finally { setDetailLoading(false); }
  };

  const columns = [
    {
      key: 'name', header: 'Name', primary: true,
      render: (s) => (
        <div className="min-w-0">
          <button onClick={() => openDetail(s.id)}
            className="font-semibold text-primary-800 hover:underline block truncate text-left">
            {s.fullName}
          </button>
          <span className="font-mono text-[11px] text-gray-400">{s.studentId}</span>
        </div>
      ),
    },
    { key: 'instituteId', header: 'Institute ID', render: (s) => s.instituteId },
    { key: 'mobile', header: 'Mobile', hideOnMobile: true, render: (s) => s.ownMobile || '—' },
    { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} /> },
    {
      key: 'enrolled', header: 'Enrolled On', hideOnMobile: true,
      render: (s) => (
        <span className="text-gray-500 text-xs">
          {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN') : '—'}
        </span>
      ),
    },
    {
      key: 'actions', header: 'Actions', align: 'right',
      render: (s) => (
        <button onClick={() => openDetail(s.id)}
          className="text-xs font-semibold text-primary-600 hover:underline">View</button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="All Students" icon="🎓"
        subtitle={`${pagination.totalElements} total student${pagination.totalElements === 1 ? '' : 's'}`} />

      <Toolbar>
        <SearchInput className="sm:w-64" value={search} onChange={setSearch}
          placeholder="Search by name, student ID…" />
        <input
          type="number"
          placeholder="Filter by Institute ID"
          value={instituteId}
          onChange={e => setInstituteId(e.target.value)}
          className="input sm:w-48"
        />
        {(search || instituteId) && (
          <button onClick={() => { setSearch(''); setInstituteId(''); }}
            className="btn-ghost text-sm whitespace-nowrap">
            Clear filters
          </button>
        )}
      </Toolbar>

      <ErrorBanner message={error} onRetry={load} />

      <DataTable
        columns={columns}
        rows={students}
        rowKey={(s) => s.id}
        loading={loading}
        empty={{
          icon: '🎓',
          title: 'No students found',
          message: (search || instituteId) ? 'Try adjusting your filters.' : 'Students will appear here once enrolled.',
        }}
      />

      <Pagination page={page} totalPages={pagination.totalPages}
        pageSize={20} totalElements={pagination.totalElements}
        onChange={setPage} />

      {/* Student detail */}
      <Modal open={!!selected || detailLoading} onClose={() => setSelected(null)}
        title="Student Detail" subtitle={selected?.studentId} size="lg">
        {detailLoading ? (
          <div className="py-10 flex items-center justify-center">
            <Spinner className="w-7 h-7" label="Loading…" />
          </div>
        ) : selected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-xl flex-shrink-0">🎓</div>
              <div className="min-w-0">
                <p className="font-bold text-primary-900 truncate">{selected.fullName}</p>
                <p className="text-xs font-mono text-gray-500">{selected.studentId}</p>
              </div>
              <span className="ml-auto flex-shrink-0"><StatusBadge status={selected.status} /></span>
            </div>
            <DetailCard title="Profile" icon="👤">
              <DetailRow label="Date of Birth" value={selected.dateOfBirth} />
              <DetailRow label="Gender"        value={selected.gender} />
              <DetailRow label="Mobile"        value={selected.ownMobile} />
              <DetailRow label="Aadhaar"       value={selected.aadhaarNumberMasked} mono />
              <DetailRow label="Address"       value={[selected.addressLine1, selected.city, selected.district, selected.state, selected.pinCode].filter(Boolean).join(', ')} />
              <DetailRow label="Qualification" value={selected.qualification} />
              <DetailRow label="Institute ID"  value={String(selected.instituteId)} />
              <DetailRow label="Enrolled On"   value={selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('en-IN') : '—'} />
            </DetailCard>
            <div>
              <Link to={`/admin/institutes/${selected.instituteId}`}
                className="text-sm text-primary-600 hover:underline font-medium">
                → View Institute
              </Link>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
