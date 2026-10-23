import React from 'react';

/**
 * Consistent pager used by every list page.
 *
 * props:
 *  - page        : current 0-based page index
 *  - totalPages  : total number of pages
 *  - onChange    : (newPage) => void
 *  - totalElements : optional total count for the "showing" label
 *  - pageSize    : optional page size for the "showing" label
 */
export default function Pagination({ page = 0, totalPages = 1, onChange, totalElements, pageSize }) {
  if (!totalPages || totalPages <= 1) {
    // Still show the count summary when there is data but a single page.
    if (totalElements) {
      return (
        <div className="flex items-center justify-center sm:justify-end px-1 py-3">
          <p className="text-xs text-gray-400">{totalElements} total</p>
        </div>
      );
    }
    return null;
  }

  const from = page * (pageSize || 0) + 1;
  const to = Math.min((page + 1) * (pageSize || 0), totalElements || 0);

  return (
    <div className="flex items-center justify-between gap-3 px-1 py-3 flex-wrap">
      <p className="text-xs text-gray-400 order-2 sm:order-1">
        {pageSize && totalElements
          ? <>Showing <span className="font-semibold text-gray-600">{from}–{to}</span> of {totalElements}</>
          : <>Page {page + 1} of {totalPages}</>}
      </p>
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <button
          onClick={() => onChange(Math.max(0, page - 1))}
          disabled={page <= 0}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium
                     text-gray-600 bg-white border border-gray-200 hover:bg-surface-50
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          <span className="hidden sm:inline">Previous</span>
        </button>
        <span className="px-3 py-1.5 rounded-lg text-sm font-semibold text-primary-800 bg-primary-50 tabular-nums">
          {page + 1} / {totalPages}
        </span>
        <button
          onClick={() => onChange(Math.min(totalPages - 1, page + 1))}
          disabled={page >= totalPages - 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium
                     text-gray-600 bg-white border border-gray-200 hover:bg-surface-50
                     disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <span className="hidden sm:inline">Next</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>
      </div>
    </div>
  );
}
