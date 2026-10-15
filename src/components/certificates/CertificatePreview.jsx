import React from 'react';
import CertificatePreviewModal from './CertificatePreviewModal.jsx';
import useCertificatePhoto from './useCertificatePhoto.js';

/**
 * Convenience wrapper: fetches the student photo for the given scope and
 * renders the premium certificate preview modal. Mount this only when a
 * certificate is selected (so the photo hook runs for that cert).
 *
 * Props:
 *   cert       – certificate object to preview
 *   scope      – 'admin' | 'institute' (which token/endpoint for the photo)
 *   onClose    – close handler
 *   serverPdf  – optional { label, onDownload } to also surface the existing
 *                server-generated PDF download (kept intact)
 */
export default function CertificatePreview({ cert, scope = 'institute', onClose, serverPdf }) {
  const photoUrl = useCertificatePhoto({
    studentId: cert?.studentId ?? null,
    hasPhoto: cert?.hasPhoto ?? true,
    scope,
  });

  if (!cert) return null;

  return (
    <CertificatePreviewModal
      cert={cert}
      photoUrl={photoUrl}
      onClose={onClose}
      serverPdf={serverPdf}
    />
  );
}
