import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getStudent } from '../../services/instituteService.js';
import { auth, BASE_URL } from '../../services/api.js';
import {
  PageHeader, DetailCard, DetailRow, StatusBadge,
  LoadingState, ErrorState,
} from '../../components/ui/index.js';

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

  if (loading) return <LoadingState label="Loading…" />;
  if (error) return <ErrorState message={error} backTo="/institute/students" backLabel="Back to students" />;
  if (!student) return null;

  const address = [student.addressLine1, student.city, student.district, student.state, student.pinCode]
    .filter(Boolean).join(', ');

  return (
    <div className="space-y-5 max-w-2xl">
      <PageHeader
        title={student.fullName}
        breadcrumbs={[
          { label: 'Students', to: '/institute/students' },
          { label: student.fullName },
        ]}
        actions={
          <>
            <Link to={`/institute/students/${id}/edit`} className="btn-primary text-sm">✏️ Edit Student</Link>
            <Link to="/institute/students" className="btn-outline text-sm">← Back</Link>
          </>
        } />

      {/* Header card with photo */}
      <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-4 min-w-0">
          {photoUrl ? (
            <img src={photoUrl} alt={student.fullName}
              className="w-16 h-16 rounded-xl object-cover border border-gray-200 flex-shrink-0"/>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center text-2xl flex-shrink-0">🎓</div>
          )}
          <div className="min-w-0">
            <h2 className="text-lg font-heading font-bold text-primary-900 truncate">{student.fullName}</h2>
            <p className="text-sm font-mono text-gray-500">{student.studentId}</p>
          </div>
        </div>
        <StatusBadge status={student.status} />
      </div>

      {/* Details */}
      <DetailCard title="Personal Details" icon="👤">
        <DetailRow label="Full Name"     value={student.fullName} />
        <DetailRow label="Date of Birth" value={student.dateOfBirth} />
        <DetailRow label="Gender"        value={student.gender} />
        <DetailRow label="Mobile"        value={student.ownMobile} />
        <DetailRow label="Aadhaar"       value={student.aadhaarNumberMasked} mono />
        <DetailRow label="Address"       value={address} />
        <DetailRow label="Qualification" value={student.qualification} />
        {student.notes && <DetailRow label="Notes" value={student.notes} />}
        <DetailRow label="Enrolled On"   value={student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-IN') : null} />
      </DetailCard>
    </div>
  );
}
