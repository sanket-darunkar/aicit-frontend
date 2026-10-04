import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerInstitute } from '../services/publicService.js';
import { useLang } from '../i18n/LanguageContext.jsx';

const STEPS = [
  { label: 'Institute Info',  icon: '🏫' },
  { label: 'Contact Person',  icon: '👤' },
  { label: 'Agreement',       icon: '📋' },
  { label: 'Review',          icon: '✅' },
];

const INSTITUTE_TYPES = [
  'Computer Training Center', 'School', 'College / University',
  'Vocational Institute', 'Other',
];

const INITIAL = {
  instituteName:'', instituteType:'', address1:'', address2:'',
  city:'', district:'', state:'Maharashtra', pinCode:'', website:'',
  contactName:'', contactEmail:'', contactMobile:'', designation:'',
  agreeTerms: false,
};

function Field({ name, label, required, type='text', as, options, value, onChange, errors={}, placeholder, ...rest }) {
  const hasError = !!errors[name];
  return (
    <div>
      <label htmlFor={name} className={`label ${required ? 'label-req' : ''}`}>{label}</label>
      {as === 'select' ? (
        <select id={name} name={name} value={value} onChange={onChange}
          className={hasError ? 'input-error' : 'input'}>
          <option value="">Select...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input id={name} name={name} type={type} value={value} onChange={onChange}
          required={required} placeholder={placeholder} {...rest}
          className={hasError ? 'input-error' : 'input'} />
      )}
      {hasError && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex-shrink-0 mt-0.5">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value || '—'}</span>
    </div>
  );
}

export default function RegisterInstitutePage() {
  const { t } = useLang();
  const [step,      setStep]      = useState(0);
  const [form,      setForm]      = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [errors,    setErrors]    = useState({});
  const [loading,   setLoading]   = useState(false);

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };
  const f = (name) => ({ name, value: form[name], onChange: set, errors });

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.instituteName.trim()) e.instituteName = 'Required';
      if (!form.instituteType)        e.instituteType  = 'Required';
      if (!form.address1.trim())      e.address1       = 'Required';
      if (!form.city.trim())          e.city           = 'Required';
      if (!form.district.trim())      e.district       = 'Required';
      if (!form.pinCode.trim())       e.pinCode        = 'Required';
    }
    if (step === 1) {
      if (!form.contactName.trim())   e.contactName   = 'Required';
      if (!form.contactEmail.trim())  e.contactEmail  = 'Required';
      if (!form.contactMobile.trim()) e.contactMobile = 'Required';
    }
    if (step === 2 && !form.agreeTerms) e.agreeTerms = 'You must agree to continue';
    return e;
  };

  const next = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const prev = () => { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerInstitute({
        instituteName: form.instituteName, instituteType: form.instituteType,
        addressLine1: form.address1, addressLine2: form.address2,
        city: form.city, district: form.district, state: form.state,
        pinCode: form.pinCode, websiteUrl: form.website,
        contactPersonName: form.contactName, contactEmail: form.contactEmail,
        contactMobile: form.contactMobile,
      });
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4 py-16">
        <div className="card max-w-lg w-full text-center py-12">
          <div className="w-20 h-20 rounded-3xl bg-trust-100 flex items-center justify-center mx-auto mb-6 text-4xl">
            🎉
          </div>
          <h2 className="heading-md text-primary-900 mb-3">Application Submitted!</h2>
          <p className="text-gray-600 mb-2 text-sm">
            Thank you, <strong>{form.contactName}</strong>. Your application for{' '}
            <strong>{form.instituteName}</strong> has been submitted successfully.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Our team will review and contact you at <strong>{form.contactEmail}</strong> within 3–5 working days.
          </p>
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 text-left mb-8">
            <p className="text-sm font-semibold text-primary-900 mb-3">What happens next?</p>
            {['AICIT team reviews your application', 'You receive approval/rejection email', 'Upon approval, login credentials are emailed'].map((s, i) => (
              <div key={s} className="flex items-start gap-3 mb-2 last:mb-0">
                <span className="w-6 h-6 rounded-full bg-primary-800 text-white text-xs font-bold
                                 flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                <span className="text-sm text-primary-800">{s}</span>
              </div>
            ))}
          </div>
          <Link to="/" className="btn-primary">← Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 py-12">
        <div className="container-xl text-center">
          <div className="eyebrow-white mx-auto mb-4">{t('register.heading')}</div>
          <h1 className="heading-lg text-white mb-3">{t('register.heading')}</h1>
          <p className="text-blue-200 max-w-md mx-auto text-sm">
            Join the AICIT network and start issuing verified certificates to your students.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map(({ label, icon }, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold
                                 transition-all duration-200
                  ${i < step  ? 'bg-trust-600 text-white shadow-card'
                  : i === step ? 'bg-primary-800 text-white shadow-card ring-4 ring-primary-200'
                  : 'bg-surface-200 text-gray-400'}`}>
                  {i < step ? '✓' : icon}
                </div>
                <span className={`text-[10px] font-semibold hidden sm:block tracking-wide
                  ${i === step ? 'text-primary-800' : i < step ? 'text-trust-700' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-300
                  ${i < step ? 'bg-trust-500' : 'bg-surface-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form card */}
        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Step 0 — Institute Info */}
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="heading-sm text-primary-900 mb-5">Institute Information</h2>
                <Field label="Institute Name" required placeholder="e.g. ABC Computer Academy" {...f('instituteName')} />
                <Field label="Institute Type" required as="select" options={INSTITUTE_TYPES} {...f('instituteType')} />
                <Field label="Address Line 1" required placeholder="Building name, street" {...f('address1')} />
                <Field label="Address Line 2" placeholder="Area, landmark (optional)" {...f('address2')} />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="City / Village" required {...f('city')} />
                  <Field label="District"       required {...f('district')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="State"    required {...f('state')} />
                  <Field label="PIN Code" required placeholder="441XXX" {...f('pinCode')} />
                </div>
                <Field label="Website URL" type="url" placeholder="https://yoursite.com (optional)" {...f('website')} />
              </div>
            )}

            {/* Step 1 — Contact */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="heading-sm text-primary-900 mb-5">Contact Person</h2>
                <Field label="Full Name"   required placeholder="e.g. Rajesh Sharma" {...f('contactName')} />
                <Field label="Designation"          placeholder="e.g. Director, Principal" {...f('designation')} />
                <Field label="Email Address" required type="email" placeholder="email@example.com" {...f('contactEmail')} />
                <Field label="Mobile Number" required type="tel" placeholder="+91 XXXXX XXXXX" {...f('contactMobile')} />
              </div>
            )}

            {/* Step 2 — Agreement */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="heading-sm text-primary-900 mb-5">Terms &amp; Agreement</h2>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                  <strong>📋 Document Note:</strong> Document upload will be available in a future version.
                  Our team will contact you to collect verification documents after reviewing your application.
                </div>
                <div className="p-5 border border-gray-200 rounded-2xl bg-surface-50">
                  <div className="flex items-start gap-3">
                    <input id="agreeTerms" name="agreeTerms" type="checkbox"
                      checked={form.agreeTerms} onChange={set}
                      className="mt-0.5 h-4 w-4 accent-primary-800 rounded flex-shrink-0" />
                    <label htmlFor="agreeTerms" className="text-sm text-gray-700 leading-relaxed">
                      I confirm that all information provided is accurate and complete. I agree to the{' '}
                      <Link to="/terms" className="text-primary-700 underline font-medium" target="_blank">Terms &amp; Conditions</Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary-700 underline font-medium" target="_blank">Privacy Policy</Link>{' '}
                      of AICIT.
                    </label>
                  </div>
                  {errors.agreeTerms && <p className="mt-2 text-xs text-red-500 ml-7">{errors.agreeTerms}</p>}
                </div>
              </div>
            )}

            {/* Step 3 — Review */}
            {step === 3 && (
              <div>
                <h2 className="heading-sm text-primary-900 mb-5">Review &amp; Submit</h2>
                <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 mb-5">
                  <p className="text-xs text-primary-700 font-semibold mb-3 uppercase tracking-wide">Institute</p>
                  <ReviewRow label="Name"     value={form.instituteName} />
                  <ReviewRow label="Type"     value={form.instituteType} />
                  <ReviewRow label="Address"  value={[form.address1, form.address2, form.city, form.district, form.state, form.pinCode].filter(Boolean).join(', ')} />
                  <ReviewRow label="Website"  value={form.website} />
                </div>
                <div className="bg-surface-50 border border-gray-100 rounded-2xl p-5">
                  <p className="text-xs text-gray-500 font-semibold mb-3 uppercase tracking-wide">Contact Person</p>
                  <ReviewRow label="Name"        value={form.contactName} />
                  <ReviewRow label="Designation" value={form.designation} />
                  <ReviewRow label="Email"        value={form.contactEmail} />
                  <ReviewRow label="Mobile"       value={form.contactMobile} />
                </div>
                {errors.submit && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    {errors.submit}
                  </div>
                )}
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 0 ? (
                <button type="button" onClick={prev}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold
                             text-gray-700 border border-gray-200 rounded-xl hover:bg-surface-50
                             transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
                  </svg>
                  {t('common.previous')}
                </button>
              ) : <div />}

              {step < STEPS.length - 1 ? (
                <button type="button" onClick={next} className="btn-primary">
                  {t('common.next')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                  </svg>
                </button>
              ) : (
                <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                      </svg>
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
