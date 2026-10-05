import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { STATS } from '../../config/siteConfig.js';
import { publicApi } from '../../services/api.js';
import { useLang } from '../../i18n/LanguageContext.jsx';

const TRUST_ITEMS = [
  { src: '/logos/EGAC.jpeg',                                              alt: 'EGAC' },
  { src: '/logos/certificado-iso-9001-logo-png_seeklogo-255202.png',      alt: 'ISO 9001' },
  { src: '/logos/national-career-service-ncs-national-career-service-.jpg', alt: 'NCS' },
];

function StatCard({ label, value, loading, icon }) {
  return (
    <div className="glass rounded-2xl px-5 py-4 text-white text-center min-w-[130px] flex-1
                    hover:bg-white/15 transition-all duration-200 group">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl sm:text-3xl font-heading font-extrabold text-gold-400 leading-none">
        {loading
          ? <span className="inline-block w-14 h-7 skeleton rounded-lg" />
          : value}
      </div>
      <div className="text-xs sm:text-sm font-medium text-blue-100 mt-1.5 leading-snug">{label}</div>
    </div>
  );
}

export default function Hero() {
  const { t } = useLang();
  const [liveStats, setLiveStats]   = useState(null);
  const [statsLoading, setLoading]  = useState(true);

  useEffect(() => {
    publicApi.get('/api/public/stats')
      .then(res => setLiveStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayStats = [
    {
      label: t('stats.institutes'),
      value: (liveStats?.totalInstitutes != null && liveStats.totalInstitutes > 50)
        ? liveStats.totalInstitutes + '+'
        : '50+',
      icon: '🏫',
    },
    {
      label: t('stats.students'),
      value: (liveStats?.totalStudents != null && liveStats.totalStudents > 5000)
        ? liveStats.totalStudents.toLocaleString('en-IN') + '+'
        : '5,000+',
      icon: '🎓',
    },
    {
      label: t('stats.certificates'),
      value: (liveStats?.totalCertificates != null && liveStats.totalCertificates > 3500)
        ? liveStats.totalCertificates.toLocaleString('en-IN') + '+'
        : '3,500+',
      icon: '📜',
    },
    { label: t('stats.courses'), value: '350+', icon: '📚' },
  ];

  return (
    <section
      className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex flex-col justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Background layers */}
      <div className="absolute inset-0 z-0 bg-hero-gradient" />
      {/* dot pattern overlay */}
      <div className="absolute inset-0 z-0 bg-dot-pattern bg-dot-md opacity-20" />
      {/* radial glow */}
      <div className="absolute inset-0 z-0 hero-pattern" />
      {/* bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 z-10"
           style={{ background: 'linear-gradient(to top, rgba(15,31,78,0.8), transparent)' }} />

      {/* Decorative circles */}
      <div className="absolute right-10 top-16 w-64 h-64 rounded-full border border-white/8 hidden lg:block z-0" />
      <div className="absolute right-24 top-32 w-40 h-40 rounded-full border border-white/6 hidden lg:block z-0" />
      <div className="absolute left-[-60px] bottom-20 w-72 h-72 rounded-full border border-white/5 hidden lg:block z-0" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: text + CTAs */}
          <div className="animate-slide-up">
            {/* Eyebrow */}
            <div className="eyebrow-white mb-6 inline-flex">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse-slow flex-shrink-0" />
              {t('hero.eyebrow')}
            </div>

            {/* Heading */}
            <h1 id="hero-heading"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-heading font-extrabold
                           text-white leading-tight text-balance">
              {t('hero.title1')}
              <span className="block gradient-text-gold mt-1">{t('hero.title2')}</span>
            </h1>

            {/* Tagline */}
            <p className="mt-3 text-lg sm:text-xl text-gold-300 font-semibold italic">
              "{t('hero.tagline')}"
            </p>

            {/* Description */}
            <p className="mt-4 text-base text-blue-100 leading-relaxed max-w-xl">
              {t('hero.desc')}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/verify" className="btn-white shadow-hero text-sm sm:text-base">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0
                       3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946
                       3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138
                       3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806
                       3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438
                       3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
                {t('hero.ctaVerify')}
              </Link>
              <Link to="/register-institute" className="btn-gold text-sm sm:text-base">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                {t('hero.ctaRegister')}
              </Link>
              <Link to="/courses"
                className="inline-flex items-center gap-2 px-5 py-3 border-2 border-white/30
                           hover:border-white text-white font-semibold rounded-xl
                           transition-all duration-200 text-sm sm:text-base hover:bg-white/10">
                {t('hero.ctaCourses')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </Link>
            </div>

            {/* Trust logos strip */}
            <div className="mt-10 flex items-center gap-5 flex-wrap">
              <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                Recognised by
              </span>
              {TRUST_ITEMS.map(({ src, alt }) => (
                <div key={alt}
                  className="h-7 w-14 flex items-center justify-center bg-white/20 rounded-lg px-1.5
                             opacity-80 hover:opacity-100 transition-opacity">
                  <img src={src} alt={alt}
                    className="h-5 w-auto object-contain max-w-[48px]"
                    onError={e => { e.target.parentElement.style.display = 'none'; }}
                  />
                </div>
              ))}
              <div className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
                <span className="text-sm">🏛️</span>
                <span className="text-xs text-blue-300 font-medium">MSME Udyam</span>
              </div>
            </div>
          </div>

          {/* Right: stat cards + visual */}
          <div className="hidden lg:flex flex-col gap-4 animate-fade-in">
            {/* Large logo display */}
            <div className="relative">
              <div className="absolute inset-0 bg-gold-500/20 rounded-3xl blur-3xl" />
              <div className="relative glass rounded-3xl p-8 text-center border border-white/20">
                <img src="/logos/AICIT logo.jpeg" alt="AICIT"
                  className="h-24 w-24 mx-auto rounded-2xl object-contain bg-white p-2 shadow-xl mb-5"
                  onError={e => {
                    e.target.replaceWith(Object.assign(document.createElement('div'), {
                      className: 'h-24 w-24 mx-auto rounded-2xl bg-white flex items-center justify-center mb-5',
                      innerHTML: '<span style="font-size:2rem;font-weight:900;color:#1e3a8a">AICIT</span>'
                    }));
                  }}
                />
                <h2 className="text-white font-heading font-bold text-xl mb-1">All India Council for</h2>
                <h2 className="text-gold-400 font-heading font-bold text-xl">Information Technology</h2>
                <p className="text-blue-300 text-sm mt-3 leading-relaxed">
                  An ISO 9001:2015 Certified Organisation<br/>
                  MSME Registered · Society Registered
                </p>
                {/* Verification badge */}
                <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full
                                bg-trust-600/20 border border-trust-500/30">
                  <span className="w-2 h-2 rounded-full bg-trust-500 animate-pulse-slow" />
                  <span className="text-trust-100 text-xs font-semibold">Verified & Trusted</span>
                </div>
              </div>
            </div>

            {/* Quick verify widget */}
            <QuickVerifyCard t={t} />
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {displayStats.map((s) => (
            <StatCard key={s.label} {...s} loading={statsLoading && !liveStats} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Inline quick verify ───────────────────────────────────────
function QuickVerifyCard({ t }) {
  const [input, setInput] = useState('');
  const navigate = Link; // use navigate via Link redirect trick
  return (
    <div className="glass rounded-2xl p-5 border border-white/15">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-.47 3.852 3.745 3.745 0 01-3.852.47A3.745 3.745 0 0112 21 3.745 3.745 0 019.768 19.8a3.745 3.745 0 01-3.852-.47 3.745 3.745 0 01-.47-3.852A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01.47-3.852 3.745 3.745 0 013.852-.47A3.745 3.745 0 0112 3 3.745 3.745 0 0114.232 4.2a3.745 3.745 0 013.852.47 3.745 3.745 0 01.47 3.852A3.745 3.745 0 0121 12z"/>
        </svg>
        <span className="text-white font-semibold text-sm">{t('verify.heading')}</span>
      </div>
      <Link to="/verify">
        <div className="flex gap-2">
          <div className="flex-1 px-3 py-2.5 bg-white/10 border border-white/20 rounded-xl
                          text-blue-300 text-xs font-mono placeholder:text-blue-500">
            AICIT-2026-XXXXXX
          </div>
          <span className="px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-white text-xs
                           font-bold rounded-xl transition-colors cursor-pointer flex items-center">
            {t('verify.btnVerify')}
          </span>
        </div>
      </Link>
    </div>
  );
}
