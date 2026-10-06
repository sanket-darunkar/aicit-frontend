import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';
import { BASE_URL } from '../services/api.js';

function FieldRow({ label, value, mono }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-3 border-b border-gray-50 last:border-0">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider sm:w-44 flex-shrink-0">{label}</span>
      <span className={`text-sm font-semibold text-gray-900 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

function ResultFound({ data, t }) {
  return (
    <div className="card overflow-hidden border-trust-100 p-0">
      <div className="bg-gradient-to-r from-trust-600 to-trust-700 px-6 py-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
          </svg>
        </div>
        <div>
          <p className="text-white font-heading font-bold text-lg">{t('verify.resultValid')}</p>
          <p className="text-green-100 text-sm mt-0.5">{t('verify.authentic')}</p>
        </div>
        <div className="ml-auto">
          <span className="badge bg-white/20 text-white border border-white/30 text-xs font-bold px-3 py-1">
            {data.status}
          </span>
        </div>
      </div>
      <div className="p-6">
        <FieldRow label={t('verify.certNo')}      value={data.certificateNumber} mono />
        <FieldRow label={t('verify.studentName')} value={data.studentName} />
        <FieldRow label={t('verify.course')}      value={data.courseName} />
        <FieldRow label={t('verify.institute')}   value={data.instituteName} />
        <FieldRow label={t('verify.grade')}       value={data.grade} />
        <FieldRow label={t('verify.issueDate')}   value={data.issueDate} />
      </div>
      <div className="px-6 pb-6">
        <div className="p-4 bg-trust-50 border border-trust-100 rounded-xl flex items-center gap-3">
          <svg className="w-5 h-5 text-trust-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-.47 3.852 3.745 3.745 0 01-3.852.47A3.745 3.745 0 0112 21 3.745 3.745 0 019.768 19.8a3.745 3.745 0 01-3.852-.47 3.745 3.745 0 01-.47-3.852A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01.47-3.852 3.745 3.745 0 013.852-.47A3.745 3.745 0 0112 3 3.745 3.745 0 0114.232 4.2a3.745 3.745 0 013.852.47 3.745 3.745 0 01.47 3.852A3.745 3.745 0 0121 12z"/>
          </svg>
          <p className="text-sm text-trust-800 font-medium">
            {t('common.issuedBy')} — {t('verify.authentic')}
          </p>
        </div>
      </div>
    </div>
  );
}

function ResultRevoked({ certNumber, t }) {
  return (
    <div className="card overflow-hidden border-red-100 p-0">
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </div>
        <div>
          <p className="text-white font-heading font-bold text-lg">{t('verify.resultRevoked')}</p>
          <p className="text-red-100 text-sm mt-0.5">This certificate has been revoked and is no longer valid</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-2">
          Certificate Number: <strong className="text-gray-900 font-mono">{certNumber}</strong>
        </p>
        <p className="text-sm text-gray-500">
          If you believe this is an error, please contact AICIT at <strong>info@aicit.org.in</strong>.
        </p>
      </div>
    </div>
  );
}

function ResultNotFound({ certNumber, t }) {
  return (
    <div className="card overflow-hidden border-amber-100 p-0">
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
          </svg>
        </div>
        <div>
          <p className="text-white font-heading font-bold text-lg">{t('verify.resultNotFound')}</p>
          <p className="text-amber-50 text-sm mt-0.5">No certificate found for the number entered</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-3">
          Searched for: <strong className="text-gray-900 font-mono">{certNumber}</strong>
        </p>
        <ul className="space-y-1.5 text-sm text-gray-500 list-none">
          {[
            'Check that the certificate number is entered correctly',
            `Certificate numbers begin with AICIT-`,
            'Contact your institute if the issue persists',
          ].map(m => (
            <li key={m} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function CertificateVerificationPage() {
  const { t } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const [certInput, setCertInput] = useState(searchParams.get('cert') || '');
  const [status, setStatus]       = useState('idle');
  const [result, setResult]       = useState(null);
  const [errorMsg, setErrorMsg]   = useState('');

  useEffect(() => {
    const cert = searchParams.get('cert');
    if (cert) { setCertInput(cert); handleVerify(cert); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleVerify(override) {
    const number = (override ?? certInput).trim().toUpperCase();
    if (!number) return;
    setStatus('loading'); setResult(null); setErrorMsg('');
    try {
      const res  = await fetch(`${BASE_URL}/api/public/certificates/verify/${encodeURIComponent(number)}`);
      if (res.status === 404) { setStatus('not_found'); return; }
      const body = await res.json();
      if (!res.ok) { setStatus('error'); setErrorMsg(body?.message || t('common.error')); return; }
      const cert = body.data;
      setStatus(cert.status === 'REVOKED' ? 'revoked' : 'found');
      setResult(cert);
    } catch {
      setStatus('error');
      setErrorMsg('Unable to connect to the server. Please check your connection and try again.');
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const num = certInput.trim().toUpperCase();
    if (!num) return;
    setSearchParams({ cert: num });
    handleVerify(num);
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Page header */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 py-12 sm:py-16">
        <div className="container-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-gold-500 flex items-center justify-center mx-auto mb-5 shadow-glow">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-.47 3.852 3.745 3.745 0 01-3.852.47A3.745 3.745 0 0112 21 3.745 3.745 0 019.768 19.8a3.745 3.745 0 01-3.852-.47 3.745 3.745 0 01-.47-3.852A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01.47-3.852 3.745 3.745 0 013.852-.47A3.745 3.745 0 0112 3 3.745 3.745 0 0114.232 4.2a3.745 3.745 0 013.852.47 3.745 3.745 0 01.47 3.852A3.745 3.745 0 0121 12z"/>
            </svg>
          </div>
          <h1 className="heading-lg text-white mb-3">{t('verify.heading')}</h1>
          <p className="text-blue-200 max-w-lg mx-auto">{t('verify.subheading')}</p>
        </div>
      </div>

      <div className="container-xl py-10 max-w-2xl">
        {/* Search form */}
        <div className="card mb-6">
          <label className="label" htmlFor="cert-input">{t('verify.label')}</label>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              id="cert-input"
              type="text"
              value={certInput}
              onChange={e => setCertInput(e.target.value.toUpperCase())}
              placeholder={t('verify.placeholder')}
              className="input flex-1 font-mono uppercase text-sm"
              autoComplete="off" spellCheck="false"
              aria-label={t('verify.label')}
            />
            <button type="submit" disabled={!certInput.trim() || status === 'loading'}
              className="btn-primary whitespace-nowrap disabled:opacity-50 min-w-[100px]">
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {t('verify.btnChecking')}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                  </svg>
                  {t('verify.btnVerify')}
                </>
              )}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-2">{t('verify.hintText')}</p>
        </div>

        {/* Results */}
        {status === 'found'     && <ResultFound data={result} t={t} />}
        {status === 'revoked'   && <ResultRevoked certNumber={certInput} t={t} />}
        {status === 'not_found' && <ResultNotFound certNumber={certInput} t={t} />}
        {status === 'error'     && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">{errorMsg}</div>
        )}

        {/* Idle state info */}
        {status === 'idle' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            {[
              { icon: '🔒', title: t('verify.secure'),  desc: 'All verifications are logged and secured.' },
              { icon: '⚡', title: t('verify.instant'), desc: 'Results returned in seconds.' },
              { icon: '📱', title: t('verify.qrReady'), desc: 'Scan QR code from certificate.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card text-center py-6">
                <div className="text-3xl mb-2">{icon}</div>
                <h3 className="text-sm font-semibold text-primary-900">{title}</h3>
                <p className="text-xs text-gray-500 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
