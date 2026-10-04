import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../i18n/LanguageContext.jsx';

const STEPS = [
  {
    num: '01',
    titleKey: 'howItWorks.step1',
    desc: 'Submit your institute registration application online. Provide institute details, contact information and required documents.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
    ),
    color: 'from-primary-600 to-primary-700',
  },
  {
    num: '02',
    titleKey: 'howItWorks.step2',
    desc: 'Our team reviews your application. Upon approval, you receive your login credentials via email to access the institute portal.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-.47 3.852 3.745 3.745 0 01-3.852.47A3.745 3.745 0 0112 21 3.745 3.745 0 019.768 19.8a3.745 3.745 0 01-3.852-.47 3.745 3.745 0 01-.47-3.852A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01.47-3.852 3.745 3.745 0 013.852-.47A3.745 3.745 0 0112 3 3.745 3.745 0 0114.232 4.2a3.745 3.745 0 013.852.47 3.745 3.745 0 01.47 3.852A3.745 3.745 0 0121 12z"/>
      </svg>
    ),
    color: 'from-gold-500 to-gold-600',
  },
  {
    num: '03',
    titleKey: 'howItWorks.step3',
    desc: 'Log in to your institute portal and start adding student records. Upload photos and enter course enrollment details.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
      </svg>
    ),
    color: 'from-trust-600 to-trust-700',
  },
  {
    num: '04',
    titleKey: 'howItWorks.step4',
    desc: 'Submit certificate requests for completed students. After admin review, download the official AICIT PDF certificate instantly.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>
      </svg>
    ),
    color: 'from-purple-600 to-purple-700',
  },
];

export default function HowItWorks() {
  const { t } = useLang();
  return (
    <section className="section-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-dot-pattern bg-dot-md opacity-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-1
                      bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

      <div className="container-xl relative z-10">
        {/* Header */}
        <div className="section-label">
          <div className="eyebrow-white mx-auto">{t('howItWorks.heading')}</div>
          <h2 className="heading-lg text-white mt-3">{t('howItWorks.heading')}</h2>
          <p className="text-blue-300 max-w-2xl mx-auto mt-3">{t('howItWorks.subheading')}</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5
                          bg-gradient-to-r from-primary-600 via-gold-500 to-purple-600 opacity-40 z-0" />

          {STEPS.map(({ num, titleKey, desc, icon, color }, i) => (
            <div key={num}
              className="relative z-10 glass rounded-2xl p-6 text-center
                         hover:bg-white/12 transition-all duration-300 hover:-translate-y-1 group">
              {/* Number */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} text-white
                               flex items-center justify-center mx-auto mb-4 shadow-card
                               group-hover:scale-110 transition-transform duration-200`}>
                {icon}
              </div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest"
                    aria-hidden="true">Step {num}</span>
              <h3 className="font-heading font-bold text-white text-base mt-1.5 mb-2">
                {t(titleKey)}
              </h3>
              <p className="text-sm text-blue-300 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link to="/register-institute" className="btn-gold px-8 py-3.5">
            {t('howItWorks.cta')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
