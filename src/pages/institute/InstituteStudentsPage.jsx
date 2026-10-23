import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { listStudents, deleteStudent } from '../../services/instituteService.js';
import {
  PageHeader, Toolbar, SearchInput, DataTable,
  Pagination, StatusBadge, Modal, ErrorBanner,
} from '../../components/ui/index.js';

export default function InstituteStudentsPage() {
  const [students,   setStudents]   = useState([]);
  const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0 });
  const [search,     setSearch]     = useState('');
  const [page,       setPage]       = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);  // { id, name }
  const [deleting,   setDeleting]   = useState(false);

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

  const handleDelete = async () => {
    if (!confirmDel) return;
    setDeleting(true);
    try {
      await deleteStudent(confirmDel.id);
      setConfirmDel(null);
      load();
    } catch (err) {
      setError(err.message);
      setConfirmDel(null);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: 'studentId', header: 'Student ID', primary: true,
      render: (s) => (
        <div className="min-w-0">
          <Link to={`/institute/students/${s.id}`} className="font-semibold text-primary-800 hover:underline block truncate">
            {s.fullName}
          </Link>
          <span className="font-mono text-[11px] text-gray-400">{s.studentId}</span>
        </div>
      ),
    },
    { key: 'ownMobile', header: 'Mobile', render: (s) => s.ownMobile || '—' },
    { key: 'status', header: 'Status', render: (s) => <StatusBadge status={s.status} /> },
    {
      key: 'actions', header: 'Actions', align: 'right',
      render: (s) => (
        <div className="flex gap-2.5 flex-wrap justify-end items-center">
          <Link to={`/institute/students/${s.id}`} className="text-xs font-semibold text-primary-600 hover:underline">View</Link>
          <Link to={`/institute/students/${s.id}/edit`} className="text-xs font-semibold text-gray-600 hover:underline">Edit</Link>
          <button onClick={() => setConfirmDel({ id: s.id, name: s.fullName })}
            className="text-xs font-semibold text-red-500 hover:underline">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Students" icon="🎓"
        subtitle={`${pagination.totalElements} total student${pagination.totalElements === 1 ? '' : 's'}`}
        actions={<Link to="/institute/students/new" className="btn-primary text-sm">+ Add Student</Link>} />

      <Toolbar>
        <SearchInput className="sm:w-72" value={search}
          onChange={(v) => { setSearch(v); setPage(0); }}
          placeholder="Search by name, ID, mobile…" />
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
          message: 'Try adjusting your search, or add your first student.',
          action: !search ? { to: '/institute/students/new', label: '+ Add Student' } : undefined,
        }}
      />

      <Pagination page={page} totalPages={pagination.totalPages}
        pageSize={20} totalElements={pagination.totalElements}
        onChange={setPage} />

      <Modal open={!!confirmDel} onClose={() => !deleting && setConfirmDel(null)}
        title="Delete Student" subtitle={confirmDel?.name}
        footer={confirmDel && <>
          <button onClick={() => setConfirmDel(null)} disabled={deleting} className="btn-ghost text-sm">Cancel</button>
          <button onClick={handleDelete} disabled={deleting}
            className="text-sm px-4 py-2 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors">
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </>}>
        <p className="text-sm text-gray-600">
          Delete student &ldquo;{confirmDel?.name}&rdquo;? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
