import React from 'react';
import { SITE } from '../../config/siteConfig.js';
import { CERT_ASSETS, CERT_COLORS, clean, formatDate, parseMarks, parseAtc } from './certificateUtils.js';
import {
  GoldFrame, LeftRibbon, Masthead, GoldDivider, PhotoFrame,
} from './CertificateChrome.jsx';

const { NAVY, GOLD, GOLD_LT } = CERT_COLORS;

/** Circular gold-ring icon used in the stats strip. */
function StatIcon({ children }) {
  return (
    <div style={{
      width: 34, height: 34, borderRadius: '50%', background: NAVY,
      border: `2px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: GOLD_LT, flexShrink: 0,
    }}>{children}</div>
  );
}

function Stat({ icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' }}>
      <StatIcon>{icon}</StatIcon>
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontSize: 8.5, color: '#5a6b8c', fontWeight: 600 }}>{label}</div>
        <div className="aicit-cert-heading" style={{ fontSize: 13, fontWeight: 800, color: NAVY }}>{value}</div>
      </div>
    </div>
  );
}

function MetaRow({ icon, label, value, valueStrong }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 5 }}>
      <span style={{ color: NAVY, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div style={{ lineHeight: 1.2 }}>
        <div style={{ fontSize: 8, color: '#5a6b8c', fontWeight: 600 }}>{label}</div>
        <div className="aicit-cert-heading" style={{ fontSize: valueStrong ? 11.5 : 10.5, fontWeight: 700, color: NAVY, fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
      </div>
    </div>
  );
}

function SignatureCol({ img, caption }) {
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ height: 34, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {img && <img src={img} alt="" style={{ maxHeight: 32, maxWidth: 130, objectFit: 'contain' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
      </div>
      <div style={{ borderTop: `1.5px solid ${NAVY}`, margin: '0 8px', paddingTop: 4 }}>
        {caption.map((line, i) => (
          <div key={i} style={{ fontSize: 8, fontWeight: i === 0 ? 700 : 500, lineHeight: 1.3, color: i === 0 ? NAVY : '#475569' }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * AICIT "Certificate of Achievement" — portrait A4, matching reference 1.
 * All values come from the real certificate record; absent optional fields
 * are hidden. No fabricated data, accreditation, or signatures.
 */
export default function CertificateSheet({ cert = {}, photoUrl = null, qrDataUrl = null }) {
  const studentName = clean(cert.studentName) || '—';
  const courseName  = clean(cert.courseName);
  const certNumber  = clean(cert.certificateNumber);
  const studentId   = clean(cert.studentId) || clean(cert.enrollmentNumber);
  const grade       = clean(cert.grade);
  const duration    = clean(cert.courseDuration) || clean(cert.duration);
  const issueDate   = formatDate(cert.issueDate);
  const marks       = parseMarks(cert.marks);
  const marksLabel  = marks.obtained && marks.total ? `${marks.obtained} / ${marks.total}` : marks.raw;
  const atc         = parseAtc(cert);

  return (
    <div className="aicit-cert-sheet">
      <GoldFrame />

      {/* Globe watermark */}
      <img src={CERT_ASSETS.ncs} alt="" aria-hidden="true" className="aicit-cert-watermark"
        style={{ position: 'absolute', top: '46%', left: '52%', width: '120mm', transform: 'translate(-50%,-50%)', mixBlendMode: 'multiply' }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }} />

      <LeftRibbon height="200mm" top="16mm" />

      {/* Main content column (offset right of the ribbon) */}
      <div style={{ position: 'absolute', top: '12mm', left: '40mm', right: '12mm', bottom: '10mm', display: 'flex', flexDirection: 'column' }}>

        {/* Masthead */}
        <Masthead />
        <div style={{ textAlign: 'center', marginTop: 2 }}>
          <div style={{ fontSize: 8.5, letterSpacing: '2px', color: GOLD, fontWeight: 700 }}>
            SKILLS&nbsp;|&nbsp;KNOWLEDGE&nbsp;|&nbsp;OPPORTUNITY&nbsp;|&nbsp;A BRIGHTER TOMORROW
          </div>
        </div>

        <GoldDivider width="88%" margin="8px auto 0" />

        {/* Title */}
        <div style={{ textAlign: 'center', marginTop: 6 }}>
          <div className="aicit-cert-serif" style={{ fontSize: 40, fontWeight: 800, color: NAVY, lineHeight: 0.95, letterSpacing: '1px' }}>
            CERTIFICATE
          </div>
          <div className="aicit-cert-heading" style={{ fontSize: 15, fontWeight: 700, color: GOLD, letterSpacing: '5px', marginTop: 2 }}>
            OF ACHIEVEMENT
          </div>
        </div>

        {/* Presentation + photo */}
        <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#334155', fontStyle: 'italic' }}>This is to certify that</div>
            <div className="aicit-cert-serif" style={{ fontSize: 30, fontWeight: 800, color: GOLD, lineHeight: 1.05, margin: '4px 0', letterSpacing: '0.5px', wordBreak: 'break-word' }}>
              {studentName}
            </div>
            <div style={{ fontSize: 11.5, color: '#334155' }}>has successfully completed the prescribed course of</div>
          </div>
          <PhotoFrame photoUrl={photoUrl} name={studentName} label="PASSPORT&nbsp;SIZE PHOTO" width="30mm" height="37mm" />
        </div>

        {/* Course panel */}
        {courseName && (
          <div style={{ position: 'relative', margin: '10px 0 0' }}>
            <div style={{
              background: `linear-gradient(135deg, #0b1b40, #16306b)`,
              border: `2px solid ${GOLD}`, borderRadius: 2, padding: '10px 28px', textAlign: 'center',
              boxShadow: '0 2px 10px rgba(11,27,64,0.25)',
            }}>
              <div className="aicit-cert-serif" style={{ fontSize: 22, fontWeight: 800, color: GOLD_LT, lineHeight: 1.1, textTransform: 'uppercase' }}>
                {courseName}
              </div>
            </div>
          </div>
        )}

        {/* Body sentence */}
        <div style={{ textAlign: 'center', fontSize: 10.5, color: '#334155', fontStyle: 'italic', lineHeight: 1.5, margin: '10px 14px 0' }}>
          During the period of training, the student has demonstrated commendable performance and has been
          awarded this certificate for successful completion of the course.
        </div>

        {/* Stats strip */}
        {(duration || grade || marksLabel) && (
          <div style={{ display: 'flex', border: `1.5px solid ${GOLD}`, borderRadius: 3, marginTop: 12, padding: '8px 4px', background: 'rgba(255,255,255,0.5)' }}>
            <Stat label="Course Duration" value={duration}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>} />
            <div style={{ width: 1, background: GOLD, opacity: 0.5 }} />
            <Stat label="Grade" value={grade}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 5 5.6.6-4 4 1 5.4L12 19l-5 3 1-5.4-4-4 5.6-.6z"/></svg>} />
            <div style={{ width: 1, background: GOLD, opacity: 0.5 }} />
            <Stat label="Marks Obtained" value={marksLabel}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>} />
          </div>
        )}

        {/* Meta row: left IDs / right ATC */}
        <div style={{ display: 'flex', gap: 16, marginTop: 12, borderTop: `1px solid ${GOLD}`, paddingTop: 10 }}>
          <div style={{ flex: 1 }}>
            <MetaRow label="Student ID" value={studentId}
              icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>} />
            <MetaRow label="Certificate No." value={certNumber}
              icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/></svg>} />
            <MetaRow label="Date of Issue" value={issueDate}
              icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>} />
          </div>
          <div style={{ width: 1, background: GOLD, opacity: 0.5 }} />
          <div style={{ flex: 1 }}>
            {atc.name && (
              <div style={{ display: 'flex', gap: 7 }}>
                <span style={{ color: NAVY, marginTop: 1 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6"/></svg>
                </span>
                <div>
                  <div style={{ fontSize: 8, color: '#5a6b8c', fontWeight: 600 }}>Authorised Training Centre (ATC)</div>
                  <div className="aicit-cert-heading" style={{ fontSize: 11.5, fontWeight: 800, color: NAVY, lineHeight: 1.2 }}>{atc.name}</div>
                  {atc.location && <div style={{ fontSize: 9.5, color: '#475569', fontWeight: 600 }}>{atc.location}</div>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer signatures */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', gap: 10, paddingTop: 14 }}>
          <SignatureCol img={CERT_ASSETS.sign1}
            caption={['Signature of the', 'Head of the Institute', 'with Institution Seal', '(Authorised Signatory)']} />

          <div style={{ textAlign: 'center', flex: 1 }}>
            {qrDataUrl ? (
              <>
                <img src={qrDataUrl} alt="Verification QR code" style={{ width: 60, height: 60 }} />
                <div style={{ fontSize: 8, color: NAVY, fontWeight: 700, marginTop: 2 }}>Verification QR</div>
                <div style={{ fontSize: 7, color: '#5a6b8c' }}>Connect to official<br />verification system</div>
              </>
            ) : (
              <div style={{ fontSize: 7.5, color: '#94a3b8', padding: '0 6px' }}>
                Verify at {SITE.url?.replace(/^https?:\/\//, '') || 'the AICIT website'}/verify
              </div>
            )}
          </div>

          <SignatureCol img={CERT_ASSETS.sign2}
            caption={['EXAM EXECUTIVE', 'ALL INDIA COUNCIL FOR', 'INFORMATION TECHNOLOGY', '(Authorised Signatory)']} />
        </div>
      </div>
    </div>
  );
}
