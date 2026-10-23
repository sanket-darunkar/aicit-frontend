import React from 'react';
import { Link } from 'react-router-dom';

/** Inline spinner (replaces the copy-pasted SVG across pages). */
export function Spinner({ className = 'w-6 h-6', label }) {
  return (
    <span className="inline-flex items-center gap-2" role="status" aria-live="polite">
      <svg className={`animate-spin text-primary-600 ${className}`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      {label && <span className="text-sm text-gray-500">{label}</span>}
    </span>
  );
}

/** Centered loading block for page/section bodies. */
export function LoadingState({ label = 'Loading…', rows }) {
  if (rows) {
    return (
      <div className="space-y-3 animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-14 rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }
  return (
    <div className="py-16 flex items-center justify-center">
      <Spinner className="w-8 h-8" label={label} />
    </div>
  );
}

/** Friendly empty state with optional CTA. */
export function EmptyState({ icon = '📭', title = 'Nothing here yet', message, action }) {
  return (
    <div className="py-14 px-6 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center text-3xl mb-3">
        {icon}
      </div>
      <p className="text-base font-heading font-bold text-gray-700">{title}</p>
      {message && <p className="text-sm text-gray-400 mt-1 max-w-sm">{message}</p>}
      {action && (
        action.to
          ? <Link to={action.to} className="btn-primary mt-5 text-sm">{action.label}</Link>
          : <button onClick={action.onClick} className="btn-primary mt-5 text-sm">{action.label}</button>
      )}
    </div>
  );
}

/** Error banner (inline) — non-blocking. */
export function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <p className="text-sm text-red-700 flex-1">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm font-semibold text-red-700 hover:text-red-900 flex-shrink-0">
          Retry
        </button>
      )}
    </div>
  );
}

/** Full-page error (for detail pages that can't load their primary entity). */
export function ErrorState({ message = 'Something went wrong.', onRetry, backTo, backLabel = 'Go back' }) {
  return (
    <div className="py-16 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-3xl mb-3">⚠️</div>
      <p className="text-base font-heading font-bold text-gray-700">{message}</p>
      <div className="flex items-center gap-2 mt-5">
        {onRetry && <button onClick={onRetry} className="btn-outline text-sm">Retry</button>}
        {backTo && <Link to={backTo} className="btn-ghost text-sm">{backLabel}</Link>}
      </div>
    </div>
  );
}
