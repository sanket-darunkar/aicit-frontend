import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getStudent } from '../../services/instituteService.js';
import { auth, BASE_URL } from '../../services/api.js';

const STATUS_COLORS = { ACTIVE:'bg-green-100 text-green-800', INACTIVE:'bg-gray-100 text-gray-600', COMPLETED:'bg-blue-100 text-blue-800', DROPPED:'bg-red-100 text-red-800' };

function Row({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2.5 border-b border-gray-50">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider sm:w-44 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-900">{value || '—'}</span>
    </div>
  );
}

/** Fetch photo with Bearer token and return an object URL */
function useAuthPhoto(studentId, hasPhoto) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    if (!hasPhoto || !studentId) return;
    let objectUrl = null;
    const token = auth.getInstituteToken();
    fetch(`${BASE_URL}/api/institute/students/${studentId}/photo`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Photo unavailable');
        return res.blob();
      })
      .then(blob => {
        objectUrl = URL.createObjectURL(blob);
        setPhotoUrl(objectUrl);
      })
      .catch(() => setPhotoUrl(null));

    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [studentId, hasPhoto]);

  return photoUrl;
}

export default function InstituteStudentDetailPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    getStudent(id).then(r => setStudent(r.data)).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [id]);

  const photoUrl = useAuthPhoto(id, student?.hasPhoto);

  if (loading) return <div className="flex items-center justify-center py-20 text-gray-400"><svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Loading...</div>;
  if (error) return <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>;
  if (!student) return null;

  return (
    <div className="max-w-2xl space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/institute/students" className="hover:text-primary-700">Students</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{student.fullName}</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {photoUrl ? (
            <img src={photoUrl} alt={student.fullName}
              className="w-16 h-16 rounded-xl object-cover border border-gray-200"/>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center text-2xl">🎓</div>
          )}
          <div>
            <h1 className="text-2xl font-heading font-bold text-primary-900">{student.fullName}</h1>
            <p className="text-sm font-mono text-gray-500">{student.studentId}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[student.status] || 'bg-gray-100 text-gray-600'}`}>
          {student.status}
        </span>
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-heading font-bold text-primary-900 mb-4">Personal Details</h2>
        <Row label="Full Name"     value={student.fullName} />
        <Row label="Date of Birth" value={student.dateOfBirth} />
        <Row label="Gender"        value={student.gender} />
        <Row label="Mobile"        value={student.ownMobile} />
        <Row label="Aadhaar"       value={student.aadhaarNumberMasked} />
        <Row label="Address"       value={[student.addressLine1, student.city, student.district, student.state, student.pinCode].filter(Boolean).join(', ')} />
        <Row label="Qualification" value={student.qualification} />
        {student.notes && <Row label="Notes" value={student.notes} />}
        <Row label="Enrolled On"   value={student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-IN') : '—'} />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link to={`/institute/students/${id}/edit`} className="btn-primary text-sm">✏️ Edit Student</Link>
        <Link to="/institute/students" className="btn-outline text-sm">← Back</Link>
      </div>
    </div>
  );
}
