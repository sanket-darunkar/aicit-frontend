import React from 'react';

/**
 * Horizontally scrollable filter pills (touch-friendly, no overflow on mobile).
 *
 * props:
 *  - options : [{ value, label, count? }]
 *  - value   : currently selected value
 *  - onChange: (value) => void
 */
export default function FilterPills({ options = [], value, onChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 py-0.5">
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value ?? 'all'}
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold
                        whitespace-nowrap flex-shrink-0 border transition-all duration-150
              ${active
                ? 'bg-primary-800 text-white border-primary-800 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700'}`}>
            {opt.label}
            {opt.count != null && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full tabular-nums
                ${active ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
