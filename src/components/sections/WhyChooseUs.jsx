import React from 'react';
import { useLang } from '../../i18n/LanguageContext.jsx';
import { WHY_CHOOSE_US } from '../../config/siteConfig.js';

const ICONS = {
  trophy: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"/>
    </svg>
  ),
  briefcase: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"/>
    </svg>
  ),
  users: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
    </svg>
  ),
  chart: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
    </svg>
  ),
};

const COLORS = [
  { bg: 'bg-primary-600', light: 'bg-primary-50', text: 'text-primary-700', num: 'text-primary-200' },
  { bg: 'bg-gold-500',    light: 'bg-gold-50',    text: 'text-gold-700',    num: 'text-gold-200' },
  { bg: 'bg-trust-600',   light: 'bg-trust-50',   text: 'text-trust-700',   num: 'text-trust-200' },
  { bg: 'bg-purple-600',  light: 'bg-purple-50',  text: 'text-purple-700',  num: 'text-purple-200' },
];

export default function WhyChooseUs() {
  const { t } = useLang();

  return (
    <section className="section-light relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-primary-50 rounded-full
                      -translate-y-1/2 translate-x-1/2 opacity-60" />
      <div className="absolute left-0 bottom-0 w-64 h-64 bg-gold-50 rounded-full
                      translate-y-1/2 -translate-x-1/2 opacity-60" />

      <div className="container-xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: heading + intro */}
          <div>
            <div className="eyebrow mb-4">{t('features.heading')}</div>
            <h2 className="heading-lg text-primary-900 mb-5 text-balance">
              Why <span className="gradient-text">AICIT</span> Is The Right Choice
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              {t('features.subheading')}
            </p>
            {/* Logo trust display */}
            <div className="flex items-center gap-4">
              <img src="/logos/AICIT logo.jpeg" alt="AICIT"
                className="h-16 w-16 rounded-2xl object-contain bg-white border border-gray-100 shadow-card p-1"
                onError={e => { e.target.style.display='none'; }}
              />
              <div>
                <div className="font-heading font-bold text-primary-900">AICIT</div>
                <div className="text-sm text-gray-500">All India Council for Information Technology</div>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-2 h-2 rounded-full bg-trust-500" />
                  <span className="text-xs text-trust-700 font-semibold">Verified Organisation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: reason cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY_CHOOSE_US.map((item, i) => {
              const c = COLORS[i % COLORS.length];
              return (
                <div key={item.title}
                  className="relative p-5 rounded-2xl border border-gray-100 bg-white
                             shadow-xs hover:shadow-card-hover hover:-translate-y-0.5
                             transition-all duration-300 overflow-hidden group">
                  {/* Number watermark */}
                  <span className={`absolute right-3 top-2 text-6xl font-heading font-black
                                    opacity-8 select-none ${c.num} ${c.light}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className={`w-11 h-11 rounded-xl ${c.bg} text-white flex items-center
                                   justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    {ICONS[item.icon] || <span className="text-xl">✦</span>}
                  </div>
                  <h3 className="font-heading font-bold text-primary-900 mb-1.5 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
