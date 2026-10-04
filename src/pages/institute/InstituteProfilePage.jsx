import React, { useEffect, useState } from 'react';
import { useInstituteAuth } from '../../contexts/InstituteAuthContext.jsx';
import { instituteApi } from '../../services/api.js';

function Row({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2.5 border-b border-gray-50">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider sm:w-48 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-900">{value || '—'}</span>
    </div>
  );
}

// ── Change Password Form ──────────────────────────────────────
function ChangePasswordForm() {
  const [form,    setForm]    = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show,    setShow]    = useState({ current: false, newPw: false, confirm: false });
  const [status,  setStatus]  = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const toggle = (key) => setShow(s => ({ ...s, [key]: !s[key] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (form.newPassword.length < 8) {
      setStatus('error'); setMessage('New password must be at least 8 characters.'); return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setStatus('error'); setMessage('New passwords do not match.'); return;
    }
    if (form.newPassword === form.currentPassword) {
      setStatus('error'); setMessage('New password must be different from current password.'); return;
    }

    setStatus('loading');
    try {
      await instituteApi.post('/api/institute/profile/change-password', {
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword,
      });
      setStatus('success');
      setMessage('Password changed successfully.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Failed to change password. Check your current password and try again.');
    }
  };

  const inputClass = (err) =>
    `w-full px-4 py-2.5 text-sm border rounded-lg pr-10
     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
     ${err ? 'border-red-300 bg-red-50' : 'border-gray-300'}`;

  const EyeButton = ({ field, showKey }) => (
    <button type="button" onClick={() => toggle(showKey)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      aria-label={show[showKey] ? 'Hide' : 'Show'}>
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {show[showKey]
          ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
          : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></>
        }
      </svg>
    </button>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-base font-heading font-bold text-primary-900 mb-1">Change Password</h3>
      <p className="text-sm text-gray-500 mb-5">Update your portal login password.</p>

      {status === 'success' && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
          </svg>
          {message}
        </div>
      )}
      {status === 'error' && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <div className="relative">
            <input type={show.current ? 'text' : 'password'} required
              value={form.currentPassword} onChange={e => set('currentPassword', e.target.value)}
              placeholder="Enter current password"
              className={inputClass(false)} />
            <EyeButton showKey="current" />
          </div>
        </div>

        {/* New password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <div className="relative">
            <input type={show.newPw ? 'text' : 'password'} required
              value={form.newPassword} onChange={e => set('newPassword', e.target.value)}
              placeholder="At least 8 characters"
              className={inputClass(status === 'error' && form.newPassword.length > 0 && form.newPassword.length < 8)} />
            <EyeButton showKey="newPw" />
          </div>
          {form.newPassword.length > 0 && form.newPassword.length < 8 && (
            <p className="mt-1 text-xs text-red-500">Must be at least 8 characters</p>
          )}
        </div>

        {/* Confirm new password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <div className="relative">
            <input type={show.confirm ? 'text' : 'password'} required
              value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
              placeholder="Re-enter new password"
              className={inputClass(form.confirmPassword.length > 0 && form.confirmPassword !== form.newPassword)} />
            <EyeButton showKey="confirm" />
          </div>
          {form.confirmPassword.length > 0 && form.confirmPassword !== form.newPassword && (
            <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
          )}
        </div>

        <button type="submit" disabled={status === 'loading'}
          className="px-6 py-2.5 bg-primary-800 hover:bg-primary-700 disabled:opacity-60
                     text-white text-sm font-semibold rounded-lg transition-colors
                     flex items-center gap-2">
          {status === 'loading' ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Updating...
            </>
          ) : '🔑 Update Password'}
        </button>
      </form>
    </div>
  );
}

export default function InstituteProfilePage() {
  const { user } = useInstituteAuth();
  const [institute, setInstitute] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    instituteApi.get('/api/institute/profile')
      .then(r => setInstitute(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20 text-gray-400"><svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Loading...</div>;

  const data = institute || {};

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-heading font-bold text-primary-900">Institute Profile</h1>

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          Could not load profile from server. Showing details from your login session.
        </div>
      )}

      {/* Institute info card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center text-2xl flex-shrink-0">🏫</div>
          <div>
            <h2 className="text-xl font-heading font-bold text-primary-900">
              {data.name || user?.instituteName}
            </h2>
            <p className="text-sm font-mono text-gray-500">
              {data.instituteCode || 'Code not available'}
            </p>
          </div>
        </div>

        <Row label="Institute Code"   value={data.instituteCode} />
        <Row label="Type"             value={data.type} />
        <Row label="Status"           value={data.status} />
        <Row label="Address"          value={[data.addressLine1, data.addressLine2, data.city, data.district, data.state, data.pinCode].filter(Boolean).join(', ')} />
        <Row label="Website"          value={data.websiteUrl} />
        <Row label="Contact Person"   value={data.contactPersonName} />
        <Row label="Email"            value={data.contactEmail} />
        <Row label="Mobile"           value={data.contactMobile} />
        <Row label="Approved On"      value={data.approvedAt ? new Date(data.approvedAt).toLocaleDateString('en-IN') : '—'} />
        <Row label="Registered On"    value={data.createdAt   ? new Date(data.createdAt).toLocaleDateString('en-IN')  : '—'} />
      </div>

      {/* Portal user info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-base font-heading font-bold text-primary-900 mb-4">Portal Account</h3>
        <Row label="Login Email" value={user?.email} />
        <Row label="Role"        value={user?.role} />
      </div>

      {/* Change password */}
      <ChangePasswordForm />

      <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 text-sm text-primary-800">
        To update institute information, please contact AICIT admin at <strong>info@aicit.org</strong>
      </div>
    </div>
  );
}
