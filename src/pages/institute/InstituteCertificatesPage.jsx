import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { listCertificates, downloadCertificatePdf } from '../../services/instituteService.js';

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
  const navigate = useNavigate();

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
      const blob = await downloadCertificatePdf(id);
      if (!blob || blob.size === 0) { alert('PDF not available yet.'); return; }
      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href = url; a.download = `${certNumber}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) { alert('Download failed: ' + err.message); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-bold text-primary-900">Certificates</h1>
          <p className="text-sm text-gray-500">{pagination.totalElements} total</p>
        </div>
        <button onClick={() => navigate('/institute/batches')}
          className="btn-primary text-sm">
          + Apply for Certificate
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
            <button onClick={() => navigate('/institute/batches')}
              className="mt-3 text-sm text-primary-700 underline">
              Apply for your first certificate →
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

    </div>
  );
}

