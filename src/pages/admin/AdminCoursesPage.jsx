import React, { useState, useEffect, useCallback, useRef } from 'react';
import { searchCourses, getCourseStats, createCourse, updateCourse, toggleCourseStatus } from '../../services/adminService.js';
import {
  PageHeader, Toolbar, SearchInput, DataTable, Pagination,
  StatusBadge, Modal, ErrorBanner,
} from '../../components/ui/index.js';

export default function AdminCoursesPage() {
  const [courses,  setCourses]  = useState([]);
  const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0 });
  const [stats,    setStats]    = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);

  // filters
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [active,   setActive]   = useState('');      // '' | 'true' | 'false'
  const [sort,     setSort]     = useState('name');
  const [direction, setDirection] = useState('asc');
  const [page,     setPage]     = useState(0);

  const debounceRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await searchCourses({ search, category, active, sort, direction, page, size: 20 });
      setCourses(res.data?.content ?? []);
      setPagination({
        totalElements: res.data?.totalElements ?? 0,
        totalPages: res.data?.totalPages ?? 0,
      });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [search, category, active, sort, direction, page]);

  // debounce search; immediate for other filters
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(load, 300);
    return () => clearTimeout(debounceRef.current);
  }, [load]);

  const loadStats = useCallback(() => {
    getCourseStats()
      .then(r => { setStats(r.data); setCategories(r.data?.categories ?? []); })
      .catch(() => {});
  }, []);
  useEffect(() => { loadStats(); }, [loadStats]);

  const toggleStatus = async (id, next) => {
    try { await toggleCourseStatus(id, next); load(); loadStats(); }
    catch (err) { setError(err.message); }
  };

  const setSortField = (field) => {
    if (sort === field) setDirection(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSort(field); setDirection('asc'); }
    setPage(0);
  };

  const columns = [
    {
      key: 'code', header: 'Code', sortable: true,
      render: (c) => <span className="font-mono text-xs text-gray-600">{c.code}</span>,
    },
    {
      key: 'name', header: 'Name', primary: true, sortable: true,
      render: (c) => <span className="font-medium text-gray-900 block max-w-[280px] truncate" title={c.name}>{c.name}</span>,
    },
    { key: 'category', header: 'Category', sortable: true, render: (c) => c.category || '—' },
    {
      key: 'duration', header: 'Duration', sortable: true, hideOnMobile: true,
      render: (c) => c.durationDisplay || (c.durationMonths ? `${c.durationMonths} Months` : '—'),
    },
    {
      key: 'status', header: 'Status',
      render: (c) => <StatusBadge status={c.isActive ? 'ACTIVE' : 'INACTIVE'} />,
    },
    {
      key: 'actions', header: 'Actions', align: 'right',
      render: (c) => (
        <div className="flex gap-2.5 justify-end items-center">
          <button onClick={() => { setEditing(c); setShowForm(true); }}
            className="text-xs text-primary-600 hover:underline font-medium">Edit</button>
          <button onClick={() => toggleStatus(c.id, !c.isActive)}
            className={`text-xs font-medium hover:underline ${c.isActive ? 'text-orange-600' : 'text-green-600'}`}>
            {c.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Courses" icon="📚"
        subtitle={stats
          ? `${stats.total} total · ${stats.active} active · ${stats.inactive} inactive`
          : `${pagination.totalElements} total`}
        actions={
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm">
            + Add Course
          </button>
        } />

      <Toolbar>
        <SearchInput className="flex-1 min-w-0 sm:min-w-[220px]" value={search}
          onChange={(v) => { setSearch(v); setPage(0); }}
          placeholder="Search by course name or code…" />
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(0); }}
          className="input sm:w-auto">
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={active} onChange={e => { setActive(e.target.value); setPage(0); }}
          className="input sm:w-auto">
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </Toolbar>

      <ErrorBanner message={error} onRetry={load} />

      <DataTable
        columns={columns}
        rows={courses}
        rowKey={(c) => c.id}
        loading={loading}
        sort={{ field: sort, direction }}
        onSort={setSortField}
        empty={{
          icon: '📚',
          title: 'No courses found',
          message: search ? `No courses match “${search}”.` : 'Add a course to get started.',
        }}
      />

      <Pagination page={page} totalPages={pagination.totalPages}
        pageSize={20} totalElements={pagination.totalElements}
        onChange={setPage} />

      {showForm && (
        <CourseFormModal
          editing={editing}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); load(); loadStats(); }} />
      )}
    </div>
  );
}

function CourseFormModal({ editing, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: editing?.name || '', code: editing?.code || '',
    description: editing?.description || '',
    durationMonths: editing?.durationMonths || '',
    durationLabel: editing?.durationLabel || '',
    category: editing?.category || '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      const payload = {
        ...form,
        durationMonths: form.durationMonths === '' ? null : Number(form.durationMonths),
      };
      if (editing) await updateCourse(editing.id, payload);
      else         await createCourse(payload);
      onSuccess();
    } catch (err) { setError(err.message); setLoading(false); }
  };

  return (
    <Modal open onClose={onClose} title={editing ? 'Edit Course' : 'Add New Course'}
      footer={<>
        <button type="button" onClick={onClose} className="btn-ghost text-sm">Cancel</button>
        <button type="submit" form="course-form" disabled={loading} className="btn-primary text-sm disabled:opacity-50">
          {loading ? 'Saving...' : editing ? 'Save Changes' : 'Add Course'}
        </button>
      </>}>
      {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
      <form id="course-form" onSubmit={handleSubmit} className="space-y-4">
        {[
          {name:'name',            label:'Course Name',       required:true},
          {name:'code',            label:'Course Code',       required:!editing},
          {name:'category',        label:'Category'},
          {name:'durationLabel',   label:'Duration (e.g. 3 MONTHS, 45 DAYS, 90 HOURS)'},
          {name:'durationMonths',  label:'Duration in whole months (optional)', type:'number'},
        ].map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}{f.required&&<span className="text-red-500 ml-0.5">*</span>}</label>
            <input type={f.type||'text'} required={f.required} value={form[f.name]}
              onChange={e => setForm(prev=>({...prev,[f.name]:e.target.value}))}
              disabled={f.name==='code'&&!!editing}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"/>
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea rows={3} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"/>
        </div>
      </form>
    </Modal>
  );
}
