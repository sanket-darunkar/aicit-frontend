import React from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../../config/siteConfig.js';
import { useLang } from '../../i18n/LanguageContext.jsx';

const HIGHLIGHTS = [
  { value: '50+',    label: 'Affiliated Institutes', icon: '🏫' },
  { value: '5,000+', label: 'Students Enrolled',     icon: '🎓' },
  { value: '25+',    label: 'Courses Offered',        icon: '📚' },
  { value: '3,500+', label: 'Certificates Issued',    icon: '📜' },
];

export default function AboutSection() {
  const { t } = useLang();

  return (
    <section className="section-muted">
      <div className="container-xl">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left: content */}
          <div>
            <div className="eyebrow mb-4">{t('about.heading')}</div>
            <h2 className="heading-lg text-primary-900 mb-5 text-balance">
              Empowering India's Computer Education Ecosystem
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The <strong>All India Council for Information Technology (AICIT)</strong> is a registered
              organisation dedicated to delivering quality computer education across India through a
              network of authorised partner institutes.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our centralised platform enables institutes to manage students, submit certificate
              requests and issue nationally verifiable digital certificates — all through one
              secure, modern system.
            </p>

            {/* Registrations pill row */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { label: 'Udyam: UDYAM-MH-20-0221747', icon: '🏛️' },
                { label: 'Society: NGP/44214/1860/18', icon: '📋' },
                { label: 'Est. 2018, Nagpur, Maharashtra', icon: '📍' },
              ].map(({ label, icon }) => (
                <span key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             bg-primary-50 border border-primary-100
                             text-xs font-medium text-primary-800">
                  <span>{icon}</span>{label}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/about" className="btn-primary text-sm">
                {t('about.heading')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </Link>
              <Link to="/contact" className="btn-outline text-sm">{t('nav.contact')}</Link>
            </div>
          </div>

          {/* Right: stat grid + trust logos */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {HIGHLIGHTS.map(({ value, label, icon }) => (
                <div key={label}
                  className="card text-center py-7 hover:-translate-y-1 transition-transform">
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="text-3xl font-heading font-extrabold text-primary-800 mb-1">
                    {value}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">{label}</div>
                </div>
              ))}
            </div>

            {/* Trust logos */}
            <div className="card py-5">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-4 text-center">
                Accredited &amp; Recognised By
              </p>
              <div className="flex items-center justify-around gap-4 flex-wrap">
                {[
                  { src: '/logos/EGAC.jpeg',                                                    alt: 'EGAC' },
                  { src: '/logos/certificado-iso-9001-logo-png_seeklogo-255202.png',            alt: 'ISO 9001' },
                  { src: '/logos/national-career-service-ncs-national-career-service-.jpg',    alt: 'NCS' },
                ].map(({ src, alt }) => (
                  <img key={alt} src={src} alt={alt}
                    className="h-10 w-auto max-w-[80px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    onError={e => { e.target.style.display='none'; }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
