import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Reusable, responsive course search + select combobox.
 *
 * Server-side search (debounced) so it stays fast against the 300+ course
 * catalog — it never loads the whole list. Works in any workflow that selects
 * a course (admission, enrollment, certificate request, etc.).
 *
 * Props:
 *   fetcher   (required) async ({search,page,size}) => axios body
 *             Pass searchPublicCourses or searchCourses from the services.
 *             Expected shape: { data: { content, totalElements, totalPages, number } }
 *   value     selected course object ({ id, name, code, durationDisplay }) or null
 *   onChange  (course|null) => void — called when the user picks/clears
 *   placeholder, label, required, disabled
 *   pageSize  results per page (default 8)
 */
export default function CourseFinder({
  fetcher,
  value = null,
  onChange,
  placeholder = 'Search course by name or code…',
  label,
  required = false,
  disabled = false,
  pageSize = 8,
}) {
  const [query, setQuery]       = useState('');
  const [open, setOpen]         = useState(false);
  const [results, setResults]   = useState([]);
  const [page, setPage]         = useState(0);
  const [totalPages, setTotal]  = useState(0);
  const [status, setStatus]     = useState('idle');   // idle | loading | error | done
  const [error, setError]       = useState('');
  const [active, setActive]     = useState(-1);        // keyboard-highlighted index

  const boxRef   = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const reqIdRef = useRef(0);

  // ── Fetch (debounced, race-safe) ──────────────────────────
  const runSearch = useCallback(async (q, pg) => {
    const reqId = ++reqIdRef.current;
    setStatus('loading'); setError('');
    try {
      const res = await fetcher({ search: q, page: pg, size: pageSize });
      if (reqId !== reqIdRef.current) return;           // stale response — ignore
      const body = res?.data ?? {};
      setResults(body.content ?? []);
      setTotal(body.totalPages ?? 0);
      setStatus('done');
      setActive((body.content ?? []).length ? 0 : -1);
    } catch (e) {
      if (reqId !== reqIdRef.current) return;
      setStatus('error');
      setError(e?.message || 'Could not load courses.');
      setResults([]);
    }
  }, [fetcher, pageSize]);

  // Debounce query changes
  useEffect(() => {
    if (!open) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(0);
      runSearch(query.trim(), 0);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, open]);

  // Page changes (no debounce)
  useEffect(() => {
    if (open && status !== 'idle') runSearch(query.trim(), page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Close on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const openAndFocus = () => {
    if (disabled) return;
    setOpen(true);
    if (status === 'idle') runSearch(query.trim(), 0);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const pick = (course) => {
    onChange?.(course);
    setOpen(false);
    setQuery('');
  };

  const clear = () => { onChange?.(null); setQuery(''); };

  // Keyboard navigation
  const onKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) { openAndFocus(); return; }
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter')  { e.preventDefault(); if (results[active]) pick(results[active]); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  return (
    <div ref={boxRef} className="relative">
      {label && (
        <label className={`block text-sm font-semibold text-gray-700 mb-1.5 ${required ? "after:content-['_*'] after:text-red-500" : ''}`}>
          {label}
        </label>
      )}

      {/* Selected value chip OR trigger */}
      {value ? (
        <div className={`flex items-center justify-between gap-2 w-full px-4 py-3 text-sm border rounded-xl bg-white
                        ${disabled ? 'border-gray-200 opacity-70' : 'border-primary-300'}`}>
          <span className="min-w-0">
            <span className="font-semibold text-primary-900 truncate block">{value.name}</span>
            <span className="text-xs text-gray-400">
              {value.code}{value.durationDisplay ? ` · ${value.durationDisplay}` : ''}
            </span>
          </span>
          {!disabled && (
            <button type="button" onClick={clear} aria-label="Clear selected course"
              className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls="course-finder-listbox"
            autoComplete="off"
            disabled={disabled}
            value={query}
            placeholder={placeholder}
            onFocus={openAndFocus}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onKeyDown={onKeyDown}
            className="w-full pl-9 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                       disabled:bg-gray-50 disabled:opacity-70"
          />
        </div>
      )}

      {/* Dropdown */}
      {open && !value && (
        <div
          id="course-finder-listbox"
          role="listbox"
          className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-card-hover
                     max-h-80 overflow-auto">
          {status === 'loading' && (
            <div className="flex items-center gap-2 px-4 py-4 text-sm text-gray-400">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Searching…
            </div>
          )}

          {status === 'error' && (
            <div className="px-4 py-4 text-sm text-red-600">
              {error} <button type="button" onClick={() => runSearch(query.trim(), page)}
                className="underline font-semibold ml-1">Retry</button>
            </div>
          )}

          {status === 'done' && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              No courses found{query ? ` for “${query}”` : ''}.
            </div>
          )}

          {status === 'done' && results.map((c, i) => (
            <button
              type="button"
              key={c.id}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(c)}
              className={`w-full text-left px-4 py-2.5 border-b border-gray-50 last:border-0 transition-colors
                         ${i === active ? 'bg-primary-50' : 'hover:bg-gray-50'}`}>
              <div className="text-sm font-medium text-gray-900 truncate">{c.name}</div>
              <div className="text-xs text-gray-400 flex gap-2 mt-0.5">
                <span className="font-mono">{c.code}</span>
                {c.durationDisplay && <span>· {c.durationDisplay}</span>}
                {c.category && <span className="truncate">· {c.category}</span>}
              </div>
            </button>
          ))}

          {/* Pager */}
          {status === 'done' && totalPages > 1 && (
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 sticky bottom-0 text-xs">
              <button type="button" disabled={page === 0}
                onClick={() => setPage(p => Math.max(p - 1, 0))}
                className="px-2 py-1 rounded disabled:opacity-40 hover:bg-gray-200 font-semibold">← Prev</button>
              <span className="text-gray-500">Page {page + 1} / {totalPages}</span>
              <button type="button" disabled={page >= totalPages - 1}
                onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
                className="px-2 py-1 rounded disabled:opacity-40 hover:bg-gray-200 font-semibold">Next →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
