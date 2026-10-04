import React from 'react';
import { Link } from 'react-router-dom';
import { ORGANIZATION } from '../data/aicitCompliance.js';
import LegalRegistrationSection from '../components/sections/LegalRegistrationSection.jsx';
import { useLang } from '../i18n/LanguageContext.jsx';

const STATS = [
  { value: '2018',  label: 'Established',          icon: '📅' },
  { value: '50+',   label: 'Affiliated Institutes', icon: '🏫' },
  { value: '5000+', label: 'Students Trained',      icon: '🎓' },
  { value: '25+',   label: 'Courses Offered',       icon: '📚' },
];

const VALUES = [
  {
    icon: '🎯',
    title: 'Our Mission',
    desc:  'To empower computer education institutes across India with a modern, centralised platform for managing students, courses and nationally verifiable digital certificates.',
  },
  {
    icon: '🔭',
    title: 'Our Vision',
    desc:  'To become India\'s most trusted certification authority for computer education — making every certificate issued by our partner institutes instantly verifiable and widely recognised.',
  },
  {
    icon: '💡',
    title: 'Our Approach',
    desc:  'We combine technology with trust — providing institutes with simple digital tools while maintaining the highest standards of certificate integrity and security.',
  },
];

export default function AboutPage() {
  const { t } = useLang();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern bg-dot-md opacity-10" />
        <div className="container-xl relative z-10">
          <div className="max-w-3xl">
            <div className="eyebrow-white mb-5">{t('about.heading')}</div>
            <h1 className="heading-xl text-white mb-5 text-balance">
              About <span className="gradient-text-gold">AICIT</span>
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed mb-8 max-w-2xl">
              The <strong className="text-white">All India Council for Information Technology</strong> is a registered
              organisation dedicated to delivering quality computer education and issuing verifiable digital
              certificates through a network of authorised partner institutes across India.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register-institute" className="btn-gold">{t('nav.registerInstitute')}</Link>
              <Link to="/verify" className="btn-white">{t('verify.heading')}</Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-3 border-2
                border-white/30 hover:border-white text-white font-semibold rounded-xl
                transition-all duration-200 hover:bg-white/10 text-sm">
                {t('nav.contact')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-xl py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon }) => (
              <div key={label} className="text-center py-4">
                <div className="text-3xl mb-1.5">{icon}</div>
                <div className="text-3xl font-heading font-extrabold text-primary-800">{value}</div>
                <div className="text-sm text-gray-500 mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who we are */}
      <section className="section-light">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="eyebrow mb-4">Organisation Identity</div>
              <h2 className="heading-md text-primary-900 mb-5">Who We Are</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  AICIT was established in <strong>{ORGANIZATION.established}</strong> in{' '}
                  <strong>{ORGANIZATION.city}, {ORGANIZATION.state}</strong> with a mission to transform
                  computer education delivery in India through standardisation, technology and trust.
                </p>
                <p>
                  We operate as a <strong>registered society</strong> (Society Registration Act, 1860)
                  and a <strong>registered MSME enterprise</strong> under the Ministry of MSME, Government
                  of India. Our Udyam registration number is <strong>UDYAM-MH-20-0221747</strong>.
                </p>
                <p>
                  Our platform allows approved institutes to enrol students, track their progress, and
                  request AICIT-branded certificates that are verifiable online — giving students a
                  nationally recognised credential and employers an easy way to verify authenticity.
                </p>
              </div>

              {/* Registration pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  { icon: '🏛️', label: 'MSME Udyam Registered' },
                  { icon: '📋', label: 'Society Registered (1860)' },
                  { icon: '📍', label: 'Nagpur, Maharashtra' },
                  { icon: '📅', label: `Est. ${ORGANIZATION.established}` },
                ].map(({ icon, label }) => (
                  <span key={label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                               bg-primary-50 border border-primary-100 text-xs font-medium text-primary-800">
                    {icon} {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Scope of services */}
            <div className="card">
              <h3 className="font-heading font-bold text-primary-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>
                  </svg>
                </span>
                Scope of Certification
              </h3>
              <ul className="space-y-2.5">
                {ORGANIZATION.scope.map(s => (
                  <li key={s} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-trust-100 flex items-center justify-center
                                     flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-trust-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                      </svg>
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Approach */}
      <section className="section-muted">
        <div className="container-xl">
          <div className="section-label">
            <h2 className="heading-md text-primary-900">Mission, Vision &amp; Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="card text-center hover:-translate-y-1 transition-transform">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-heading font-bold text-primary-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust logos */}
      <section className="section-light border-t border-gray-100">
        <div className="container-xl">
          <div className="section-label">
            <h2 className="heading-sm text-primary-900">Accredited &amp; Recognised By</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-10 mt-6">
            {[
              { src: '/logos/EGAC.jpeg',                                                    alt: 'EGAC',                 label: 'EGAC' },
              { src: '/logos/certificado-iso-9001-logo-png_seeklogo-255202.png',            alt: 'ISO 9001:2015',        label: 'ISO 9001:2015' },
              { src: '/logos/national-career-service-ncs-national-career-service-.jpg',    alt: 'National Career Service', label: 'National Career Service' },
            ].map(({ src, alt, label }) => (
              <div key={alt} className="flex flex-col items-center gap-2">
                <img src={src} alt={alt}
                  className="h-16 w-auto max-w-[120px] object-contain"
                  onError={e => { e.target.style.display='none'; }}
                />
                <span className="text-xs text-gray-400 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal section */}
      <LegalRegistrationSection />
    </div>
  );
}
