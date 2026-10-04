import React from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../../config/siteConfig.js';
import { useLang } from '../../i18n/LanguageContext.jsx';

const QUICK_LINKS = [
  { labelKey: 'nav.home',    to: '/' },
  { labelKey: 'nav.about',   to: '/about' },
  { labelKey: 'nav.courses', to: '/courses' },
  { labelKey: 'nav.verify',  to: '/verify' },
  { labelKey: 'nav.gallery', to: '/gallery' },
  { labelKey: 'nav.contact', to: '/contact' },
];

const PORTAL_LINKS = [
  { label: 'Institute Login',     to: '/institute/login' },
  { label: 'Register Institute',  to: '/register-institute' },
  { label: 'Admin Login',         to: '/admin/login' },
  { label: 'Student Information', to: '/student-information' },
];

const LEGAL_LINKS = [
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Privacy Policy',     to: '/privacy' },
  { label: 'Certificate Policy', to: '/certificate-policy' },
];

// Trust badge logos
const TRUST_BADGES = [
  { src: '/logos/EGAC.jpeg',                               alt: 'EGAC',                 label: 'EGAC Accredited' },
  { src: '/logos/certificado-iso-9001-logo-png_seeklogo-255202.png', alt: 'ISO 9001', label: 'ISO 9001:2015' },
  { src: '/logos/national-career-service-ncs-national-career-service-.jpg', alt: 'NCS', label: 'Nat. Career Service' },
];

function FooterLinkItem({ to, label }) {
  return (
    <li>
      <Link to={to}
        className="flex items-center gap-2 text-sm text-blue-300 hover:text-white transition-colors group">
        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0 group-hover:bg-gold-400 transition-colors" />
        {label}
      </Link>
    </li>
  );
}

function FooterHeading({ children }) {
  return (
    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
      <span className="w-4 h-0.5 bg-gold-500 rounded-full" />
      {children}
    </h3>
  );
}

function ContactItem({ icon, children }) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-blue-300">
      <span className="text-gold-500 mt-0.5 flex-shrink-0">{icon}</span>
      {children}
    </div>
  );
}

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-white" role="contentinfo">

      {/* Trust strip */}
      <div className="border-t border-b border-primary-800/50 bg-primary-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider flex-shrink-0">
              Recognised &amp; Accredited by
            </span>
            {TRUST_BADGES.map(({ src, alt, label }) => (
              <div key={alt} className="flex items-center gap-2.5 opacity-90 hover:opacity-100 transition-opacity">
                <div className="h-8 w-16 flex items-center justify-center bg-white/15 rounded-lg px-2 py-1">
                  <img
                    src={src} alt={alt}
                    className="h-6 w-auto object-contain max-w-[56px]"
                    onError={e => { e.target.parentElement.style.display = 'none'; }}
                  />
                </div>
                <span className="text-xs text-blue-300 font-medium hidden sm:inline">{label}</span>
              </div>
            ))}
            {/* Udyam */}
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <span className="text-base">🏛️</span>
              <div className="leading-tight">
                <div className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">MSME</div>
                <div className="text-xs text-blue-300 font-medium">Udyam Registered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <img src="/logos/AICIT logo.jpeg" alt="AICIT"
                className="h-12 w-12 rounded-xl object-contain bg-white p-1 shadow-card"
                onError={e => { e.target.style.display='none'; }}
              />
              <div>
                <div className="text-white font-heading font-extrabold text-xl tracking-wider">AICIT</div>
                <div className="text-blue-300 text-[9px] font-medium tracking-tight uppercase">
                  All India Council for IT
                </div>
              </div>
            </div>
            <p className="text-sm text-blue-300 leading-relaxed mb-5">
              {t('footer.tagline')}
            </p>
            <div className="space-y-2.5">
              <ContactItem icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                </svg>
              }>
                <span>{SITE.address.line1}, {SITE.address.line2},<br/>{SITE.address.state} – {SITE.address.pin}</span>
              </ContactItem>
              <ContactItem icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
                </svg>
              }>
                <a href={`tel:${SITE.phone}`} className="hover:text-white transition-colors">{SITE.phone}</a>
              </ContactItem>
              <ContactItem icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                </svg>
              }>
                <a href={`mailto:${SITE.email}`} className="hover:text-white transition-colors">{SITE.email}</a>
              </ContactItem>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <FooterHeading>{t('footer.quickLinks')}</FooterHeading>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ labelKey, to }) => (
                <FooterLinkItem key={to} to={to} label={t(labelKey)} />
              ))}
            </ul>
          </div>

          {/* Portal + Legal */}
          <div>
            <FooterHeading>{t('footer.portal')}</FooterHeading>
            <ul className="space-y-2.5 mb-7">
              {PORTAL_LINKS.map(({ label, to }) => (
                <FooterLinkItem key={to} to={to} label={label} />
              ))}
            </ul>
            <FooterHeading>{t('footer.legal')}</FooterHeading>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map(({ label, to }) => (
                <FooterLinkItem key={to} to={to} label={label} />
              ))}
            </ul>
          </div>

          {/* Verify CTA */}
          <div>
            <FooterHeading>{t('footer.verifyCert')}</FooterHeading>
            <p className="text-sm text-blue-300 mb-5 leading-relaxed">
              Instantly verify the authenticity of any AICIT-issued certificate online.
            </p>
            <Link to="/verify"
              className="inline-flex items-center gap-2.5 px-5 py-3 bg-gold-500
                         hover:bg-gold-600 text-white text-sm font-semibold rounded-xl
                         transition-all duration-200 shadow-md hover:shadow-glow w-full justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-.47 3.852 3.745 3.745 0 01-3.852.47A3.745 3.745 0 0112 21 3.745 3.745 0 019.768 19.8a3.745 3.745 0 01-3.852-.47 3.745 3.745 0 01-.47-3.852A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01.47-3.852 3.745 3.745 0 013.852-.47A3.745 3.745 0 0112 3 3.745 3.745 0 0114.232 4.2a3.745 3.745 0 013.852.47 3.745 3.745 0 01.47 3.852A3.745 3.745 0 0121 12z"/>
              </svg>
              Verify Certificate
            </Link>

            {/* Registration numbers */}
            <div className="mt-6 p-4 rounded-xl border border-primary-800/60 bg-primary-900/40 space-y-2">
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Official Registrations</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-400">Udyam</span>
                  <span className="text-blue-200 font-mono font-medium">UDYAM-MH-20-0221747</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-400">Society</span>
                  <span className="text-blue-200 font-mono font-medium">NGP/44214/1860/18</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4
                        flex flex-col sm:flex-row items-center justify-between gap-2
                        text-xs text-blue-400">
          <p>© {year} AICIT – All India Council for Information Technology. {t('footer.allRights')}.</p>
          <p>Designed &amp; developed with ❤️ by <span className="font-semibold text-blue-200">AICIT Tech Team</span></p>
        </div>
      </div>
    </footer>
  );
}
