import React from 'react';

/**
 * Unified status badge for every entity in the portals. The enum→style maps
 * below encode the EXACT status values used by the backend and existing pages
 * (institute, student, certificate, batch payment, batch lifecycle). Colors are
 * tuned for consistency; the dot gives a quick visual scan.
 */

const STYLES = {
  // Institute
  PENDING_REVIEW: ['bg-amber-50 text-amber-700 ring-amber-200',  '#f59e0b', 'Pending Review'],
  APPROVED:       ['bg-trust-50 text-trust-700 ring-trust-200',  '#16a34a', 'Approved'],
  SUSPENDED:      ['bg-orange-50 text-orange-700 ring-orange-200','#ea580c', 'Suspended'],
  DEACTIVATED:    ['bg-gray-100 text-gray-600 ring-gray-200',     '#6b7280', 'Deactivated'],
  REJECTED:       ['bg-red-50 text-red-700 ring-red-200',         '#e53e3e', 'Rejected'],

  // Student
  ACTIVE:    ['bg-trust-50 text-trust-700 ring-trust-200', '#16a34a', 'Active'],
  INACTIVE:  ['bg-gray-100 text-gray-600 ring-gray-200',   '#6b7280', 'Inactive'],
  COMPLETED: ['bg-primary-50 text-primary-700 ring-primary-200', '#1d4ed8', 'Completed'],
  DROPPED:   ['bg-red-50 text-red-700 ring-red-200',       '#e53e3e', 'Dropped'],

  // Certificate
  REQUESTED:    ['bg-amber-50 text-amber-700 ring-amber-200',     '#f59e0b', 'Requested'],
  UNDER_REVIEW: ['bg-primary-50 text-primary-700 ring-primary-200','#1d4ed8', 'Under Review'],
  ISSUED:       ['bg-emerald-50 text-emerald-700 ring-emerald-200','#059669', 'Issued'],
  REVOKED:      ['bg-gray-100 text-gray-600 ring-gray-200',       '#6b7280', 'Revoked'],

  // Batch payment
  PENDING:              ['bg-gray-100 text-gray-600 ring-gray-200',   '#6b7280', 'Pending'],
  UTR_SUBMITTED:        ['bg-primary-50 text-primary-700 ring-primary-200','#1d4ed8', 'UTR Submitted'],
  VERIFICATION_PENDING: ['bg-gold-50 text-gold-700 ring-gold-200',    '#d97706', 'Awaiting Verify'],
  PAID:                 ['bg-trust-50 text-trust-700 ring-trust-200', '#16a34a', 'Paid'],

  // Batch lifecycle
  DRAFT:      ['bg-gray-100 text-gray-600 ring-gray-200',   '#6b7280', 'Draft'],
  VALIDATED:  ['bg-gray-100 text-gray-600 ring-gray-200',   '#6b7280', 'Validated'],
  SUBMITTED:  ['bg-primary-50 text-primary-700 ring-primary-200', '#1d4ed8', 'Submitted'],
  PROCESSING: ['bg-amber-50 text-amber-700 ring-amber-200', '#f59e0b', 'Processing'],
  GENERATED:  ['bg-emerald-50 text-emerald-700 ring-emerald-200', '#059669', 'Generated'],
};

const FALLBACK = ['bg-gray-100 text-gray-600 ring-gray-200', '#6b7280', null];

/**
 * props:
 *  - status : the enum string
 *  - label  : optional override label
 *  - dot    : show the leading dot (default true)
 *  - size   : 'sm' | 'md' (default 'md')
 */
export default function StatusBadge({ status, label, dot = true, size = 'md' }) {
  const [cls, color, defaultLabel] = STYLES[status] || FALLBACK;
  const text = label ?? defaultLabel ?? (status ? String(status).replace(/_/g, ' ') : '—');
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset
                      whitespace-nowrap ${pad} ${cls}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />}
      {text}
    </span>
  );
}
