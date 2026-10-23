import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getStudent, updateStudent } from '../../services/instituteService.js';
import { PageHeader, DetailCard, ErrorBanner, LoadingState, ErrorState } from '../../components/ui/index.js';

const GENDERS  = ['Male', 'Female', 'Other', 'Prefer not to say'];
const QUALIFS  = ['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Other'];
const STATUSES = ['ACTIVE', 'INACTIVE', 'COMPLETED', 'DROPPED'];

// ── Field must live OUTSIDE the page component so React never remounts it on re-render
function Field({ name, label, required, type = 'text', as, options, value, onChange }) {
  return (
    <div>
      <label htmlFor={`ef-${name}`} className={`label ${required ? 'label-req' : ''}`}>{label}</label>
      {as === 'select' ? (
        <select id={`ef-${name}`} name={name} value={value} onChange={onChange} className="input">
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input id={`ef-${name}`} name={name} type={type} value={value} onChange={onChange}
          required={required} className="input" />
      )}
    </div>
  );
}

export default function InstituteStudentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form,    setForm]    = useState(null);
  const [photo,   setPhoto]   = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    getStudent(id)
      .then(r => {
        const s = r.data;
        setForm({
          firstName: s.firstName || '', middleName: s.middleName || '',
          surname: s.surname || '', dateOfBirth: s.dateOfBirth || '',
          gender: s.gender || '', ownMobile: s.ownMobile || '',
          addressLine1: s.addressLine1 || '', city: s.city || '',
          district: s.district || '', state: s.state || '',
          pinCode: s.pinCode || '', qualification: s.qualification || '',
          status: s.status || 'ACTIVE', notes: s.notes || '',
          removePhoto: false,
        });
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(null);
    try {
      await updateStudent(id, form, photo);
      navigate(`/institute/students/${id}`);
    } catch (err) { setError(err.message); setSaving(false); }
  };

  if (loading) return <LoadingState label="Loading…" />;
  if (error && !form) return <ErrorState message={error} backTo={`/institute/students/${id}`} backLabel="Back to student" />;
  if (!form) return null;

  return (
    <div className="space-y-5 max-w-3xl">
      <PageHeader title="Edit Student" icon="✏️"
        breadcrumbs={[
          { label: 'Students', to: '/institute/students' },
          { label: 'Student', to: `/institute/students/${id}` },
          { label: 'Edit' },
        ]} />

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Photo */}
        <DetailCard title="Photo" icon="📷">
          <div className="px-5 py-5">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                {preview ? <img src={preview} alt="Preview" className="w-full h-full object-cover"/> : <span className="text-2xl">📷</span>}
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-photo" className="cursor-pointer btn-outline text-sm inline-block">Change Photo</label>
                <input id="edit-photo" type="file" accept="image/jpeg,image/png" className="hidden" onChange={handlePhoto}/>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="removePhoto" name="removePhoto" checked={form.removePhoto} onChange={handleChange} className="h-4 w-4 rounded"/>
                  <label htmlFor="removePhoto" className="text-sm text-gray-600">Remove current photo</label>
                </div>
              </div>
            </div>
          </div>
        </DetailCard>

        {/* Personal */}
        <DetailCard title="Personal Details" icon="👤">
          <div className="px-5 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field name="firstName"  label="First Name"  required value={form.firstName}  onChange={handleChange} />
              <Field name="middleName" label="Middle Name"          value={form.middleName} onChange={handleChange} />
              <Field name="surname"    label="Surname"     required value={form.surname}    onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field name="dateOfBirth" label="Date of Birth" type="date"                   value={form.dateOfBirth} onChange={handleChange} />
              <Field name="gender"      label="Gender"        as="select" options={GENDERS}  value={form.gender}     onChange={handleChange} />
              <Field name="status"      label="Status"        as="select" options={STATUSES} value={form.status}     onChange={handleChange} />
            </div>
          </div>
        </DetailCard>

        {/* Contact */}
        <DetailCard title="Contact" icon="📍">
          <div className="px-5 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field name="ownMobile"    label="Mobile"  required type="tel" value={form.ownMobile}    onChange={handleChange} />
              <Field name="addressLine1" label="Address"                     value={form.addressLine1} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field name="city"     label="City"     value={form.city}     onChange={handleChange} />
              <Field name="district" label="District" value={form.district} onChange={handleChange} />
              <Field name="state"    label="State"    value={form.state}    onChange={handleChange} />
              <Field name="pinCode"  label="PIN"      value={form.pinCode}  onChange={handleChange} />
            </div>
          </div>
        </DetailCard>

        {/* Academic */}
        <DetailCard title="Academic" icon="📚">
          <div className="px-5 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field name="qualification" label="Qualification" as="select" options={QUALIFS} value={form.qualification} onChange={handleChange} />
              <div>
                <label htmlFor="ef-notes" className="label">Notes</label>
                <textarea id="ef-notes" name="notes" rows={3} value={form.notes} onChange={handleChange}
                  className="input resize-none"/>
              </div>
            </div>
          </div>
        </DetailCard>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to={`/institute/students/${id}`} className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
