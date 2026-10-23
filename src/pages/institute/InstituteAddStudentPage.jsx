import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createStudent } from '../../services/instituteService.js';
import { PageHeader, DetailCard, ErrorBanner } from '../../components/ui/index.js';

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const QUALIFS  = ['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Other'];

// ── Field must live OUTSIDE the page component so React never remounts it on re-render
function Field({ name, label, required, type = 'text', as, options, value, onChange, ...rest }) {
  return (
    <div>
      <label htmlFor={name} className={`label ${required ? 'label-req' : ''}`}>{label}</label>
      {as === 'select' ? (
        <select id={name} name={name} value={value} onChange={onChange} className="input">
          <option value="">Select...</option>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input id={name} name={name} type={type} value={value} onChange={onChange}
          required={required} {...rest} className="input" />
      )}
    </div>
  );
}

export default function InstituteAddStudentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', middleName: '', surname: '', dateOfBirth: '',
    gender: '', aadhaarNumber: '', ownMobile: '', addressLine1: '',
    city: '', district: '', state: 'Maharashtra', pinCode: '',
    qualification: '', notes: '',
  });
  const [photo,        setPhoto]   = useState(null);
  const [photoPreview, setPreview] = useState(null);
  const [loading,      setLoading] = useState(false);
  const [error,        setError]   = useState(null);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const data = { ...form };
      if (!data.dateOfBirth) delete data.dateOfBirth;
      const res = await createStudent(data, photo);
      navigate(`/institute/students/${res.data.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <PageHeader title="Add New Student" icon="🎓"
        breadcrumbs={[
          { label: 'Students', to: '/institute/students' },
          { label: 'Add New Student' },
        ]} />

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Photo */}
        <DetailCard title="Student Photo" icon="📷">
          <div className="px-5 py-5">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300
                              flex items-center justify-center overflow-hidden flex-shrink-0">
                {photoPreview
                  ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  : <span className="text-3xl">📷</span>}
              </div>
              <div>
                <label htmlFor="photo-upload" className="cursor-pointer btn-outline text-sm inline-block">
                  {photo ? 'Change Photo' : 'Upload Photo'}
                </label>
                <input id="photo-upload" type="file" accept="image/jpeg,image/png"
                  className="hidden" onChange={handlePhoto} />
                <p className="text-xs text-gray-400 mt-1">JPEG or PNG, max 2MB. Passport size.</p>
              </div>
            </div>
          </div>
        </DetailCard>

        {/* Personal details */}
        <DetailCard title="Personal Details" icon="👤">
          <div className="px-5 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field name="firstName"  label="First Name"  required value={form.firstName}  onChange={handleChange} />
              <Field name="middleName" label="Middle Name"          value={form.middleName} onChange={handleChange} />
              <Field name="surname"    label="Surname"     required value={form.surname}    onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field name="dateOfBirth"   label="Date of Birth" type="date"                   value={form.dateOfBirth}   onChange={handleChange} />
              <Field name="gender"        label="Gender"        as="select" options={GENDERS}  value={form.gender}        onChange={handleChange} />
              <Field name="aadhaarNumber" label="Aadhaar Number" placeholder="XXXX XXXX XXXX" value={form.aadhaarNumber} onChange={handleChange} />
            </div>
          </div>
        </DetailCard>

        {/* Contact */}
        <DetailCard title="Contact & Address" icon="📍">
          <div className="px-5 py-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field name="ownMobile"   label="Mobile Number" required type="tel" placeholder="+91 XXXXX XXXXX" value={form.ownMobile}   onChange={handleChange} />
              <Field name="addressLine1" label="Address"                                                          value={form.addressLine1} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field name="city"     label="City"     value={form.city}     onChange={handleChange} />
              <Field name="district" label="District" value={form.district} onChange={handleChange} />
              <Field name="state"    label="State"    value={form.state}    onChange={handleChange} />
              <Field name="pinCode"  label="PIN Code" value={form.pinCode}  onChange={handleChange} />
            </div>
          </div>
        </DetailCard>

        {/* Academic */}
        <DetailCard title="Academic Details" icon="📚">
          <div className="px-5 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field name="qualification" label="Qualification" as="select" options={QUALIFS} value={form.qualification} onChange={handleChange} />
              <div>
                <label htmlFor="notes" className="label">Notes</label>
                <textarea id="notes" name="notes" rows={3} value={form.notes} onChange={handleChange}
                  className="input resize-none" placeholder="Any additional notes..." />
              </div>
            </div>
          </div>
        </DetailCard>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading
              ? <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2" />Saving...</>
              : '+ Add Student'}
          </button>
          <Link to="/institute/students" className="btn-outline">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
