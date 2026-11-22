import React, { useEffect, useState } from 'react';
import { fetchCertificatePreviewImage } from '../../services/instituteService.js';
import { fetchAdminCertificatePreviewImage } from '../../services/adminService.js';

/**
 * Certificate Preview — displays the EXACT same image as the downloaded PDF.
 *
 * The backend generates one PDF (via PdfGeneratorService) and serves it two
 * ways:
 *   GET /api/institute/certificates/{id}/download  → application/pdf
 *   GET /api/institute/certificates/{id}/preview   → image/png  (page 0, 150 DPI)
 *
 * This component fetches the /preview PNG and shows it in a full-screen modal.
 * There is no separate HTML certificate template here — the backend is the
 * single source of truth for certificate rendering.
 *
 * Props:
 *   cert       – certificate object (must have .id and .certificateNumber)
 *   scope      – 'admin' | 'institute'
 *   onClose    – close handler
 *   serverPdf  – optional { label, onDownload } to surface the PDF download button
 */
export default function CertificatePreview({ cert, scope = 'institute', onClose, serverPdf }) {
  const [imgUrl,  setImgUrl]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Fetch the backend-rendered PNG preview.
  useEffect(() => {
    if (!cert?.id) return;
    let objectUrl = null;
    let cancelled = false;

    setLoading(true);
    setError(null);
    setImgUrl(null);

    const fetcher = scope === 'admin'
      ? fetchAdminCertificatePreviewImage
      : fetchCertificatePreviewImage;

    fetcher(cert.id)
      .then((blob) => {
        if (cancelled) return;
        if (!blob || blob.size === 0) {
          setError('Preview not available. The certificate may not have been issued yet.');
          return;
        }
        objectUrl = URL.createObjectURL(blob);
        setImgUrl(objectUrl);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load preview.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [cert?.id, scope]);

  // Esc to close.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!cert) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Certificate preview"
    >
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-primary-950 text-white shadow-lg flex-shrink-0">
        <div className="min-w-0">
          <p className="text-sm font-heading font-bold truncate">
            {cert.certificateType === 'TYPING'
              ? 'Typing Examination Certificate'
              : 'Certificate of Achievement'}
          </p>
          <p className="text-xs text-blue-200 truncate">
            {cert.studentName} · {cert.certificateNumber || 'Preview'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {serverPdf && (
            <button
              onClick={serverPdf.onDownload}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {serverPdf.label || 'Download PDF'}
            </button>
          )}

          <button
            onClick={onClose}
            aria-label="Close preview"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Preview area ── */}
      <div className="flex-1 overflow-auto p-4 flex justify-center items-start bg-gray-900">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-white/60">
            <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm">Loading certificate preview…</span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-red-300">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-sm text-center max-w-xs">{error}</p>
          </div>
        )}

        {imgUrl && !loading && (
          <img
            src={imgUrl}
            alt={`Certificate for ${cert.studentName}`}
            className="max-w-full shadow-2xl rounded"
            style={{ maxHeight: 'calc(100vh - 100px)', objectFit: 'contain' }}
          />
        )}
      </div>
    </div>
  );
}
