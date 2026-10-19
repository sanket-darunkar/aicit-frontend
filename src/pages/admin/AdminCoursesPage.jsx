import React, { useState, useEffect, useCallback, useRef } from 'react';
import { searchCourses, getCourseStats, createCourse, updateCourse, toggleCourseStatus } from '../../services/adminService.js';

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
  const sortArrow = (field) => sort === field ? (direction === 'asc' ? ' ▲' : ' ▼') : '';

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-900">Courses</h1>
          <p className="text-sm text-gray-500">
            {stats ? `${stats.total} total · ${stats.active} active · ${stats.inactive} inactive`
                   : `${pagination.totalElements} total`}
          </p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm">
          + Add Course
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
          </svg>
          <input type="search" placeholder="Search by course name or code…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"/>
        </div>
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(0); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={active} onChange={e => { setActive(e.target.value); setPage(0); }}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Loading...
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">📚</div>
            <p>No courses found{search ? ` for “${search}”` : ''}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th onClick={() => setSortField('code')}     className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer select-none">Code{sortArrow('code')}</th>
                  <th onClick={() => setSortField('name')}     className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer select-none">Name{sortArrow('name')}</th>
                  <th onClick={() => setSortField('category')} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer select-none">Category{sortArrow('category')}</th>
                  <th onClick={() => setSortField('duration')} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer select-none">Duration{sortArrow('duration')}</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{c.code}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[280px] truncate" title={c.name}>{c.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.category || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{c.durationDisplay || (c.durationMonths ? `${c.durationMonths} Months` : '—')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(c); setShowForm(true); }}
                          className="text-xs text-primary-600 hover:underline font-medium">Edit</button>
                        <button onClick={() => toggleStatus(c.id, !c.isActive)}
                          className={`text-xs font-medium hover:underline ${c.isActive ? 'text-orange-600' : 'text-green-600'}`}>
                          {c.isActive ? 'Deactivate' : 'Activate'}
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

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40">← Previous</button>
          <span className="text-sm text-gray-500">Page {page + 1} of {pagination.totalPages}</span>
          <button disabled={page >= pagination.totalPages - 1} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40">Next →</button>
        </div>
      )}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
        <h3 className="text-lg font-heading font-bold text-primary-900 mb-4">
          {editing ? 'Edit Course' : 'Add New Course'}
        </h3>
        {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary text-sm disabled:opacity-50">
              {loading ? 'Saving...' : editing ? 'Save Changes' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
