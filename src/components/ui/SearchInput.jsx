import React, { useState, useEffect } from 'react';

/**
 * Search input with a leading icon and a clear button.
 *
 * Two modes:
 *  - Controlled: pass `value` + `onChange`. `onSubmit()` fires on Enter.
 *  - URL-driven: pass `defaultValue` + `onSubmit(value)` (fires on Enter and on clear).
 */
export default function SearchInput({
  value, onChange, defaultValue, onSubmit, placeholder = 'Search…', className = '',
}) {
  const uncontrolled = value === undefined;
  const [local, setLocal] = useState(defaultValue ?? '');

  useEffect(() => { if (uncontrolled) setLocal(defaultValue ?? ''); }, [defaultValue, uncontrolled]);

  const current = uncontrolled ? local : value;

  const set = (v) => { if (uncontrolled) setLocal(v); onChange?.(v); };
  const submit = () => onSubmit?.(current);
  const clear = () => { set(''); onSubmit?.(''); };

  return (
    <div className={`relative ${className}`}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
           fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        type="text"
        value={current}
        onChange={(e) => set(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl bg-white
                   text-gray-900 placeholder:text-gray-400
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                   transition-shadow"
      />
      {current && (
        <button onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
          aria-label="Clear search">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
