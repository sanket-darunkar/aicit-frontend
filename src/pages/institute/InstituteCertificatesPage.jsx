import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { listCertificates, listStudents, requestCertificate } from '../../services/instituteService.js';
import { getPublicCourses } from '../../services/publicService.js';
import { auth } from '../../services/api.js';

const STATUS_COLORS = {
  REQUESTED:    'bg-yellow-100 text-yellow-800',
  UNDER_REVIEW: 'bg-blue-100 text-blue-700',
  APPROVED:     'bg-green-100 text-green-700',
  ISSUED:       'bg-emerald-100 text-emerald-800',
  REJECTED:     'bg-red-100 text-red-700',
  REVOKED:      'bg-gray-200 text-gray-600',
};

export default function InstituteCertificatesPage() {
  const [certs,      setCerts]      = useState([]);
  const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0 });
  const [statusFilter, setStatus]   = useState('');
  const [page,        setPage]      = useState(0);
  const [loading,     setLoading]   = useState(false);
  const [error,       setError]     = useState(null);
  const [showRequest, setShowRequest] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await listCertificates({ page, size: 20, status: statusFilter });
      setCerts(res.data?.content ?? []);
      setPagination({ totalElements: res.data?.totalElements ?? 0, totalPages: res.data?.totalPages ?? 0 });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleDownload = async (id, certNumber) => {
    try {
      const token = auth.getInstituteToken();
      const res = await fetch(`/api/institute/certificates/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) { alert('PDF not available yet.'); return; }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url; a.download = `${certNumber}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { alert('Download failed: ' + err.message); }
  };

  const TABS = ['', 'REQUESTED', 'UNDER_REVIEW', 'ISSUED', 'REJECTED'];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-900">Certificates</h1>
          <p className="text-sm text-gray-500">{pagination.totalElements} total</p>
        </div>
        <button onClick={() => setShowRequest(true)}
          className="btn-primary text-sm">
          + Request Certificate
        </button>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {[['', 'All'], ['REQUESTED','Requested'], ['UNDER_REVIEW','Under Review'],
          ['ISSUED','Issued'], ['REJECTED','Rejected']].map(([val, label]) => (
          <button key={val}
            onClick={() => { setStatus(val); setPage(0); }}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors
              ${statusFilter === val ? 'bg-primary-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}>
            {label}
          </button>
        ))}
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
        ) : certs.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📜</div>
            <p className="text-gray-500 font-medium">No certificates found</p>
            <button onClick={() => setShowRequest(true)}
              className="mt-3 text-sm text-primary-700 underline">
              Request your first certificate →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Cert Number','Student','Course','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {certs.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{c.certificateNumber || '—'}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{c.studentName}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{c.courseName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-600'}`}>
                        {c.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {c.status === 'ISSUED' && (
                        <button onClick={() => handleDownload(c.id, c.certificateNumber)}
                          className="text-xs text-primary-600 hover:underline font-semibold">
                          {c.certificateType === 'TYPING'
                            ? '⬇ Download Typing Certificate'
                            : '⬇ Download AICIT Certificate'}
                        </button>
                      )}
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

      {/* Request modal */}
      {showRequest && (
        <CertRequestModal onClose={() => setShowRequest(false)} onSuccess={() => { setShowRequest(false); load(); }} />
      )}
    </div>
  );
}

// ── Certificate Request Modal ─────────────────────────────────
function CertRequestModal({ onClose, onSuccess }) {
  const [students, setStudents] = useState([]);
  const [courses,  setCourses]  = useState([]);
  const [form,     setForm]     = useState({ studentId: '', courseId: '', marks: '', grade: '' });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    listStudents({ size: 100 }).then(r => setStudents(r.data?.content ?? [])).catch(() => {});
    getPublicCourses().then(r => setCourses(r.data ?? [])).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await requestCertificate({
        studentId: parseInt(form.studentId),
        courseId:  parseInt(form.courseId),
        marks:     form.marks || null,
        grade:     form.grade || null,
      });
      onSuccess();
    } catch (err) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-heading font-bold text-primary-900 mb-4">Request Certificate</h3>
        {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student <span className="text-red-500">*</span></label>
            <select required value={form.studentId} onChange={e => setForm(f => ({...f, studentId: e.target.value}))}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Select student...</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.studentId})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course <span className="text-red-500">*</span></label>
            <select required value={form.courseId} onChange={e => setForm(f => ({...f, courseId: e.target.value}))}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="">Select course...</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
              <input type="text" value={form.marks} onChange={e => setForm(f=>({...f, marks:e.target.value}))}
                placeholder="e.g. 450/500"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <input type="text" value={form.grade} onChange={e => setForm(f=>({...f, grade:e.target.value}))}
                placeholder="e.g. A+"
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"/>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary text-sm disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
