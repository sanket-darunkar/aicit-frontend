/**
 * AICIT – Certificate rendering helpers
 *
 * These utilities operate ONLY on data that genuinely exists on the
 * certificate object returned by the backend. Nothing here invents marks,
 * grades, signatories, accreditation or verification details. Missing
 * optional fields resolve to `null` so the templates can hide them cleanly
 * instead of printing "undefined" / "null".
 */
import QRCode from 'qrcode';
import { SITE } from '../../config/siteConfig.js';

/** Trim + collapse to null so empty strings never render. */
export function clean(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

/** A certificate is a typing certificate when the backend marks it so. */
export function isTyping(cert) {
  return cert?.certificateType === 'TYPING';
}

/**
 * The public verification URL encoded in the QR code. This points at the
 * REAL, already-implemented verification route (/verify/:certNumber), so the
 * QR is genuine — scanning it hits the live public verify API.
 * Falls back to the deployed origin at runtime when SITE.url is a placeholder.
 */
export function verifyUrl(certificateNumber) {
  const num = clean(certificateNumber);
  if (!num) return null;
  const base =
    (typeof window !== 'undefined' && window.location?.origin) ||
    SITE.url ||
    '';
  return `${base.replace(/\/$/, '')}/verify/${encodeURIComponent(num)}`;
}

/** Generate a QR code data URL (PNG). Returns null if there's nothing to encode. */
export async function makeQrDataUrl(certificateNumber) {
  const url = verifyUrl(certificateNumber);
  if (!url) return null;
  try {
    return await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'M',
      margin: 1,
      scale: 6,
      color: { dark: '#0f1f4e', light: '#ffffff' },
    });
  } catch {
    return null;
  }
}

/**
 * Parse a typing-course name into { subject, language, wpm } WITHOUT inventing
 * data — every value comes straight from the course name string the backend
 * already stores (e.g. "English Typing – 40 W.P.M.", "GCC-TBC Pune Board Typing").
 */
export function parseTyping(courseName) {
  const name = clean(courseName);
  if (!name) return { language: null, wpm: null, subject: null };

  const wpmMatch = name.match(/(\d{2,3})\s*W\.?P\.?M\.?/i);
  const wpm = wpmMatch ? `${wpmMatch[1]} W.P.M.` : null;

  const langMatch = name.match(/\b(English|Marathi|Hindi|Sanskrit|Urdu|Gujarati|Tamil|Telugu)\b/i);
  const language = langMatch ? langMatch[1] : null;

  return { language, wpm, subject: name };
}

/**
 * Format a date-ish value for display. The backend may already send a
 * formatted string (issueDate) or an ISO timestamp. Returns null if absent.
 */
export function formatDate(value) {
  const v = clean(value);
  if (!v) return null;
  // Already human-formatted (contains letters) → show as-is.
  if (/[a-zA-Z]/.test(v) && !/^\d{4}-\d{2}-\d{2}T/.test(v)) return v;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

/**
 * Split a free-text marks string like "450/500" into { obtained, total }.
 * Returns the raw string under `raw` and nulls for the parts when it isn't a
 * simple fraction — again, no fabrication.
 */
export function parseMarks(marks) {
  const raw = clean(marks);
  if (!raw) return { raw: null, obtained: null, total: null };
  const m = raw.match(/^\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*$/);
  if (!m) return { raw, obtained: null, total: null };
  return { raw, obtained: m[1], total: m[2] };
}

/** Public assets used across both certificate formats. */
export const CERT_ASSETS = {
  logo: '/logos/AICIT-logo.png',
  sign1: '/logos/sign1.png',
  sign2: '/logos/sign2.png',
};
