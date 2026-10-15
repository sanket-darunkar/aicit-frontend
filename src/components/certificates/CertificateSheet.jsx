import React from 'react';
import { SITE } from '../../config/siteConfig.js';
import { CERT_ASSETS, clean, formatDate, parseMarks } from './certificateUtils.js';

/**
 * Decorative gold corner flourish (SVG) — restrained, symmetric, print-safe.
 * Rotated per corner by the caller.
 */
function Corner({ className = '', rotate = 0 }) {
  return (
    <svg
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
      width="90" height="90" viewBox="0 0 90 90" fill="none"
      aria-hidden="true"
    >
      <path d="M4 86V26C4 13.85 13.85 4 26 4h60" stroke="#c9a24a" strokeWidth="2.5" fill="none" />
      <path d="M12 86V30C12 20.06 20.06 12 30 12h56" stroke="#1e3a8a" strokeWidth="1.2" fill="none" opacity="0.6" />
      <circle cx="22" cy="22" r="4.5" fill="#c9a24a" />
    </svg>
  );
}

function SealBadge() {
  return (
    <div className="aicit-cert-seal" aria-label="Official AICIT seal" style={{ width: 96, height: 96, position: 'relative' }}>
      <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
        <circle cx="48" cy="48" r="46" fill="none" stroke="#c9a24a" strokeWidth="2" />
        <circle cx="48" cy="48" r="38" fill="none" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="2 2.5" />
        <circle cx="48" cy="48" r="30" fill="#0f1f4e" />
        <defs>
          <path id="sealArcTop" d="M48 10 a38 38 0 0 1 0 76" />
        </defs>
        <text fill="#1e3a8a" fontSize="7.5" fontWeight="700" letterSpacing="1.5" fontFamily="Poppins, sans-serif">
          <textPath href="#sealArcTop" startOffset="4%">ALL INDIA COUNCIL FOR INFORMATION TECHNOLOGY</textPath>
        </text>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center',
      }}>
        <span className="aicit-cert-heading" style={{ fontSize: 15, fontWeight: 800, lineHeight: 1, letterSpacing: '1px' }}>AICIT</span>
        <span style={{ fontSize: 6.5, letterSpacing: '1px', marginTop: 2, color: '#c9a24a', fontWeight: 700 }}>OFFICIAL SEAL</span>
      </div>
    </div>
  );
}

/** A single detail "chip" for course / grade / marks etc. Hidden when empty. */
function DetailChip({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ textAlign: 'center', minWidth: 0 }}>
      <div style={{
        fontSize: 8.5, letterSpacing: '2px', textTransform: 'uppercase',
        color: '#8a7a4a', fontWeight: 700, marginBottom: 3,
      }}>{label}</div>
      <div className="aicit-cert-heading" style={{
        fontSize: 14, fontWeight: 700, color: '#0f1f4e', lineHeight: 1.15,
      }}>{value}</div>
    </div>
  );
}

function SignatureBlock({ img, name, title }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 150 }}>
      <div style={{ height: 42, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {img && (
          <img src={img} alt="" style={{ maxHeight: 40, maxWidth: 150, objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        )}
      </div>
      <div style={{ borderTop: '1.5px solid #0f1f4e', margin: '0 10px', paddingTop: 5 }}>
        <div className="aicit-cert-heading" style={{ fontSize: 11, fontWeight: 700, color: '#0f1f4e' }}>
          {name}
        </div>
        <div style={{ fontSize: 8.5, letterSpacing: '1px', textTransform: 'uppercase', color: '#8a7a4a', fontWeight: 600, marginTop: 1 }}>
          {title}
        </div>
      </div>
    </div>
  );
}

/**
 * Premium "Certificate of Achievement" (normal) certificate — A4 landscape.
 * Every data value is pulled from the real certificate object; optional
 * fields that are absent are simply not rendered. No fabricated data.
 *
 * props.cert fields used (all optional except handled gracefully):
 *   certificateNumber, studentName, courseName, instituteName,
 *   marks, grade, issueDate
 * props.photoUrl    – object URL of the student photo (or null → placeholder)
 * props.qrDataUrl   – data URL of the real /verify QR (or null → hidden)
 */
export default function CertificateSheet({ cert = {}, photoUrl = null, qrDataUrl = null }) {
  const studentName = clean(cert.studentName) || '—';
  const courseName  = clean(cert.courseName);
  const institute   = clean(cert.instituteName);
  const certNumber  = clean(cert.certificateNumber);
  const grade       = clean(cert.grade);
  const issueDate   = formatDate(cert.issueDate);
  const marks       = parseMarks(cert.marks);
  const marksLabel  = marks.obtained && marks.total
    ? `${marks.obtained} / ${marks.total}`
    : marks.raw;

  return (
    <div className="aicit-cert-sheet">
      {/* Outer navy frame */}
      <div style={{ position: 'absolute', inset: '6mm', border: '2.5px solid #0f1f4e' }} />
      {/* Inner gold frame with guilloche pattern band */}
      <div className="aicit-cert-guilloche"
        style={{ position: 'absolute', inset: '9mm', border: '1px solid #c9a24a' }} />
      <div style={{ position: 'absolute', inset: '11mm', border: '0.75px solid rgba(15,31,78,0.25)' }} />

      {/* Gold corners */}
      <div style={{ position: 'absolute', top: '10mm', left: '10mm' }}><Corner rotate={0} /></div>
      <div style={{ position: 'absolute', top: '10mm', right: '10mm' }}><Corner rotate={90} /></div>
      <div style={{ position: 'absolute', bottom: '10mm', right: '10mm' }}><Corner rotate={180} /></div>
      <div style={{ position: 'absolute', bottom: '10mm', left: '10mm' }}><Corner rotate={270} /></div>

      {/* Watermark seal */}
      <img src={CERT_ASSETS.logo} alt="" aria-hidden="true" className="aicit-cert-watermark"
        style={{ position: 'absolute', top: '50%', left: '50%', width: '95mm', transform: 'translate(-50%,-50%)' }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }} />

      {/* Content */}
      <div style={{ position: 'absolute', inset: '15mm', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src={CERT_ASSETS.logo} alt="AICIT logo" style={{ height: 58, width: 'auto', objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <div style={{ flex: 1 }}>
            <div className="aicit-cert-heading" style={{ fontSize: 22, fontWeight: 800, color: '#0f1f4e', lineHeight: 1 }}>
              {SITE.name}
            </div>
            <div style={{ fontSize: 10.5, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#8a7a4a', fontWeight: 600, marginTop: 3 }}>
              {SITE.fullName}
            </div>
          </div>
          {certNumber && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 8, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8a7a4a', fontWeight: 700 }}>Certificate No.</div>
              <div className="aicit-cert-heading" style={{ fontSize: 12, fontWeight: 700, color: '#0f1f4e', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.5px' }}>
                {certNumber}
              </div>
            </div>
          )}
        </header>

        {/* Gold divider */}
        <div style={{ height: 2.5, background: 'linear-gradient(90deg, transparent, #c9a24a 20%, #c9a24a 80%, transparent)', margin: '10px 0 0' }} />

        {/* Title */}
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: '6px', textTransform: 'uppercase', color: '#8a7a4a', fontWeight: 600 }}>
            Certificate of
          </div>
          <div className="aicit-cert-heading" style={{ fontSize: 42, fontWeight: 800, color: '#0f1f4e', lineHeight: 1, marginTop: 2 }}>
            Achievement
          </div>
        </div>

        {/* Body: photo + presentation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 16, flex: 1 }}>
          {/* Photo frame */}
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <div style={{
              width: '32mm', height: '40mm', border: '2px solid #c9a24a',
              padding: 3, background: '#fff', boxShadow: '0 2px 10px rgba(15,31,78,0.12)',
            }}>
              <div style={{
                width: '100%', height: '100%', background: '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
              }}>
                {photoUrl ? (
                  <img src={photoUrl} alt={`${studentName} photograph`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 8.5, color: '#94a3b8', letterSpacing: '1px', textAlign: 'center', padding: 6 }}>
                    PHOTOGRAPH
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Presentation text */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 12.5, color: '#334155' }}>This is proudly presented to</div>
            <div className="aicit-cert-heading" style={{
              fontSize: 38, fontWeight: 800, color: '#1e3a8a', lineHeight: 1.05,
              margin: '6px 0 4px', wordBreak: 'break-word',
            }}>
              {studentName}
            </div>
            <div style={{ width: 120, height: 2, background: '#c9a24a', margin: '0 auto 10px' }} />
            <div style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.5, maxWidth: '150mm', margin: '0 auto' }}>
              for successfully completing
              {courseName ? <> the course <strong style={{ color: '#0f1f4e' }}>{courseName}</strong></> : <> the prescribed course of study</>}
              {institute ? <> at <strong style={{ color: '#0f1f4e' }}>{institute}</strong></> : null}
              {' '}and demonstrating the required standard of proficiency.
            </div>

            {/* Detail chips */}
            {(courseName || grade || marksLabel || issueDate) && (
              <div style={{
                display: 'flex', justifyContent: 'center', gap: 28, marginTop: 16,
                flexWrap: 'wrap', alignItems: 'flex-start',
              }}>
                <DetailChip label="Grade" value={grade} />
                <DetailChip label="Marks Obtained" value={marksLabel} />
                <DetailChip label="Date of Issue" value={issueDate} />
              </div>
            )}
          </div>
        </div>

        {/* Footer: signatures / seal / QR */}
        <footer style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <SignatureBlock img={CERT_ASSETS.sign1} name="Director" title="Authorized Signatory" />

          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <SealBadge />
            {qrDataUrl && (
              <div style={{ textAlign: 'center' }}>
                <img src={qrDataUrl} alt="Verification QR code" style={{ width: 62, height: 62 }} />
                <div style={{ fontSize: 7, color: '#8a7a4a', fontWeight: 600, letterSpacing: '0.5px', marginTop: 2 }}>
                  SCAN TO VERIFY
                </div>
              </div>
            )}
          </div>

          <SignatureBlock img={CERT_ASSETS.sign2} name="Registrar" title="Controller of Examinations" />
        </footer>

        {/* Verify footnote */}
        {certNumber && (
          <div style={{ textAlign: 'center', fontSize: 7.5, color: '#94a3b8', marginTop: 6 }}>
            Verify the authenticity of this certificate at {SITE.url?.replace(/^https?:\/\//, '') || 'the official AICIT website'} /verify
          </div>
        )}
      </div>
    </div>
  );
}
