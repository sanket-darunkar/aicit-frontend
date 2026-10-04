import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listStudents, deleteStudent } from '../../services/instituteService.js';

const STATUS_COLORS = {
  ACTIVE:    'bg-green-100 text-green-800',
  INACTIVE:  'bg-gray-100 text-gray-600',
  COMPLETED: 'bg-blue-100 text-blue-800',
  DROPPED:   'bg-red-100 text-red-800',
};

export default function InstituteStudentsPage() {
  const [students,   setStudents]   = useState([]);
  const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0 });
  const [search,     setSearch]     = useState('');
  const [page,       setPage]       = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listStudents({ page, size: 20, search });
      setStudents(res.data?.content ?? []);
      setPagination({ totalElements: res.data?.totalElements ?? 0, totalPages: res.data?.totalPages ?? 0 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete student "${name}"? This cannot be undone.`)) return;
    try {
      await deleteStudent(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-900">Students</h1>
          <p className="text-sm text-gray-500">{pagination.totalElements} total students</p>
        </div>
        <Link to="/institute/students/new" className="btn-primary text-sm">
          + Add Student
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
        </svg>
        <input
          type="search"
          placeholder="Search by name, ID, mobile..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
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
            </svg>Loading...
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🎓</div>
            <p className="text-gray-500 font-medium">No students found</p>
            {!search && (
              <Link to="/institute/students/new"
                className="mt-3 inline-block text-sm text-primary-700 underline">
                Add your first student →
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Student ID','Name','Mobile','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{s.studentId}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{s.fullName}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.ownMobile}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[s.status] || 'bg-gray-100 text-gray-600'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link to={`/institute/students/${s.id}`}
                          className="text-xs text-primary-600 hover:underline font-medium">View</Link>
                        <Link to={`/institute/students/${s.id}/edit`}
                          className="text-xs text-gray-600 hover:underline font-medium">Edit</Link>
                        <button
                          onClick={() => handleDelete(s.id, s.fullName)}
                          className="text-xs text-red-500 hover:underline font-medium">
                          Delete
                        </button>
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
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300
                       rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
            ← Previous
          </button>
          <span className="text-sm text-gray-500">Page {page + 1} of {pagination.totalPages}</span>
          <button disabled={page >= pagination.totalPages - 1} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300
                       rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
