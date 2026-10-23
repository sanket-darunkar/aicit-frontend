import React from 'react';
import { Link } from 'react-router-dom';
import { fmt } from './dashboardTheme.js';

/**
 * Premium KPI stat card.
 *
 * props:
 *  - label     : string
 *  - value     : number | string
 *  - icon      : JSX (svg) or emoji string
 *  - accent    : tailwind gradient classes for the icon tile (e.g. 'from-primary-600 to-primary-800')
 *  - to        : optional link target (whole card becomes clickable)
 *  - trend     : optional { value: number, label: string } — shows a delta chip
 *  - loading   : boolean
 *  - hint      : optional small helper text under the value
 */
export default function StatCard({ label, value, icon, accent = 'from-primary-600 to-primary-800',
                                   to, trend, loading, hint }) {
  const inner = (
    <>
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${accent}
                        flex items-center justify-center text-white text-lg shadow-sm`}>
          {icon}
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full
            ${trend.value >= 0 ? 'bg-trust-100 text-trust-700' : 'bg-red-100 text-red-700'}`}>
            {trend.value >= 0 ? '▲' : '▼'} {Math.abs(trend.value)}{trend.label}
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-heading font-extrabold text-gray-900 tabular-nums tracking-tight">
        {loading
          ? <span className="inline-block w-14 h-7 bg-gray-200 rounded animate-pulse align-middle" />
          : (typeof value === 'number' ? fmt(value) : (value ?? '—'))}
      </p>
      <p className="mt-1 text-xs font-semibold text-gray-500">{label}</p>
      {hint && <p className="mt-2 text-[11px] text-gray-400">{hint}</p>}
    </>
  );

  const base = `relative overflow-hidden bg-white rounded-2xl border border-gray-100
                shadow-card p-5 transition-all duration-300`;

  if (to) {
    return (
      <Link to={to}
        className={`${base} hover:shadow-card-hover hover:-translate-y-0.5 group block`}>
        {inner}
        <span className="absolute bottom-3 right-4 text-gray-300 group-hover:text-primary-500
                         transition-colors text-sm" aria-hidden>→</span>
      </Link>
    );
  }
  return <div className={base}>{inner}</div>;
}
