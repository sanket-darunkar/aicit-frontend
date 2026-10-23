/**
 * AICIT – Axios API client
 * - Two token stores: sessionStorage for admin, sessionStorage for institute
 * - Interceptors auto-attach Bearer token
 * - On 401: clears token and dispatches redirect event
 */
import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

// ── Token keys ────────────────────────────────────────────────
export const ADMIN_TOKEN_KEY     = 'aicit_admin_token';
export const INSTITUTE_TOKEN_KEY = 'aicit_institute_token';
export const ADMIN_USER_KEY      = 'aicit_admin_user';
export const INSTITUTE_USER_KEY  = 'aicit_institute_user';

// ── Token helpers ─────────────────────────────────────────────
export const auth = {
  getAdminToken:     ()    => sessionStorage.getItem(ADMIN_TOKEN_KEY),
  setAdminToken:     (t)   => sessionStorage.setItem(ADMIN_TOKEN_KEY, t),
  clearAdmin:        ()    => { sessionStorage.removeItem(ADMIN_TOKEN_KEY); sessionStorage.removeItem(ADMIN_USER_KEY); },
  getAdminUser:      ()    => { const u = sessionStorage.getItem(ADMIN_USER_KEY); return u ? JSON.parse(u) : null; },
  setAdminUser:      (u)   => sessionStorage.setItem(ADMIN_USER_KEY, JSON.stringify(u)),

  getInstituteToken: ()    => sessionStorage.getItem(INSTITUTE_TOKEN_KEY),
  setInstituteToken: (t)   => sessionStorage.setItem(INSTITUTE_TOKEN_KEY, t),
  clearInstitute:    ()    => { sessionStorage.removeItem(INSTITUTE_TOKEN_KEY); sessionStorage.removeItem(INSTITUTE_USER_KEY); },
  getInstituteUser:  ()    => { const u = sessionStorage.getItem(INSTITUTE_USER_KEY); return u ? JSON.parse(u) : null; },
  setInstituteUser:  (u)   => sessionStorage.setItem(INSTITUTE_USER_KEY, JSON.stringify(u)),
};

// ── Factory: create an axios instance with auth interceptor ───
// Render's free tier sleeps after idle and a cold start takes up to ~150s.
// Use a long timeout so the first request after a sleep survives the wake-up
// instead of failing with a timeout error.
const COLD_START_TIMEOUT = 180000; // 180s

function createClient(getToken, onUnauthorized) {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: COLD_START_TIMEOUT,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use((config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  client.interceptors.response.use(
    (res) => res.data,  // unwrap: return body directly
    (err) => {
      const url = err.config?.url ?? '';
      const isLoginEndpoint = url.includes('/api/auth/');
      // Only treat 401 as "session expired" on non-login endpoints.
      // On login endpoints a 401 just means wrong credentials — let the
      // calling code handle it via the rejected promise.
      if (err.response?.status === 401 && !isLoginEndpoint) {
        onUnauthorized();
        window.dispatchEvent(new CustomEvent('aicit:unauthorized'));
      }
      const message = err.response?.data?.message
                   ?? err.message
                   ?? 'Request failed';
      return Promise.reject(new Error(message));
    }
  );

  return client;
}

// ── Admin API client ──────────────────────────────────────────
export const adminApi = createClient(
  auth.getAdminToken,
  auth.clearAdmin
);

// ── Institute API client ──────────────────────────────────────
export const instituteApi = createClient(
  auth.getInstituteToken,
  auth.clearInstitute
);

// ── Public API client (no auth) ───────────────────────────────
export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: COLD_START_TIMEOUT, // tolerate backend cold-starts on the first request
  headers: { 'Content-Type': 'application/json' },
});
publicApi.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(new Error(err.response?.data?.message ?? err.message ?? 'Request failed'))
);

/**
 * Fire-and-forget warm-up ping. Call this as soon as a login page mounts so
 * the backend starts booting while the user is still typing their credentials
 * — by the time they click "Sign In" the server is usually already awake.
 * Never throws; safe to call anywhere.
 */
export function warmUpBackend() {
  try {
    fetch(`${BASE_URL}/api/public/health`, { method: 'GET', mode: 'cors' }).catch(() => {});
  } catch (_) { /* ignore */ }
}
