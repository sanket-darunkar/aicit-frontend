import React, { useState, useEffect, useCallback } from 'react';
import { listCourses, createCourse, updateCourse, toggleCourseStatus } from '../../services/adminService.js';

export default function AdminCoursesPage() {
  const [courses,  setCourses]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await listCourses();
      setCourses(res.data ?? []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleStatus = async (id, active) => {
    try {
      await toggleCourseStatus(id, active);
      load();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-900">Courses</h1>
          <p className="text-sm text-gray-500">{courses.length} total courses</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm">
          + Add Course
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Code','Name','Category','Duration','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {courses.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{c.code}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-[200px] truncate">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.category || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{c.durationMonths ? `${c.durationMonths}m` : '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                        {c.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(c); setShowForm(true); }}
                          className="text-xs text-primary-600 hover:underline font-medium">Edit</button>
                        <button onClick={() => toggleStatus(c.id, !c.active)}
                          className={`text-xs font-medium hover:underline ${c.active ? 'text-orange-600' : 'text-green-600'}`}>
                          {c.active ? 'Deactivate' : 'Activate'}
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

      {showForm && (
        <CourseFormModal
          editing={editing}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); load(); }} />
      )}
    </div>
  );
}

function CourseFormModal({ editing, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: editing?.name || '', code: editing?.code || '',
    description: editing?.description || '',
    durationMonths: editing?.durationMonths || '',
    category: editing?.category || '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      if (editing) {
        await updateCourse(editing.id, form);
      } else {
        await createCourse(form);
      }
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
            {name:'durationMonths',  label:'Duration (months)', type:'number'},
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
