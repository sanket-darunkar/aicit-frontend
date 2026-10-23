/**
 * Shared dashboard design tokens — mirrors the Tailwind palette so charts and
 * inline SVGs stay consistent with the rest of the UI.
 */
export const CHART_COLORS = {
  primary: '#1d4ed8',
  primaryDark: '#1e3a8a',
  blue: '#3b82f6',
  sky: '#60a5fa',
  green: '#16a34a',
  trust: '#22c55e',
  amber: '#f59e0b',
  gold: '#fbbf24',
  red: '#e53e3e',
  purple: '#7c3aed',
  slate: '#94a3b8',
  slateLight: '#cbd5e1',
};

/** Certificate status → color + label */
export const CERT_STATUS_META = {
  REQUESTED:     { color: CHART_COLORS.amber,  label: 'Requested' },
  UNDER_REVIEW:  { color: CHART_COLORS.blue,   label: 'Under Review' },
  APPROVED:      { color: CHART_COLORS.sky,    label: 'Approved' },
  ISSUED:        { color: CHART_COLORS.green,  label: 'Issued' },
  REJECTED:      { color: CHART_COLORS.red,    label: 'Rejected' },
  REVOKED:       { color: CHART_COLORS.slate,  label: 'Revoked' },
};

/** Payment status → color + label */
export const PAYMENT_STATUS_META = {
  PENDING:              { color: CHART_COLORS.slateLight, label: 'Pending' },
  UTR_SUBMITTED:        { color: CHART_COLORS.amber,      label: 'UTR Submitted' },
  VERIFICATION_PENDING: { color: CHART_COLORS.gold,       label: 'Awaiting Verify' },
  PAID:                 { color: CHART_COLORS.green,      label: 'Paid' },
  REJECTED:             { color: CHART_COLORS.red,        label: 'Rejected' },
};

/** Institute status → color + label */
export const INSTITUTE_STATUS_META = {
  PENDING_REVIEW: { color: CHART_COLORS.amber,  label: 'Pending' },
  APPROVED:       { color: CHART_COLORS.green,  label: 'Approved' },
  SUSPENDED:      { color: CHART_COLORS.red,    label: 'Suspended' },
  DEACTIVATED:    { color: CHART_COLORS.slate,  label: 'Deactivated' },
  REJECTED:       { color: CHART_COLORS.slateLight, label: 'Rejected' },
};

/** Format a number with thousands separators; dash for null/undefined. */
export function fmt(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return Number(n).toLocaleString('en-IN');
}

/** Format currency in INR. */
export function inr(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return '₹' + Number(n).toLocaleString('en-IN');
}
