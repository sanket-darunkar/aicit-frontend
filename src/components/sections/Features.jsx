import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../i18n/LanguageContext.jsx';

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-.47 3.852 3.745 3.745 0 01-3.852.47A3.745 3.745 0 0112 21 3.745 3.745 0 019.768 19.8a3.745 3.745 0 01-3.852-.47 3.745 3.745 0 01-.47-3.852A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01.47-3.852 3.745 3.745 0 013.852-.47A3.745 3.745 0 0112 3 3.745 3.745 0 0114.232 4.2a3.745 3.745 0 013.852.47 3.745 3.745 0 01.47 3.852A3.745 3.745 0 0121 12z"/>
      </svg>
    ),
    color: 'bg-primary-100 text-primary-700',
    border: 'border-primary-100',
    titleKey: 'Nationally Recognised',
    descKey:  'Certificates issued by AICIT are verifiable online and recognised across India by employers and institutions.',
    link: '/verify',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/>
      </svg>
    ),
    color: 'bg-gold-100 text-gold-700',
    border: 'border-gold-100',
    titleKey: 'Industry-Ready Courses',
    descKey:  'Our curriculum is designed with industry input, covering everything from computer fundamentals to advanced accounting and design.',
    link: '/courses',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
      </svg>
    ),
    color: 'bg-trust-100 text-trust-700',
    border: 'border-trust-100',
    titleKey: '50+ Affiliated Institutes',
    descKey:  'A growing network of authorised institutes across Maharashtra and India delivering quality computer education.',
    link: '/about',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"/>
      </svg>
    ),
    color: 'bg-purple-100 text-purple-700',
    border: 'border-purple-100',
    titleKey: 'Digital Certificate Platform',
    descKey:  'Institutes manage students, request certificates and download PDFs through our secure online portal — no paperwork needed.',
    link: '/register-institute',
  },
];

export default function Features() {
  const { t } = useLang();
  return (
    <section className="section-muted">
      <div className="container-xl">
        {/* Header */}
        <div className="section-label">
          <div className="eyebrow mx-auto">{t('features.heading')}</div>
          <h2 className="heading-lg text-primary-900 mt-3">{t('features.heading')}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mt-3 leading-relaxed">
            {t('features.subheading')}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
          {FEATURES.map(({ icon, color, border, titleKey, descKey, link }) => (
            <Link key={titleKey} to={link}
              className={`card group border-t-4 ${border} hover:-translate-y-1 transition-all duration-300`}>
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4
                               group-hover:scale-110 transition-transform duration-200`}>
                {icon}
              </div>
              <h3 className="font-heading font-bold text-primary-900 mb-2 text-base">{titleKey}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{descKey}</p>
              <div className="mt-4 flex items-center gap-1.5 text-primary-600 text-xs font-semibold
                              group-hover:gap-2.5 transition-all duration-200">
                {t('common.learnMore')}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
