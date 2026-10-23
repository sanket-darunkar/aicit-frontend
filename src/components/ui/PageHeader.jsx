import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Consistent page header with optional breadcrumbs, title, subtitle,
 * and a right-aligned actions slot.
 *
 * props:
 *  - title       : string
 *  - subtitle    : optional string / JSX
 *  - breadcrumbs : optional [{ label, to? }]
 *  - actions     : optional JSX (buttons) rendered on the right
 *  - icon        : optional emoji/JSX shown in a tile beside the title
 */
export default function PageHeader({ title, subtitle, breadcrumbs, actions, icon }) {
  return (
    <div className="space-y-3">
      {breadcrumbs?.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap" aria-label="Breadcrumb">
          {breadcrumbs.map((b, i) => {
            const last = i === breadcrumbs.length - 1;
            return (
              <span key={i} className="flex items-center gap-1.5">
                {b.to && !last
                  ? <Link to={b.to} className="hover:text-primary-700 transition-colors">{b.label}</Link>
                  : <span className={last ? 'text-gray-600 font-medium' : ''}>{b.label}</span>}
                {!last && <span className="text-gray-300" aria-hidden>/</span>}
              </span>
            );
          })}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <span className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 text-lg
                             flex items-center justify-center flex-shrink-0">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-primary-900 truncate">
              {title}
            </h1>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
}
