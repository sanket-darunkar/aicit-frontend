import React, { useState, useEffect } from 'react';

// ── Recognition slides — MCA first (hero) ─────────────────────
const RECOGNITIONS = [
  {
    flag:     '🇮🇳',
    eyebrow:  'Government of India',
    title:    'Ministry of Corporate Affairs',
    subtitle: 'Officially Registered Organisation',
    accent:   'from-[#FF9933] via-white to-[#138808]',   // tricolor
    primary:  true,
  },
  {
    flag:     '🏛️',
    eyebrow:  'Ministry of MSME',
    title:    'Udyam Registered Enterprise',
    subtitle: 'UDYAM-MH-20-0221747 · Government of India',
    accent:   'from-primary-500 via-primary-300 to-primary-500',
  },
  {
    flag:     '📋',
    eyebrow:  'Societies Registration Act, 1860',
    title:    'Registered Society',
    subtitle: 'Government of Maharashtra · Nagpur Region',
    accent:   'from-gold-500 via-gold-300 to-gold-500',
  },
  {
    flag:     '📄',
    eyebrow:  'ISO 9001:2015 Certified',
    title:    'Quality Management System',
    subtitle: 'Valid until 18 July 2027',
    accent:   'from-trust-500 via-trust-300 to-trust-500',
  },
];

export default function TrustBanner() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance every 4s
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % RECOGNITIONS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused]);

  const current = RECOGNITIONS[active];

  return (
    <section
      className="relative overflow-hidden bg-primary-950"
      aria-label="Government recognitions and certifications"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dot-pattern bg-dot-md opacity-10" />
      <div className="absolute inset-0 hero-pattern opacity-60" />

      {/* Top tricolor strip */}
      <div className="flex h-1">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      <div className="relative z-10 container-xl py-10 sm:py-12">
        {/* Eyebrow label */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                           bg-white/10 border border-white/20 text-white/90
                           text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse-slow" />
            Recognised &amp; Registered
          </span>
        </div>

        {/* Rotating slide */}
        <div className="relative min-h-[150px] sm:min-h-[160px] flex items-center justify-center">
          {RECOGNITIONS.map((item, i) => (
            <div
              key={item.title}
              className={`absolute inset-0 flex flex-col items-center justify-center text-center
                          transition-all duration-700 ease-out
                          ${i === active
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}
              aria-hidden={i !== active}
            >
              {/* Flag + glow */}
              <div className="relative mb-3">
                <div className={`absolute inset-0 blur-2xl opacity-40 rounded-full
                                 ${item.primary ? 'bg-gold-400' : 'bg-primary-400'}`} />
                <div className="relative w-16 h-16 rounded-2xl glass flex items-center justify-center text-4xl shadow-hero">
                  {item.flag}
                </div>
              </div>

              {/* Eyebrow */}
              <p className={`text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-1.5
                             ${item.primary ? 'text-gold-400' : 'text-blue-300'}`}>
                {item.eyebrow}
              </p>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white
                             leading-tight text-balance px-4">
                {item.title}
              </h3>

              {/* Subtitle */}
              <p className="text-sm text-blue-200 mt-2">{item.subtitle}</p>

              {/* Accent underline */}
              <div className={`mt-4 h-1 w-32 rounded-full bg-gradient-to-r ${item.accent}`} />
            </div>
          ))}
        </div>

        {/* Dots / indicators */}
        <div className="flex items-center justify-center gap-2.5 mt-6">
          {RECOGNITIONS.map((item, i) => (
            <button
              key={item.title}
              onClick={() => setActive(i)}
              aria-label={`Show ${item.title}`}
              className={`transition-all duration-300 rounded-full
                ${i === active
                  ? 'w-8 h-2 bg-gold-400'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>

        {/* Static mini-strip of all recognitions (always visible) */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {RECOGNITIONS.map((item) => (
            <div key={item.title}
              className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
              <span className="text-base">{item.flag}</span>
              <span className="text-xs font-semibold text-blue-200">{item.eyebrow}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
