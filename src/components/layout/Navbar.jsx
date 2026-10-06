import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { SITE, ANNOUNCEMENTS } from '../../config/siteConfig.js';
import { useLang } from '../../i18n/LanguageContext.jsx';

// ── Language Switcher ─────────────────────────────────────────
function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const options = [
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'mr', label: 'मर', full: 'मराठी' },
    { code: 'hi', label: 'हि', full: 'हिन्दी' },
  ];
  return (
    <div className="flex items-center gap-0.5 bg-white/10 rounded-lg p-0.5">
      {options.map(({ code, label, full }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          title={full}
          aria-label={`Switch to ${full}`}
          className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all duration-150
            ${lang === code
              ? 'bg-white text-primary-900 shadow-xs'
              : 'text-white/80 hover:text-white hover:bg-white/10'}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Government Recognition Top Bar ────────────────────────────
function GovtRecognitionBar() {
  return (
    <div className="bg-[#0b1838]">
      {/* Top tricolor hairline */}
      <div className="flex h-[3px]">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 py-2 text-center">
          <span className="text-base leading-none">🇮🇳</span>
          <span className="text-xs sm:text-sm font-semibold text-white tracking-wide">
            Recognised by the
            <span className="text-gold-400 font-bold"> Government of India</span>
            <span className="hidden sm:inline"> — Ministry of Corporate Affairs</span>
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Announcement Ticker ───────────────────────────────────────
function AnnouncementTicker() {
  // Join items with a gold bullet separator
  const items = ANNOUNCEMENTS;
  const Row = () => (
    <span className="ticker-content text-xs font-medium tracking-wide text-white px-4">
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center">
          <span className="text-gold-400 mx-4">●</span>
          {item}
        </span>
      ))}
    </span>
  );
  return (
    <div className="bg-primary-950 text-white py-2 overflow-hidden border-b border-primary-800/50">
      <div className="ticker-wrap" aria-label="Announcements">
        {/* Two identical rows for a seamless, gapless loop */}
        <Row />
        <Row />
      </div>
    </div>
  );
}

// ── Logo ──────────────────────────────────────────────────────
function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 flex-shrink-0 group" aria-label="AICIT Home">
      <img
        src="/logos/AICIT logo.jpeg"
        alt="AICIT Logo"
        className="h-10 w-10 rounded-lg object-contain bg-white p-0.5 shadow-xs
                   group-hover:shadow-card transition-shadow"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <div className="flex flex-col leading-none">
        <span className="text-white font-heading font-extrabold text-lg tracking-wider">
          AICIT
        </span>
        <span className="text-blue-200 text-[9px] font-medium tracking-tight uppercase mt-0.5">
          All India Council for IT
        </span>
      </div>
    </Link>
  );
}

// ── Desktop Nav Link ──────────────────────────────────────────
function DesktopNavLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative text-sm font-medium px-2 py-1.5 rounded-lg transition-all duration-150
         after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full
         after:transition-all after:duration-200
         ${isActive
           ? 'text-white after:bg-gold-400'
           : 'text-blue-100 hover:text-white hover:bg-white/8 after:bg-transparent hover:after:bg-white/30'}`
      }
    >
      {label}
    </NavLink>
  );
}

// ── Login Dropdown ────────────────────────────────────────────
function LoginDropdown({ t }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-1.5 text-sm font-semibold text-white/90 hover:text-white
                   px-3.5 py-2 border border-white/25 rounded-xl hover:border-white/50
                   hover:bg-white/8 transition-all duration-150"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
        </svg>
        {t('nav.login')}
        <svg className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card-hover
                        border border-gray-100 py-1.5 z-50 animate-fade-in">
          {/* Institute Login */}
          <Link to="/institute/login" onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors group">
            <span className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0
                             group-hover:bg-primary-200 transition-colors">
              <svg className="w-4 h-4 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M9 21V9l6-6 6 6v12M9 21h6M12 9v4"/>
              </svg>
            </span>
            <div>
              <div className="text-sm font-semibold text-gray-900">{t('nav.instituteLogin')}</div>
              <div className="text-xs text-gray-500">{t('nav.forRegistered')}</div>
            </div>
          </Link>
          <div className="mx-4 my-1 h-px bg-gray-100" />
          {/* Admin Login */}
          <Link to="/admin/login" onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition-colors group">
            <span className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0
                             group-hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </span>
            <div>
              <div className="text-sm font-semibold text-gray-900">{t('nav.adminLogin')}</div>
              <div className="text-xs text-gray-500">{t('nav.mcaStaffOnly')}</div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

// ── Mobile Menu ───────────────────────────────────────────────
function MobileMenu({ isOpen, onClose, navLinks, t }) {
  if (!isOpen) return null;
  return (
    <div className="md:hidden bg-primary-950 border-t border-primary-800/50 shadow-2xl">
      <nav className="flex flex-col py-2" aria-label="Mobile navigation">
        {navLinks.map(({ to, labelKey }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) =>
              `px-5 py-3.5 text-sm font-medium transition-colors border-l-2 ${
                isActive
                  ? 'text-gold-400 bg-primary-900 border-gold-400'
                  : 'text-blue-100 hover:text-white hover:bg-primary-900 border-transparent'
              }`}>
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 pt-3 pb-5 border-t border-primary-800/50 mt-1 space-y-2.5">
        <Link to="/institute/login" onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-3 border border-white/30
                     text-white text-sm font-semibold rounded-xl hover:bg-white/10 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M9 21V9l6-6 6 6v12M9 21h6M12 9v4"/>
          </svg>
          {t('nav.instituteLogin')}
        </Link>
        <Link to="/register-institute" onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-3 bg-gold-500
                     hover:bg-gold-600 text-white text-sm font-semibold rounded-xl transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          {t('nav.registerInstitute')}
        </Link>
      </div>
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────
export default function Navbar() {
  const { t } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled,  setScrolled]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navLinks = [
    { to: '/',                     labelKey: 'nav.home' },
    { to: '/about',                labelKey: 'nav.about' },
    { to: '/student-information',  labelKey: 'nav.studentInfo' },
    { to: '/verify',               labelKey: 'nav.verify' },
    { to: '/courses',              labelKey: 'nav.courses' },
    { to: '/gallery',              labelKey: 'nav.gallery' },
    { to: '/contact',              labelKey: 'nav.contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Government recognition line */}
      <GovtRecognitionBar />

      {/* Ticker */}
      <AnnouncementTicker />

      {/* Main bar */}
      <div className={`bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900
                       transition-all duration-200
                       ${scrolled ? 'shadow-xl shadow-primary-950/40' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Logo />

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center"
                 aria-label="Main navigation">
              {navLinks.map(({ to, labelKey }) => (
                <DesktopNavLink key={to} to={to} label={t(labelKey)} />
              ))}
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <LanguageSwitcher />
              <LoginDropdown t={t} />
              <Link to="/register-institute"
                className="btn-gold text-sm px-4 py-2 rounded-xl shadow-none">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                {t('nav.registerInstitute')}
              </Link>
            </div>

            {/* Mobile: lang + hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <LanguageSwitcher />
              <button
                type="button"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(v => !v)}
                className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {menuOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} navLinks={navLinks} t={t} />
    </header>
  );
}
