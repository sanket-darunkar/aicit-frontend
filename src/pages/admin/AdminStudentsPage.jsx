import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listAllStudents, getAdminStudent } from '../../services/adminService.js';

const STATUS_COLORS = {
  ACTIVE:    'bg-green-100 text-green-800',
  INACTIVE:  'bg-gray-100 text-gray-600',
  COMPLETED: 'bg-blue-100 text-blue-800',
  DROPPED:   'bg-red-100 text-red-800',
};

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2 border-b border-gray-50">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider sm:w-44 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-900">{value || '—'}</span>
    </div>
  );
}

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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-900">All Students</h1>
          <p className="text-sm text-gray-500">{pagination.totalElements} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by name, student ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
        />
        <input
          type="number"
          placeholder="Filter by Institute ID"
          value={instituteId}
          onChange={e => setInstituteId(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-48"
        />
        {(search || instituteId) && (
          <button onClick={() => { setSearch(''); setInstituteId(''); }}
            className="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50">
            Clear filters
          </button>
        )}
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>Loading...
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🎓</div>
            <p className="text-gray-500 font-medium">No students found</p>
            {(search || instituteId) && (
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Student ID', 'Name', 'Institute ID', 'Mobile', 'Status', 'Enrolled On', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{s.studentId}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.fullName}</td>
                    <td className="px-4 py-3 text-gray-600">{s.instituteId}</td>
                    <td className="px-4 py-3 text-gray-600">{s.ownMobile || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[s.status] || 'bg-gray-100 text-gray-600'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openDetail(s.id)}
                        className="text-xs text-primary-600 hover:underline font-medium">
                        View
                      </button>
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

      {/* Student detail slide-over */}
      {(selected || detailLoading) && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30"
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-heading font-bold text-primary-900">Student Detail</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            {detailLoading ? (
              <div className="flex items-center justify-center py-10 text-gray-400">Loading...</div>
            ) : selected ? (
              <>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-xl">🎓</div>
                  <div>
                    <p className="font-bold text-primary-900">{selected.fullName}</p>
                    <p className="text-xs font-mono text-gray-500">{selected.studentId}</p>
                  </div>
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[selected.status] || 'bg-gray-100 text-gray-600'}`}>
                    {selected.status}
                  </span>
                </div>
                <DetailRow label="Date of Birth" value={selected.dateOfBirth} />
                <DetailRow label="Gender"        value={selected.gender} />
                <DetailRow label="Mobile"        value={selected.ownMobile} />
                <DetailRow label="Aadhaar"       value={selected.aadhaarNumberMasked} />
                <DetailRow label="Address"       value={[selected.addressLine1, selected.city, selected.district, selected.state, selected.pinCode].filter(Boolean).join(', ')} />
                <DetailRow label="Qualification" value={selected.qualification} />
                <DetailRow label="Institute ID"  value={String(selected.instituteId)} />
                <DetailRow label="Enrolled On"   value={selected.createdAt ? new Date(selected.createdAt).toLocaleDateString('en-IN') : '—'} />
                <div className="pt-2">
                  <Link to={`/admin/institutes/${selected.instituteId}`}
                    className="text-sm text-primary-600 hover:underline font-medium">
                    → View Institute
                  </Link>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
