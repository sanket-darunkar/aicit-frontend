import React from 'react';

/**
 * A responsive toolbar row that holds filters/search/actions above a table.
 * Stacks vertically on mobile, spreads out on desktop. Prevents overflow.
 */
export default function Toolbar({ children, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 ${className}`}>
      {children}
    </div>
  );
}
