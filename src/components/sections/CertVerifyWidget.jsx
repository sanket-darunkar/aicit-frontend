import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../i18n/LanguageContext.jsx';

export default function CertVerifyWidget() {
  const { t } = useLang();
  const [cert, setCert] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = cert.trim().toUpperCase();
    if (!num) return;
    navigate(`/verify?cert=${encodeURIComponent(num)}`);
  };

  return (
    <section className="section-muted relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-gold-50 opacity-60" />

      <div className="container-xl relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-card-hover border border-gray-100 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-800" />

            <div className="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800
                                flex items-center justify-center shadow-card flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-.47 3.852 3.745 3.745 0 01-3.852.47A3.745 3.745 0 0112 21 3.745 3.745 0 019.768 19.8a3.745 3.745 0 01-3.852-.47 3.745 3.745 0 01-.47-3.852A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01.47-3.852 3.745 3.745 0 013.852-.47A3.745 3.745 0 0112 3 3.745 3.745 0 0114.232 4.2a3.745 3.745 0 013.852.47 3.745 3.745 0 01.47 3.852A3.745 3.745 0 0121 12z"/>
                  </svg>
                </div>

                {/* Text + form */}
                <div className="flex-1">
                  <h2 className="heading-sm text-primary-900 mb-1">
                    {t('verify.heading')}
                  </h2>
                  <p className="text-sm text-gray-500 mb-5">{t('verify.subheading')}</p>

                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={cert}
                      onChange={e => setCert(e.target.value.toUpperCase())}
                      placeholder={t('verify.placeholder')}
                      aria-label={t('verify.label')}
                      autoComplete="off"
                      spellCheck="false"
                      className="input flex-1 font-mono text-sm uppercase"
                    />
                    <button type="submit" disabled={!cert.trim()}
                      className="btn-primary px-6 whitespace-nowrap disabled:opacity-50">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
                      </svg>
                      {t('verify.btnVerify')}
                    </button>
                  </form>
                  <p className="text-xs text-gray-400 mt-2.5">{t('verify.hintText')}</p>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-4">
                {[
                  { icon: '🔒', label: t('verify.secure'),  sub: 'All verifications are logged and secured' },
                  { icon: '⚡', label: t('verify.instant'), sub: 'Results returned in seconds' },
                  { icon: '📱', label: t('verify.qrReady'), sub: 'Scan QR code from certificate' },
                ].map(({ icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-2.5 flex-1 min-w-[160px]">
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-primary-900">{label}</div>
                      <div className="text-xs text-gray-400">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
