import React, { useEffect } from 'react';

/**
 * Unified modal shell. Centered dialog with backdrop blur, sticky header,
 * scrollable body, and optional footer. Mobile-first: full width with margins,
 * caps at a configurable max width.
 *
 * props:
 *  - open      : boolean
 *  - onClose   : () => void (backdrop + ✕ + Esc)
 *  - title     : string
 *  - subtitle  : optional string
 *  - size      : 'sm' | 'md' | 'lg' | 'xl' (default 'md')
 *  - footer    : optional JSX pinned to the bottom
 *  - children  : body
 */
const SIZES = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export default function Modal({ open, onClose, title, subtitle, size = 'md', footer, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
         role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-primary-950/50 backdrop-blur-sm animate-fade-in"
           onClick={onClose} />
      <div className={`relative w-full ${SIZES[size]} bg-white rounded-t-3xl sm:rounded-2xl
                       shadow-hero max-h-[92vh] flex flex-col animate-slide-up`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="min-w-0">
            <h3 className="text-base font-heading font-bold text-primary-900 truncate">{title}</h3>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose}
            className="p-1.5 -mr-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-surface-100
                       transition-colors flex-shrink-0" aria-label="Close">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="px-5 sm:px-6 py-5 overflow-y-auto">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="px-5 sm:px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
