import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getStudent, updateStudent } from '../../services/instituteService.js';

const GENDERS  = ['Male', 'Female', 'Other', 'Prefer not to say'];
const QUALIFS  = ['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Other'];
const STATUSES = ['ACTIVE', 'INACTIVE', 'COMPLETED', 'DROPPED'];

// ── Field must live OUTSIDE the page component so React never remounts it on re-render
function Field({ name, label, required, type = 'text', as, options, value, onChange }) {
  const cls = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500";
  return (
    <div>
      <label htmlFor={`ef-${name}`} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {as === 'select' ? (
        <select id={`ef-${name}`} name={name} value={value} onChange={onChange} className={cls}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input id={`ef-${name}`} name={name} type={type} value={value} onChange={onChange}
          required={required} className={cls} />
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

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-gray-400">
      <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>Loading...
    </div>
  );
  if (error && !form) return <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>;
  if (!form) return null;

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-3">
        <Link to={`/institute/students/${id}`} className="text-sm text-gray-500 hover:text-gray-700">← Student</Link>
        <h1 className="text-2xl font-heading font-bold text-primary-900">Edit Student</h1>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Photo */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-heading font-bold text-primary-900 mb-4">Photo</h2>
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

        {/* Personal */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-heading font-bold text-primary-900 mb-4">Personal Details</h2>
          <div className="grid grid-cols-3 gap-4">
            <Field name="firstName"  label="First Name"  required value={form.firstName}  onChange={handleChange} />
            <Field name="middleName" label="Middle Name"          value={form.middleName} onChange={handleChange} />
            <Field name="surname"    label="Surname"     required value={form.surname}    onChange={handleChange} />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <Field name="dateOfBirth" label="Date of Birth" type="date"                  value={form.dateOfBirth} onChange={handleChange} />
            <Field name="gender"      label="Gender"        as="select" options={GENDERS} value={form.gender}     onChange={handleChange} />
            <Field name="status"      label="Status"        as="select" options={STATUSES} value={form.status}    onChange={handleChange} />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-heading font-bold text-primary-900 mb-4">Contact</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field name="ownMobile"    label="Mobile"  required type="tel" value={form.ownMobile}    onChange={handleChange} />
            <Field name="addressLine1" label="Address"                     value={form.addressLine1} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            <Field name="city"     label="City"     value={form.city}     onChange={handleChange} />
            <Field name="district" label="District" value={form.district} onChange={handleChange} />
            <Field name="state"    label="State"    value={form.state}    onChange={handleChange} />
            <Field name="pinCode"  label="PIN"      value={form.pinCode}  onChange={handleChange} />
          </div>
        </div>

        {/* Academic */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-heading font-bold text-primary-900 mb-4">Academic</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field name="qualification" label="Qualification" as="select" options={QUALIFS} value={form.qualification} onChange={handleChange} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea name="notes" rows={3} value={form.notes} onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"/>
            </div>
          </div>
        </div>

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
