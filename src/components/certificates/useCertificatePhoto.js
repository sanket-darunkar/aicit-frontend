import { useEffect, useState } from 'react';
import { auth, BASE_URL } from '../../services/api.js';

/**
 * Fetch a student's photo (authed blob) and return an object URL for use on a
 * certificate. Works for both the admin and institute portals.
 *
 * The certificate list/detail payloads do not always carry `studentId` /
 * `hasPhoto`; when they are absent this hook simply returns `null` and the
 * certificate template shows its clean "PHOTOGRAPH" placeholder instead of a
 * broken image. No fabrication, no errors.
 *
 * @param {object}  opts
 * @param {number|string|null} opts.studentId  student id (if the cert exposes it)
 * @param {boolean} opts.hasPhoto              whether a photo exists (defaults true when unknown)
 * @param {'admin'|'institute'} opts.scope     which token + endpoint to use
 */
export default function useCertificatePhoto({ studentId, hasPhoto = true, scope = 'institute' }) {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    setPhotoUrl(null);
    if (!studentId || !hasPhoto) return;

    const token = scope === 'admin' ? auth.getAdminToken() : auth.getInstituteToken();
    if (!token) return;

    let objectUrl = null;
    let cancelled = false;
    const base = scope === 'admin' ? 'admin' : 'institute';

    fetch(`${BASE_URL}/api/${base}/students/${studentId}/photo`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Photo unavailable');
        return res.blob();
      })
      .then((blob) => {
        if (cancelled || !blob || blob.size === 0) return;
        objectUrl = URL.createObjectURL(blob);
        setPhotoUrl(objectUrl);
      })
      .catch(() => { if (!cancelled) setPhotoUrl(null); });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [studentId, hasPhoto, scope]);

  return photoUrl;
}
