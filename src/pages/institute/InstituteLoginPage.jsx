import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInstituteAuth } from '../../contexts/InstituteAuthContext.jsx';
import { BASE_URL } from '../../services/api.js';

// ── Forgot Password Modal ─────────────────────────────────────
function ForgotPasswordModal({ onClose }) {
  const [email,   setEmail]   = useState('');
  const [status,  setStatus]  = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res  = await fetch(`${BASE_URL}/api/public/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      setStatus('sent');
      setMessage(data.message || 'If that email is registered, a new password has been sent.');
    } catch {
      setStatus('sent');
      setMessage('If that email is registered, a new password has been sent.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-hero w-full max-w-sm p-7">
        <div className="flex items-center justify-between mb-5">
          <h3 className="heading-sm text-primary-900">Reset Password</h3>
          <button onClick={onClose} aria-label="Close"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-surface-100 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {status === 'sent' ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-trust-50 border border-trust-100 rounded-2xl">
              <svg className="w-5 h-5 text-trust-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
              </svg>
              <p className="text-sm text-trust-800">{message}</p>
            </div>
            <p className="text-xs text-gray-500">
              Check your inbox. Use the new password to log in, then change it from your profile.
            </p>
            <button onClick={onClose} className="btn-primary w-full">Back to Login</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5">
              Enter your registered email and we'll send a new temporary password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="institute@example.com" className="input" />
              </div>
              <button type="submit" disabled={status === 'loading'} className="btn-primary w-full disabled:opacity-60">
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Sending...
                  </>
                ) : 'Send New Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function InstituteLoginPage() {
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPass,   setShowPass]   = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const { login, loading, error, isAuthenticated } = useInstituteAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/institute/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate('/institute/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-primary-950 flex items-center justify-center px-4 py-12
                    relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern bg-dot-md opacity-10" />
      <div className="absolute inset-0 hero-pattern" />

      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <img src="/logos/AICIT logo.jpeg" alt="AICIT"
              className="h-16 w-16 rounded-2xl object-contain bg-white p-1.5 shadow-xl"
              onError={e => { e.target.style.display='none'; }}
            />
            <div>
              <div className="text-white font-heading font-extrabold text-2xl tracking-wider">AICIT</div>
              <div className="text-blue-400 text-xs font-medium tracking-widest uppercase mt-0.5">
                Institute Portal
              </div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-hero p-8">
          <div className="mb-6">
            <h1 className="heading-sm text-primary-900">Institute Login</h1>
            <p className="text-sm text-gray-500 mt-1">Sign in with your AICIT institute credentials</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 p-3.5 bg-red-50 border border-red-200
                            rounded-xl text-sm text-red-700">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="inst-email" className="label">Email Address</label>
              <input id="inst-email" type="email" required autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="institute@example.com"
                className="input" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="inst-pass" className="label mb-0">Password</label>
                <button type="button" onClick={() => setShowForgot(true)}
                  className="text-xs text-primary-600 hover:text-primary-800 hover:underline transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input id="inst-pass" type={showPass ? 'text' : 'password'} required
                  autoComplete="current-password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pr-11" />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPass ? 'Hide password' : 'Show password'}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {showPass
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                      : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-60">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In to Institute Portal'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-gray-500">
            Not registered yet?{' '}
            <Link to="/register-institute" className="text-primary-700 font-semibold hover:underline">
              Register your institute →
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-blue-500">
          <Link to="/" className="hover:text-blue-300 transition-colors">← Back to Public Website</Link>
        </p>
      </div>
    </div>
  );
}
