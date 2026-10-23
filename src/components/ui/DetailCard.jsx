import React from 'react';

/**
 * A titled detail panel with a label/value grid — used by all detail pages.
 *
 * <DetailCard title="Institute Details" icon="🏫">
 *   <DetailRow label="Code" value={inst.code} />
 *   ...
 * </DetailCard>
 */
export function DetailCard({ title, subtitle, icon, actions, children, className = '' }) {
  return (
    <section className={`bg-white rounded-2xl border border-gray-100 shadow-card ${className}`}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && (
              <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-700
                               flex items-center justify-center text-sm flex-shrink-0">{icon}</span>
            )}
            <div className="min-w-0">
              <h2 className="text-sm font-heading font-bold text-primary-900 truncate">{title}</h2>
              {subtitle && <p className="text-[11px] text-gray-400 truncate">{subtitle}</p>}
            </div>
          </div>
          {actions}
        </header>
      )}
      <div className="divide-y divide-gray-50">{children}</div>
    </section>
  );
}

/** A single label/value row. `value` can be any node (string, badge, link). */
export function DetailRow({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3">
      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide flex-shrink-0 pt-0.5">{label}</dt>
      <dd className={`text-sm text-gray-800 text-right min-w-0 break-words ${mono ? 'font-mono' : ''}`}>
        {value ?? <span className="text-gray-300">—</span>}
      </dd>
    </div>
  );
}
