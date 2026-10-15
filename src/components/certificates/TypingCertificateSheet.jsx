import React from 'react';
import { CERT_ASSETS, CERT_COLORS, clean, formatDate, parseMarks, parseTyping, parseAtc } from './certificateUtils.js';
import {
  GoldFrame, LeftRibbon, IsoLaurelBadge, GoldDivider, PhotoFrame,
} from './CertificateChrome.jsx';
import { SITE } from '../../config/siteConfig.js';

const { NAVY, GOLD, GOLD_LT } = CERT_COLORS;

/** A 3-up header cell (Student ID / Centre Code / ATC). */
function HeaderCell({ label, value, grow }) {
  return (
    <div style={{ flex: grow ? 2 : 1, border: `1.5px solid ${GOLD}`, background: 'rgba(255,255,255,0.6)' }}>
      <div style={{ background: 'rgba(201,162,74,0.14)', borderBottom: `1px solid ${GOLD}`, textAlign: 'center', padding: '3px 6px', fontSize: 8.5, letterSpacing: '0.5px', color: '#5a6b8c', fontWeight: 700 }}>
        {label}
      </div>
      <div className="aicit-cert-heading" style={{ textAlign: 'center', padding: '5px 6px', fontSize: 12, fontWeight: 800, color: NAVY }}>
        {value || '—'}
      </div>
    </div>
  );
}

function SignatureCol({ img, caption }) {
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ height: 32, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {img && <img src={img} alt="" style={{ maxHeight: 30, maxWidth: 130, objectFit: 'contain' }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
      </div>
      <div style={{ borderTop: `1.5px solid ${NAVY}`, margin: '0 6px', paddingTop: 4 }}>
        {caption.map((line, i) => (
          <div key={i} style={{ fontSize: 7.5, fontWeight: i === 0 ? 700 : 500, lineHeight: 1.3, color: i === 0 ? NAVY : '#475569' }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * AICIT "Computer Based Typing Examination" certificate — portrait A4,
 * matching reference 2. Typing specifics (subject, language, WPM) derive from
 * the real course name; max/min/obtained marks and centre code surface only
 * when the backend provides them. No fabricated data.
 */
export default function TypingCertificateSheet({ cert = {}, photoUrl = null, qrDataUrl = null }) {
  const studentName = clean(cert.studentName) || '—';
  const courseName  = clean(cert.courseName);
  const certNumber  = clean(cert.certificateNumber);
  const studentId   = clean(cert.studentId) || clean(cert.enrollmentNumber);
  const centreCode  = clean(cert.centreCode);
  const grade       = clean(cert.grade);
  const centreGrade = clean(cert.centreGrade) || grade;
  const issueDate   = formatDate(cert.issueDate);
  const examMonth   = clean(cert.examMonth) || formatDate(cert.examDate);
  const { language, wpm, subject } = parseTyping(courseName);
  const marks = parseMarks(cert.marks);

  const atc        = parseAtc(cert);
  const examLoc    = atc.location || clean(cert.examLocation);
  const maxMarks   = clean(cert.maxMarks) || marks.total;
  const minMarks   = clean(cert.minMarks);
  const obtained   = clean(cert.marksObtained) || marks.obtained || marks.raw;
  const wpmValue   = wpm ? wpm.replace(/\s*W\.?P\.?M\.?/i, '').trim() : null;

  return (
    <div className="aicit-cert-sheet">
      <GoldFrame />

      <img src={CERT_ASSETS.ncs} alt="" aria-hidden="true" className="aicit-cert-watermark"
        style={{ position: 'absolute', top: '48%', left: '30%', width: '95mm', transform: 'translate(-50%,-50%)', mixBlendMode: 'multiply' }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }} />

      <div style={{ position: 'absolute', top: '10mm', left: '10mm', right: '10mm', bottom: '8mm', display: 'flex', flexDirection: 'column' }}>

        {/* Masthead: laurel badge (left) · AICIT logo (center) · ISO badge (right) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <IsoLaurelBadge size={78} />
          <img src={CERT_ASSETS.logo} alt="AICIT — All India Council for Information Technology"
            style={{ height: 64, width: 'auto', objectFit: 'contain', maxWidth: '95mm' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <img src={CERT_ASSETS.iso} alt="ISO 9001 certified" style={{ height: 70, width: 'auto', objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>

        <div style={{ textAlign: 'center', marginTop: 2 }}>
          <div style={{ fontSize: 9, letterSpacing: '2px', color: GOLD, fontWeight: 700 }}>
            SKILLS&nbsp;|&nbsp;KNOWLEDGE&nbsp;|&nbsp;OPPORTUNITY&nbsp;|&nbsp;A BRIGHTER TOMORROW
          </div>
        </div>
        <GoldDivider width="92%" margin="6px auto 0" />

        {/* Full org name */}
        <div style={{ textAlign: 'center', marginTop: 4 }}>
          <div className="aicit-cert-serif" style={{ fontSize: 17, fontWeight: 800, color: NAVY, letterSpacing: '0.5px' }}>
            {SITE.fullName.toUpperCase()}
          </div>
          <div style={{ fontSize: 10, color: '#475569', fontStyle: 'italic', marginTop: 1 }}>
            An ISO 9001 : 2015 Certified Organization
          </div>
        </div>

        {/* Title banner */}
        <div style={{ margin: '8px 0 0', position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <div style={{
            background: `linear-gradient(135deg, #0b1b40, #16306b)`, border: `2px solid ${GOLD}`,
            padding: '7px 40px', textAlign: 'center', minWidth: '70%',
            boxShadow: '0 2px 8px rgba(11,27,64,0.25)',
          }}>
            <div className="aicit-cert-serif" style={{ fontSize: 20, fontWeight: 800, color: GOLD_LT, letterSpacing: '1px' }}>
              COMPUTER BASED TYPING EXAMINATION
            </div>
          </div>
        </div>

        {/* Header cells */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <HeaderCell label="STUDENT ID" value={studentId} />
          <HeaderCell label="CENTRE CODE" value={centreCode} />
          <HeaderCell label="AUTHORISED TRAINING CENTRE (ATC) NAME" value={atc.name} grow />
        </div>

        {/* Certify + name + photo */}
        <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div className="aicit-cert-serif" style={{ fontSize: 15, color: NAVY, fontWeight: 700, letterSpacing: '1px' }}>THIS IS TO CERTIFY THAT</div>
            <div className="aicit-cert-serif" style={{ fontSize: 28, fontWeight: 800, color: GOLD, lineHeight: 1.1, margin: '4px 0', wordBreak: 'break-word' }}>
              {studentName}
            </div>
            <div style={{ fontSize: 11, color: '#334155', fontStyle: 'italic', lineHeight: 1.4 }}>
              has passed in the following subject of the<br />Computer Based Typing Examination
            </div>
          </div>
          <PhotoFrame photoUrl={photoUrl} name={studentName} label="PASSPORT SIZE PHOTO" width="30mm" height="37mm" />
        </div>

        <div style={{ textAlign: 'center', fontSize: 9, color: NAVY, fontStyle: 'italic', marginTop: 8 }}>
          Designed and Developed as per the Standards of All India Council for Information Technology
        </div>

        {/* held-at row */}
        <div style={{ display: 'flex', border: `1.5px solid ${GOLD}`, marginTop: 8, fontSize: 10 }}>
          <div style={{ flex: 1.3, padding: '6px 8px', fontStyle: 'italic', color: '#475569', borderRight: `1px solid ${GOLD}` }}>
            held at<br />in the month of
          </div>
          <div className="aicit-cert-heading" style={{ flex: 1, padding: '6px 8px', fontWeight: 800, color: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${GOLD}` }}>
            {examMonth || '—'}
          </div>
          <div className="aicit-cert-heading" style={{ flex: 1.4, padding: '6px 8px', fontWeight: 800, color: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${GOLD}` }}>
            {examLoc || '—'}
          </div>
          <div style={{ flex: 0.5, padding: '6px 8px', fontStyle: 'italic', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${GOLD}` }}>
            in
          </div>
          <div style={{ flex: 0.9, padding: '4px 8px', fontStyle: 'italic', color: '#475569', borderRight: `1px solid ${GOLD}`, display: 'flex', alignItems: 'center' }}>
            Centre<br />Grade
          </div>
          <div className="aicit-cert-heading" style={{ flex: 0.6, padding: '6px 8px', fontWeight: 800, color: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {centreGrade || '—'}
          </div>
        </div>

        {/* Results table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8, border: `1.5px solid ${GOLD}` }}>
          <thead>
            <tr style={{ background: 'rgba(201,162,74,0.16)' }}>
              {['NAME OF THE SUBJECT', 'SPEED W.P.M.', 'MAXIMUM MARKS', 'MINIMUM MARKS', 'MARKS OBTAINED'].map((h) => (
                <th key={h} style={{ border: `1px solid ${GOLD}`, padding: '6px 6px', fontSize: 8.5, letterSpacing: '0.3px', color: NAVY, fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="aicit-cert-heading" style={{ border: `1px solid ${GOLD}`, padding: '8px 8px', fontSize: 10.5, fontWeight: 700, color: NAVY, textAlign: 'center' }}>
                {subject || (language ? `${language} Typing` : '—')}
              </td>
              <td className="aicit-cert-heading" style={{ border: `1px solid ${GOLD}`, padding: '8px', fontSize: 12, fontWeight: 800, color: NAVY, textAlign: 'center' }}>{wpmValue || '—'}</td>
              <td className="aicit-cert-heading" style={{ border: `1px solid ${GOLD}`, padding: '8px', fontSize: 12, fontWeight: 800, color: NAVY, textAlign: 'center' }}>{maxMarks || '—'}</td>
              <td className="aicit-cert-heading" style={{ border: `1px solid ${GOLD}`, padding: '8px', fontSize: 12, fontWeight: 800, color: NAVY, textAlign: 'center' }}>{minMarks || '—'}</td>
              <td className="aicit-cert-heading" style={{ border: `1px solid ${GOLD}`, padding: '8px', fontSize: 12, fontWeight: 800, color: GOLD, textAlign: 'center' }}>{obtained || '—'}</td>
            </tr>
          </tbody>
        </table>

        {/* Signatures + cert meta */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', gap: 10, paddingTop: 12 }}>
          <SignatureCol img={CERT_ASSETS.sign1}
            caption={['Signature of the', 'Head of the Institute', 'with Institution Seal']} />

          <div style={{ flex: 1.1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
              <span style={{ color: NAVY }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6"/></svg></span>
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontSize: 8.5, color: '#5a6b8c' }}>Certificate No.</div>
                <div className="aicit-cert-heading" style={{ fontSize: 12, fontWeight: 800, color: NAVY, fontFamily: 'JetBrains Mono, monospace' }}>{certNumber || '—'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ color: NAVY }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg></span>
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontSize: 8.5, color: '#5a6b8c' }}>Date of Issue</div>
                <div className="aicit-cert-heading" style={{ fontSize: 12, fontWeight: 800, color: NAVY }}>{issueDate || '—'}</div>
              </div>
            </div>
            {qrDataUrl && (
              <img src={qrDataUrl} alt="Verification QR code" style={{ width: 42, height: 42, marginTop: 6 }} />
            )}
          </div>

          <SignatureCol img={CERT_ASSETS.sign2}
            caption={['EXAM EXECUTIVE', 'ALL INDIA COUNCIL FOR', 'INFORMATION TECHNOLOGY']} />
        </div>

        {/* Accreditation badge strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, marginTop: 8 }}>
          <img src={CERT_ASSETS.egac} alt="EGAC" style={{ height: 30, objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <img src={CERT_ASSETS.ncs} alt="National Career Service" style={{ height: 26, objectFit: 'contain' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>

        {/* Grade system footer */}
        <div style={{ marginTop: 6, border: `1px solid ${GOLD}`, borderRadius: 2, textAlign: 'center', padding: '4px 6px', fontSize: 8.5, color: NAVY, fontWeight: 600, background: 'rgba(255,255,255,0.5)' }}>
          GRADE System A+ 95% &amp; Above&nbsp;&nbsp;(A : 90% to 94%)&nbsp;&nbsp;(B : 85% to 89%)&nbsp;&nbsp;(C : 80% to 84%)
        </div>
      </div>
    </div>
  );
}
