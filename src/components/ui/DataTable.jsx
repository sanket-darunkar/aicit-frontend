import React from 'react';
import { LoadingState, EmptyState } from './states.jsx';

/**
 * Responsive data table.
 *  - Desktop (md+): a clean <table>.
 *  - Mobile (<md): each row becomes a stacked card (label: value), preventing
 *    horizontal overflow and keeping everything touch-friendly.
 *
 * props:
 *  - columns : [{
 *      key,                      // unique
 *      header,                   // column title
 *      render: (row) => JSX,     // cell content
 *      align?: 'left'|'right'|'center',
 *      hideOnMobile?: boolean,   // omit from the mobile card
 *      primary?: boolean,        // used as the card's title row on mobile
 *      className?: string,       // extra <td>/<th> classes
 *      sortable?: boolean,
 *    }]
 *  - rows      : array
 *  - rowKey    : (row) => key
 *  - onRowClick: optional (row) => void (whole row/card clickable)
 *  - loading   : boolean
 *  - empty     : { icon, title, message, action } for EmptyState
 *  - sort      : optional { field, direction } for header indicators
 *  - onSort    : optional (key) => void
 */
export default function DataTable({
  columns, rows, rowKey, onRowClick, loading, empty = {},
  sort, onSort,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4">
        <LoadingState rows={6} />
      </div>
    );
  }
  if (!rows || rows.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card">
        <EmptyState {...empty} />
      </div>
    );
  }

  const alignCls = (a) => a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left';
  const primaryCol = columns.find(c => c.primary) || columns[0];
  const clickable = typeof onRowClick === 'function';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
      {/* ── Desktop table ── */}
      <div className="hidden md:block overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-50 border-b border-gray-100">
              {columns.map(col => {
                const isSorted = sort?.field === col.key;
                return (
                  <th key={col.key}
                    className={`px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider
                               ${alignCls(col.align)} ${col.sortable ? 'cursor-pointer select-none hover:text-primary-700' : ''}`}
                    onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}>
                    <span className="inline-flex items-center gap-1">
                      {col.header}
                      {col.sortable && (
                        <span className="text-gray-300">
                          {isSorted ? (sort.direction === 'asc' ? '▲' : '▼') : '⇅'}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map(row => (
              <tr key={rowKey(row)}
                  onClick={clickable ? () => onRowClick(row) : undefined}
                  className={`transition-colors ${clickable ? 'cursor-pointer hover:bg-primary-50/40' : 'hover:bg-surface-50'}`}>
                {columns.map(col => (
                  <td key={col.key} className={`px-4 py-3 text-sm text-gray-700 ${alignCls(col.align)} ${col.className || ''}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <ul className="md:hidden divide-y divide-gray-50">
        {rows.map(row => (
          <li key={rowKey(row)}
              onClick={clickable ? () => onRowClick(row) : undefined}
              className={`p-4 ${clickable ? 'active:bg-primary-50/40' : ''}`}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0 text-sm font-semibold text-gray-900">
                {primaryCol.render(row)}
              </div>
            </div>
            <dl className="grid grid-cols-1 gap-1.5">
              {columns.filter(c => c !== primaryCol && !c.hideOnMobile).map(col => (
                <div key={col.key} className="flex items-center justify-between gap-3">
                  <dt className="text-[11px] font-medium text-gray-400 uppercase tracking-wide flex-shrink-0">
                    {col.header}
                  </dt>
                  <dd className="text-sm text-gray-700 text-right min-w-0">{col.render(row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
