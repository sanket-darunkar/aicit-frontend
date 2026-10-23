import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Consistent titled panel used across dashboards.
 *
 * props:
 *  - title    : string
 *  - subtitle : optional string
 *  - icon     : optional JSX/emoji
 *  - action   : optional { label, to } rendered as a link in the header
 *  - right    : optional JSX rendered on the header's right (overrides action)
 *  - padded   : boolean (default true) — body padding
 *  - className: extra classes on the outer card
 */
export default function SectionCard({ title, subtitle, icon, action, right,
                                      padded = true, className = '', children }) {
  return (
    <section className={`bg-white rounded-2xl border border-gray-100 shadow-card ${className}`}>
      {(title || right || action) && (
        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && (
              <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-700
                               flex items-center justify-center text-sm flex-shrink-0">
                {icon}
              </span>
            )}
            <div className="min-w-0">
              <h2 className="text-sm font-heading font-bold text-primary-900 truncate">{title}</h2>
              {subtitle && <p className="text-[11px] text-gray-400 truncate">{subtitle}</p>}
            </div>
          </div>
          {right
            ? right
            : action && (
              <Link to={action.to}
                className="text-xs font-semibold text-primary-700 hover:text-primary-900
                           inline-flex items-center gap-1 flex-shrink-0">
                {action.label} <span aria-hidden>→</span>
              </Link>
            )}
        </header>
      )}
      <div className={padded ? 'p-5' : ''}>{children}</div>
    </section>
  );
}
