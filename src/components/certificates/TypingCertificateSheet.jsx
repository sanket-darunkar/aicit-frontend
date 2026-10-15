import React from 'react';
import { SITE } from '../../config/siteConfig.js';
import { CERT_ASSETS, clean, formatDate, parseMarks, parseTyping } from './certificateUtils.js';

function Corner({ rotate }) {
  return (
    <svg style={{ transform: `rotate(${rotate}deg)` }}
      width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path d="M4 76V24C4 12.95 12.95 4 24 4h52" stroke="#c9a24a" strokeWidth="2.25" fill="none" />
      <circle cx="20" cy="20" r="4" fill="#c9a24a" />
    </svg>
  );
}

function SealBadge() {
  return (
    <div style={{ width: 86, height: 86, position: 'relative' }} aria-label="Official AICIT seal">
      <svg width="86" height="86" viewBox="0 0 86 86" fill="none">
        <circle cx="43" cy="43" r="41" fill="none" stroke="#c9a24a" strokeWidth="2" />
        <circle cx="43" cy="43" r="34" fill="none" stroke="#1e3a8a" strokeWidth="1" strokeDasharray="2 2.5" />
        <circle cx="43" cy="43" r="27" fill="#0f1f4e" />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center',
      }}>
        <span className="aicit-cert-heading" style={{ fontSize: 13, fontWeight: 800, lineHeight: 1 }}>AICIT</span>
        <span style={{ fontSize: 6, letterSpacing: '1px', marginTop: 2, color: '#c9a24a', fontWeight: 700 }}>EXAM SEAL</span>
      </div>
    </div>
  );
}

/** A row in the structured results table. Hidden entirely when value is empty. */
function ResultRow({ label, value, strong }) {
  if (!value) return null;
  return (
    <tr>
      <td style={{
        padding: '6px 12px', borderBottom: '1px solid #e2e8f0',
        fontSize: 9.5, letterSpacing: '1px', textTransform: 'uppercase',
        color: '#64748b', fontWeight: 700, width: '46%',
      }}>{label}</td>
      <td className="aicit-cert-heading" style={{
        padding: '6px 12px', borderBottom: '1px solid #e2e8f0',
        fontSize: strong ? 13 : 11.5, fontWeight: strong ? 800 : 600,
        color: strong ? '#1e3a8a' : '#0f1f4e',
      }}>{value}</td>
    </tr>
  );
}

function SignatureBlock({ img, name, title }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 150 }}>
      <div style={{ height: 38, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {img && (
          <img src={img} alt="" style={{ maxHeight: 36, maxWidth: 150, objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        )}
      </div>
      <div style={{ borderTop: '1.5px solid #0f1f4e', margin: '0 10px', paddingTop: 5 }}>
        <div className="aicit-cert-heading" style={{ fontSize: 10.5, fontWeight: 700, color: '#0f1f4e' }}>{name}</div>
        <div style={{ fontSize: 8, letterSpacing: '1px', textTransform: 'uppercase', color: '#8a7a4a', fontWeight: 600, marginTop: 1 }}>{title}</div>
      </div>
    </div>
  );
}

/**
 * Premium Computer-Based Typing Examination certificate — A4 landscape.
 *
 * All typing specifics (language, WPM, subject) are derived from the course
 * name the backend already stores — nothing is invented. Fields the current
 * backend does not expose (centre code, separate max/min marks, exam date)
 * are simply omitted; they will populate automatically if/when the backend
 * adds them to the certificate object.
 */
export default function TypingCertificateSheet({ cert = {}, photoUrl = null, qrDataUrl = null }) {
  const studentName = clean(cert.studentName) || '—';
  const courseName  = clean(cert.courseName);
  const institute   = clean(cert.instituteName);
  const certNumber  = clean(cert.certificateNumber);
  const grade       = clean(cert.grade);
  const issueDate   = formatDate(cert.issueDate);
  const { language, wpm, subject } = parseTyping(courseName);
  const marks = parseMarks(cert.marks);

  // Optional backend-supplied fields (surface them if they ever appear).
  const centreCode = clean(cert.centreCode);
  const examDate   = formatDate(cert.examDate);
  const maxMarks   = clean(cert.maxMarks) || marks.total;
  const obtained   = clean(cert.marksObtained) || marks.obtained;
  const marksLabel = obtained && maxMarks ? `${obtained} / ${maxMarks}` : marks.raw;

  return (
    <div className="aicit-cert-sheet">
      {/* Frames */}
      <div style={{ position: 'absolute', inset: '6mm', border: '2.5px solid #0f1f4e' }} />
      <div className="aicit-cert-guilloche" style={{ position: 'absolute', inset: '9mm', border: '1px solid #c9a24a' }} />

      {/* Corners */}
      <div style={{ position: 'absolute', top: '10mm', left: '10mm' }}><Corner rotate={0} /></div>
      <div style={{ position: 'absolute', top: '10mm', right: '10mm' }}><Corner rotate={90} /></div>
      <div style={{ position: 'absolute', bottom: '10mm', right: '10mm' }}><Corner rotate={180} /></div>
      <div style={{ position: 'absolute', bottom: '10mm', left: '10mm' }}><Corner rotate={270} /></div>

      {/* Watermark */}
      <img src={CERT_ASSETS.logo} alt="" aria-hidden="true" className="aicit-cert-watermark"
        style={{ position: 'absolute', top: '52%', left: '50%', width: '90mm', transform: 'translate(-50%,-50%)' }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }} />

      <div style={{ position: 'absolute', inset: '15mm', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={CERT_ASSETS.logo} alt="AICIT logo" style={{ height: 52, width: 'auto', objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <div style={{ flex: 1 }}>
            <div className="aicit-cert-heading" style={{ fontSize: 20, fontWeight: 800, color: '#0f1f4e', lineHeight: 1 }}>{SITE.name}</div>
            <div style={{ fontSize: 9.5, letterSpacing: '2px', textTransform: 'uppercase', color: '#8a7a4a', fontWeight: 600, marginTop: 2 }}>
              {SITE.fullName}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {certNumber && <>
              <div style={{ fontSize: 7.5, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8a7a4a', fontWeight: 700 }}>Certificate No.</div>
              <div className="aicit-cert-heading" style={{ fontSize: 11.5, fontWeight: 700, color: '#0f1f4e', fontFamily: 'JetBrains Mono, monospace' }}>{certNumber}</div>
            </>}
            {centreCode && <>
              <div style={{ fontSize: 7.5, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#8a7a4a', fontWeight: 700, marginTop: 4 }}>Centre Code</div>
              <div className="aicit-cert-heading" style={{ fontSize: 11, fontWeight: 700, color: '#0f1f4e' }}>{centreCode}</div>
            </>}
          </div>
        </header>

        <div style={{ height: 2.5, background: 'linear-gradient(90deg, transparent, #c9a24a 20%, #c9a24a 80%, transparent)', margin: '8px 0 0' }} />

        {/* Title */}
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <div style={{ fontSize: 9.5, letterSpacing: '5px', textTransform: 'uppercase', color: '#8a7a4a', fontWeight: 600 }}>
            Computer-Based
          </div>
          <div className="aicit-cert-heading" style={{ fontSize: 30, fontWeight: 800, color: '#0f1f4e', lineHeight: 1.05, marginTop: 1 }}>
            Typing Examination Certificate
          </div>
        </div>

        {/* Body: photo + name + results table */}
        <div style={{ display: 'flex', gap: 22, marginTop: 14, flex: 1 }}>
          {/* Left: photo + name */}
          <div style={{ width: '64mm', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '32mm', height: '40mm', border: '2px solid #c9a24a', padding: 3, background: '#fff', boxShadow: '0 2px 10px rgba(15,31,78,0.12)' }}>
              <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {photoUrl
                  ? <img src={photoUrl} alt={`${studentName} photograph`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: 8, color: '#94a3b8', letterSpacing: '1px' }}>PHOTOGRAPH</span>}
              </div>
            </div>
            <div style={{ fontSize: 10, color: '#334155', marginTop: 14 }}>This certifies that</div>
            <div className="aicit-cert-heading" style={{ fontSize: 22, fontWeight: 800, color: '#1e3a8a', lineHeight: 1.1, margin: '4px 0', wordBreak: 'break-word' }}>
              {studentName}
            </div>
            <div style={{ width: 90, height: 2, background: '#c9a24a', margin: '2px 0 8px' }} />
            <div style={{ fontSize: 10, color: '#334155', lineHeight: 1.45 }}>
              has successfully passed the typing examination conducted
              {institute ? <> at <strong style={{ color: '#0f1f4e' }}>{institute}</strong></> : null}
              {' '}with the following result.
            </div>
          </div>

          {/* Right: results table */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              background: '#0f1f4e', color: '#fff', padding: '7px 12px',
              fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700,
            }}>
              Examination Result
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e2e8f0' }}>
              <tbody>
                <ResultRow label="Examination / Subject" value={subject} />
                <ResultRow label="Language" value={language} />
                <ResultRow label="Typing Speed" value={wpm} strong />
                <ResultRow label="Maximum Marks" value={maxMarks} />
                <ResultRow label="Marks Obtained" value={marksLabel} strong />
                <ResultRow label="Grade / Result" value={grade} strong />
                <ResultRow label="Examination Date" value={examDate} />
                <ResultRow label="Date of Issue" value={issueDate} />
              </tbody>
            </table>
            {!subject && !wpm && !marksLabel && !grade && (
              <div style={{ fontSize: 9, color: '#94a3b8', padding: '8px 2px' }}>
                Result details will appear here from the examination record.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginTop: 6 }}>
          <SignatureBlock img={CERT_ASSETS.sign1} name="Examination Executive" title="Invigilating Authority" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <SealBadge />
            {qrDataUrl && (
              <div style={{ textAlign: 'center' }}>
                <img src={qrDataUrl} alt="Verification QR code" style={{ width: 58, height: 58 }} />
                <div style={{ fontSize: 6.5, color: '#8a7a4a', fontWeight: 600, letterSpacing: '0.5px', marginTop: 2 }}>SCAN TO VERIFY</div>
              </div>
            )}
          </div>
          <SignatureBlock img={CERT_ASSETS.sign2} name="Institute Head" title="Authorized Signatory" />
        </footer>

        {certNumber && (
          <div style={{ textAlign: 'center', fontSize: 7.5, color: '#94a3b8', marginTop: 5 }}>
            Verify the authenticity of this certificate at {SITE.url?.replace(/^https?:\/\//, '') || 'the official AICIT website'} /verify
          </div>
        )}
      </div>
    </div>
  );
}
