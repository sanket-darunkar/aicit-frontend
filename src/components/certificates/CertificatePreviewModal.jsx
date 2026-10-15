import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CertificateSheet from './CertificateSheet.jsx';
import TypingCertificateSheet from './TypingCertificateSheet.jsx';
import { isTyping, makeQrDataUrl } from './certificateUtils.js';
import './certificates.css';

/**
 * Full-screen modal that renders a premium, print-ready certificate preview
 * for a single ISSUED certificate and lets the user Print / Save-as-PDF.
 *
 * It uses ONLY the data already present on the `cert` object plus an optional
 * `photoUrl` (an object URL the caller fetched from the authed student-photo
 * endpoint). Nothing is fabricated.
 *
 * Props:
 *   cert         – the certificate object (certificateNumber, studentName,
 *                  courseName, instituteName, marks, grade, issueDate,
 *                  certificateType, …)
 *   photoUrl     – optional object URL of the student photograph
 *   onClose      – close handler
 *   serverPdf    – optional { label, onDownload } to also expose the existing
 *                  server-generated PDF download (kept intact, no regression)
 */
export default function CertificatePreviewModal({ cert, photoUrl = null, onClose, serverPdf = null }) {
  const [qr, setQr] = useState(null);
  const [scale, setScale] = useState(1);
  const stageRef = useRef(null);
  const typing = isTyping(cert);

  // Build the genuine verification QR (points at the real /verify route).
  useEffect(() => {
    let alive = true;
    makeQrDataUrl(cert?.certificateNumber).then((url) => { if (alive) setQr(url); });
    return () => { alive = false; };
  }, [cert?.certificateNumber]);

  // Scale the fixed A4-PORTRAIT sheet (210mm wide × 297mm tall) to fit both the
  // available width and height of the viewport, so the whole certificate shows.
  useLayoutEffect(() => {
    const MM_TO_PX = 96 / 25.4;         // CSS px per mm at 96dpi
    const SHEET_W = 210 * MM_TO_PX;     // ≈ 793.7px
    const SHEET_H = 297 * MM_TO_PX;     // ≈ 1122.5px
    const compute = () => {
      const availW = (stageRef.current?.clientWidth ?? window.innerWidth) - 16;
      const availH = (stageRef.current?.clientHeight ?? window.innerHeight) - 16;
      setScale(Math.min(1, availW / SHEET_W, availH / SHEET_H));
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Esc to close.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handlePrint = () => window.print();

  const MM_TO_PX = 96 / 25.4;
  const scaledHeight = 297 * MM_TO_PX * scale;
  const scaledWidth = 210 * MM_TO_PX * scale;

  const Sheet = typing ? TypingCertificateSheet : CertificateSheet;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex flex-col aicit-no-print" role="dialog" aria-modal="true" aria-label="Certificate preview">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-primary-950 text-white shadow-lg flex-shrink-0">
        <div className="min-w-0">
          <p className="text-sm font-heading font-bold truncate">
            {typing ? 'Typing Examination Certificate' : 'Certificate of Achievement'}
          </p>
          <p className="text-xs text-blue-200 truncate">
            {cert?.studentName} · {cert?.certificateNumber || 'Preview'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"/>
            </svg>
            Print / Save as PDF
          </button>
          {serverPdf && (
            <button onClick={serverPdf.onDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
              </svg>
              {serverPdf.label || 'Official PDF'}
            </button>
          )}
          <button onClick={onClose} aria-label="Close preview"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable preview stage */}
      <div ref={stageRef} className="flex-1 overflow-auto p-2 sm:p-6 flex justify-center items-start">
        <div style={{ width: scaledWidth, height: scaledHeight, flexShrink: 0 }}>
          <div className="aicit-cert-scale" style={{ '--cert-scale': String(scale) }}>
            <div className="shadow-2xl">
              <Sheet cert={cert} photoUrl={photoUrl} qrDataUrl={qr} />
            </div>
          </div>
        </div>
      </div>

      {/* Print-only root: rendered off-screen; made visible only by @media print. */}
      <div className="aicit-print-root" aria-hidden="true"
        style={{ position: 'fixed', left: '-10000px', top: 0 }}>
        <Sheet cert={cert} photoUrl={photoUrl} qrDataUrl={qr} />
      </div>
    </div>
  );
}
