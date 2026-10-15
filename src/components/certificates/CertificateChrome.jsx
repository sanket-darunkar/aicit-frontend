import React from 'react';
import { CERT_ASSETS, RIBBON_TAGLINE, CERT_COLORS } from './certificateUtils.js';

/* Shared visual "chrome" for both AICIT certificate formats so they read as
 * one official family: the layered gold border, decorative corners, the navy
 * left ribbon with the laurel/ISO badge + tagline, and small building blocks
 * (gold rule, section). Pure presentation — no data, nothing fabricated. */

const { NAVY, NAVY_2, GOLD, GOLD_LT } = CERT_COLORS;

/** Layered gold + navy page border that frames the whole sheet. */
export function GoldFrame() {
  return (
    <>
      {/* Corner sweep arcs (top-right & bottom-left) echoing the references. */}
      <svg width="100%" height="100%" viewBox="0 0 210 297" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0 }} aria-hidden="true">
        <defs>
          <linearGradient id="goldSweep" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={GOLD_LT} />
            <stop offset="0.5" stopColor={GOLD} />
            <stop offset="1" stopColor="#9c7b2e" />
          </linearGradient>
        </defs>
        {/* top-right navy + gold sweep */}
        <path d="M135 0 Q195 6 210 70 L210 0 Z" fill={NAVY} opacity="0.9" />
        <path d="M150 0 Q200 10 210 80" fill="none" stroke="url(#goldSweep)" strokeWidth="2.2" />
        <path d="M165 0 Q202 12 210 95" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.7" />
        {/* bottom-left navy + gold sweep */}
        <path d="M0 297 Q6 235 70 227 L0 227 Z" fill={NAVY} opacity="0.9" />
        <path d="M0 285 Q12 240 90 231" fill="none" stroke="url(#goldSweep)" strokeWidth="2.2" />
        <path d="M0 270 Q14 245 95 236" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.7" />
        {/* bottom-right small sweep */}
        <path d="M210 297 L210 250 Q195 285 160 297 Z" fill={NAVY} opacity="0.85" />
        <path d="M210 262 Q198 288 168 297" fill="none" stroke="url(#goldSweep)" strokeWidth="2" />
      </svg>

      {/* Triple frame line */}
      <div style={{ position: 'absolute', inset: '4mm', border: `2.5px solid ${GOLD}` }} />
      <div style={{ position: 'absolute', inset: '5.4mm', border: `0.8px solid ${NAVY}`, opacity: 0.55 }} />
      <div style={{ position: 'absolute', inset: '6.6mm', border: `0.6px solid ${GOLD}`, opacity: 0.6 }} />

      {/* Diamond corner accents */}
      {[
        { top: '3mm', left: '3mm' },
        { top: '3mm', right: '3mm' },
        { bottom: '3mm', left: '3mm' },
        { bottom: '3mm', right: '3mm' },
      ].map((pos, i) => (
        <div key={i} style={{ position: 'absolute', ...pos }}>
          <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
            <rect x="12" y="12" width="10" height="10" transform="rotate(45 17 17)" fill="none" stroke={GOLD} strokeWidth="1.4" />
            <rect x="14.5" y="14.5" width="5" height="5" transform="rotate(45 17 17)" fill={GOLD} />
          </svg>
        </div>
      ))}
    </>
  );
}

/** Laurel wreath enclosing the ISO-9001 badge, as on both references. */
export function IsoLaurelBadge({ size = 92 }) {
  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-label="ISO 9001:2015 certified organisation">
        {/* laurel branches */}
        {[-1, 1].map((dir) => (
          <g key={dir} transform={`translate(50 50) scale(${dir} 1)`}>
            {Array.from({ length: 7 }).map((_, i) => {
              const a = -70 + i * 20;
              return (
                <ellipse key={i} cx="-34" cy="0" rx="6.5" ry="3"
                  transform={`rotate(${a} -34 0) translate(0 ${-i * 1.2})`}
                  fill="none" stroke={GOLD} strokeWidth="2" />
              );
            })}
          </g>
        ))}
        <circle cx="50" cy="50" r="24" fill="none" stroke={GOLD} strokeWidth="2.5" />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: GOLD,
      }}>
        <span className="aicit-cert-heading" style={{ fontSize: size * 0.12, fontWeight: 800, lineHeight: 1 }}>ISO 9001</span>
        <span className="aicit-cert-heading" style={{ fontSize: size * 0.11, fontWeight: 800, lineHeight: 1.1 }}>2015</span>
        <span style={{ fontSize: size * 0.085, fontWeight: 700, letterSpacing: '0.5px' }}>CERTIFIED</span>
        <span style={{ fontSize: size * 0.07, fontWeight: 600, letterSpacing: '0.5px', opacity: 0.9 }}>ORGANISATION</span>
      </div>
    </div>
  );
}

/**
 * The navy left ribbon carrying the laurel/ISO badge and the vertical brand
 * tagline, matching both references.
 */
export function LeftRibbon({ height = '220mm', top = '14mm' }) {
  return (
    <div style={{ position: 'absolute', left: '9mm', top, width: '26mm', height, zIndex: 3 }}>
      {/* Ribbon body */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: '10mm',
        background: `linear-gradient(160deg, ${NAVY_2} 0%, ${NAVY} 60%)`,
        border: `1.5px solid ${GOLD}`,
        boxShadow: '0 2px 10px rgba(11,27,64,0.35)',
      }} />
      {/* Forked ribbon tail */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '12mm',
        background: `linear-gradient(160deg, ${NAVY_2}, ${NAVY})`,
        border: `1.5px solid ${GOLD}`, borderTop: 'none',
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 70%, 0 100%)',
      }} />

      {/* Badge near the top */}
      <div style={{ position: 'relative', paddingTop: '5mm', display: 'flex', justifyContent: 'center' }}>
        <IsoLaurelBadge size={78} />
      </div>

      {/* small gold diamond divider */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 4px' }}>
        <svg width="14" height="10" viewBox="0 0 14 10"><rect x="4" y="1" width="6" height="6" transform="rotate(45 7 4)" fill={GOLD} /></svg>
      </div>

      {/* Vertical tagline */}
      <div style={{ textAlign: 'center', color: GOLD_LT, padding: '2mm 1mm' }}>
        {RIBBON_TAGLINE.map((line) => (
          <div key={line} className="aicit-cert-heading"
            style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.5px', lineHeight: 1.5 }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Centered AICIT masthead (logo + optional ISO badges flanking). */
export function Masthead({ flankingIso = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      {flankingIso && (
        <img src={CERT_ASSETS.iso} alt="ISO 9001 certified" style={{ height: 54, width: 'auto', objectFit: 'contain' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      )}
      <img src={CERT_ASSETS.logo} alt="AICIT — All India Council for Information Technology"
        style={{ height: 62, width: 'auto', objectFit: 'contain', maxWidth: '110mm' }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      {flankingIso && (
        <img src={CERT_ASSETS.iso} alt="ISO 9001 certified" style={{ height: 54, width: 'auto', objectFit: 'contain', visibility: 'hidden' }} />
      )}
    </div>
  );
}

/** Thin gold rule with a center diamond, used as a section separator. */
export function GoldDivider({ width = '70%', margin = '8px auto' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width, margin }}>
      <div className="aicit-gold-rule" style={{ flex: 1, height: 1.5 }} />
      <svg width="18" height="12" viewBox="0 0 18 12" style={{ margin: '0 6px' }}>
        <rect x="5" y="2" width="7" height="7" transform="rotate(45 8.5 5.5)" fill={GOLD} />
      </svg>
      <div className="aicit-gold-rule" style={{ flex: 1, height: 1.5 }} />
    </div>
  );
}

/** Photo in a gold frame; falls back to a clean placeholder. */
export function PhotoFrame({ photoUrl, name, label = 'PASSPORT SIZE PHOTO', width = '30mm', height = '38mm' }) {
  return (
    <div style={{
      width, border: `2px solid ${GOLD}`, padding: 3, background: '#fff',
      boxShadow: '0 2px 10px rgba(11,27,64,0.18)',
    }}>
      <div style={{ width: '100%', height, background: '#eef1f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {photoUrl
          ? <img src={photoUrl} alt={name ? `${name} photograph` : 'Student photograph'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span style={{ fontSize: 7.5, color: '#94a3b8', letterSpacing: '0.5px', textAlign: 'center', padding: 4, fontWeight: 600 }}>{label}</span>}
      </div>
    </div>
  );
}


