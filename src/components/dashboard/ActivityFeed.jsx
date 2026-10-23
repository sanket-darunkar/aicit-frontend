import React from 'react';

/** Relative "time ago" formatter. */
function timeAgo(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const s = Math.floor((Date.now() - then) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/**
 * Vertical timeline-style activity feed.
 *
 * props:
 *  - items   : [{ id, title, meta, time (ISO), dotColor, icon }]
 *  - loading : boolean
 *  - empty   : string shown when there are no items
 */
export default function ActivityFeed({ items = [], loading, empty = 'No recent activity' }) {
  if (loading) {
    return <ul className="space-y-4">
      {[0, 1, 2, 3].map(i => (
        <li key={i} className="flex gap-3">
          <div className="w-2 h-2 mt-1.5 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 bg-gray-100 rounded animate-pulse w-3/4" />
            <div className="h-2.5 bg-gray-50 rounded animate-pulse w-1/2" />
          </div>
        </li>
      ))}
    </ul>;
  }

  if (!items.length) {
    return <div className="py-8 text-center">
      <div className="w-14 h-14 mx-auto rounded-full bg-gray-50 flex items-center justify-center text-2xl mb-2">🕊️</div>
      <p className="text-sm text-gray-400">{empty}</p>
    </div>;
  }

  return (
    <ul className="relative space-y-1">
      {items.map((it, i) => (
        <li key={it.id ?? i} className="relative flex gap-3 pb-4 last:pb-0">
          {/* connector line */}
          {i !== items.length - 1 && (
            <span className="absolute left-[5px] top-4 bottom-0 w-px bg-gray-100" aria-hidden />
          )}
          <span className="relative z-10 w-2.5 h-2.5 mt-1.5 rounded-full flex-shrink-0 ring-4 ring-white"
                style={{ background: it.dotColor || '#1d4ed8' }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 leading-snug">
              {it.icon && <span className="mr-1">{it.icon}</span>}
              {it.title}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
              {it.meta && <span className="truncate">{it.meta}</span>}
              {it.meta && it.time && <span className="text-gray-300">·</span>}
              {it.time && <span>{timeAgo(it.time)}</span>}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
