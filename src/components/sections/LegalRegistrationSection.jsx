/**
 * LegalRegistrationSection
 * ─────────────────────────
 * Public-facing "Legal, Registration & Quality" section.
 * All data comes from src/data/aicitCompliance.js.
 * No sensitive information is rendered.
 */
import React, { useState } from 'react';
import {
  ORGANIZATION,
  GOVERNMENT_REGISTRATIONS,
  CERTIFICATIONS,
  FUTURE_CERTIFICATIONS,
  CERT_STATUS,
} from '../../data/aicitCompliance.js';

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ status, note }) {
  const config = {
    [CERT_STATUS.ACTIVE]:               { label: 'Active',               cls: 'bg-green-100 text-green-800 border-green-200' },
    [CERT_STATUS.REGISTERED]:           { label: 'Registered',           cls: 'bg-blue-100 text-blue-800 border-blue-200' },
    [CERT_STATUS.EXPIRED]:              { label: 'Expired',              cls: 'bg-red-100 text-red-700 border-red-200' },
    [CERT_STATUS.PENDING_VERIFICATION]: { label: 'Pending Verification', cls: 'bg-amber-100 text-amber-800 border-amber-200' },
    [CERT_STATUS.PLANNED]:              { label: 'Planned / Pending',    cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  };
  const { label, cls } = config[status] || { label: status, cls: 'bg-gray-100 text-gray-600 border-gray-200' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full inline-block ${
        status === CERT_STATUS.ACTIVE || status === CERT_STATUS.REGISTERED
          ? 'bg-green-500' : status === CERT_STATUS.EXPIRED ? 'bg-red-400'
          : status === CERT_STATUS.PLANNED ? 'bg-gray-400' : 'bg-amber-400'
      }`} />
      {label}
    </span>
  );
}

// ── Row inside a card ──────────────────────────────────────────
function CardRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider sm:w-44 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-800">{value}</span>
    </div>
  );
}

// ── Government Registration Card ───────────────────────────────
function GovtCard({ reg }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card-hover transition-shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-700 px-6 py-4 flex items-center gap-3">
        <span className="text-3xl flex-shrink-0">{reg.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-heading font-bold text-base">{reg.title}</h3>
          <p className="text-blue-200 text-xs mt-0.5 truncate">{reg.subtitle}</p>
        </div>
        <StatusBadge status={reg.status} />
      </div>

      {/* Body */}
      <div className="px-6 py-4 space-y-0.5">
        {reg.registrationNumber && (
          <CardRow label="Registration No." value={reg.registrationNumber} />
        )}
        {reg.authority && (
          <CardRow label="Issuing Authority" value={reg.authority} />
        )}
        {reg.enterpriseType && (
          <CardRow label="Enterprise Type" value={reg.enterpriseType} />
        )}
        {reg.majorActivity && (
          <CardRow label="Major Activity" value={reg.majorActivity} />
        )}
        {reg.unitName && (
          <CardRow label="Unit / Sector" value={reg.unitName} />
        )}
        {reg.classificationYear && (
          <CardRow label="Classification Year" value={reg.classificationYear} />
        )}
        {reg.dateOfIncorporation && (
          <CardRow label="Date of Incorporation" value={reg.dateOfIncorporation} />
        )}
        {reg.dateOfRegistration && (
          <CardRow label="Date of Registration" value={reg.dateOfRegistration} />
        )}
        {reg.applicationDate && (
          <CardRow label="Application Date" value={reg.applicationDate} />
        )}

        {/* Society objective — expandable */}
        {reg.objective && (
          <div className="pt-2">
            <button onClick={() => setExpanded(e => !e)}
              className="text-xs text-primary-700 font-semibold hover:underline focus:outline-none">
              {expanded ? '▲ Hide objective' : '▼ View objective'}
            </button>
            {expanded && (
              <p className="mt-2 text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3">
                {reg.objective}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {reg.verificationUrl && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">Verify online</span>
          <a href={reg.verificationUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs font-semibold text-primary-700 hover:text-primary-900 hover:underline">
            {reg.portal || 'Verify →'}
          </a>
        </div>
      )}
    </div>
  );
}

// ── ISO / Certification Card ───────────────────────────────────
function CertCard({ cert }) {
  const isExpired = cert.status === CERT_STATUS.EXPIRED;
  const isPlanned = cert.status === CERT_STATUS.PLANNED;

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-card-hover transition-shadow overflow-hidden
      ${isExpired ? 'border-red-100' : isPlanned ? 'border-dashed border-gray-200' : 'border-gray-100'}`}>
      {/* Header */}
      <div className={`px-6 py-4 flex items-center gap-3
        ${isExpired ? 'bg-gradient-to-r from-red-50 to-orange-50'
          : isPlanned ? 'bg-gray-50'
          : 'bg-gradient-to-r from-green-50 to-emerald-50'}`}>
        <span className="text-3xl flex-shrink-0">{cert.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className={`font-heading font-bold text-base ${isExpired ? 'text-red-800' : isPlanned ? 'text-gray-500' : 'text-green-900'}`}>
            {cert.name}
          </h3>
          <p className="text-gray-500 text-xs mt-0.5">{cert.fullName}</p>
        </div>
        <StatusBadge status={cert.status} />
      </div>

      {/* Body */}
      <div className="px-6 py-4 space-y-0.5">
        {!isPlanned && (
          <>
            {cert.certificateNumber && <CardRow label="Certificate No." value={cert.certificateNumber} />}
            {cert.issuer && <CardRow label="Issuing Body" value={cert.issuer} />}
            {cert.accreditationBody && <CardRow label="Accreditation" value={cert.accreditationBody} />}
            {cert.issueDate && <CardRow label="Issue Date" value={cert.issueDate} />}
            {cert.expiryDate && <CardRow label="Expiry Date" value={cert.expiryDate} />}
            {cert.scope && <CardRow label="Scope" value={cert.scope} />}
          </>
        )}

        {cert.statusNote && (
          <div className={`mt-3 p-3 rounded-lg text-xs leading-relaxed
            ${isExpired ? 'bg-red-50 text-red-700 border border-red-100'
              : isPlanned ? 'bg-gray-50 text-gray-500 border border-gray-100'
              : 'bg-green-50 text-green-800 border border-green-100'}`}>
            {isExpired && <span className="font-bold">⚠ Notice: </span>}
            {isPlanned && <span className="font-bold">📅 Planned: </span>}
            {cert.statusNote}
          </div>
        )}
      </div>

      {/* Footer */}
      {cert.verificationUrl && !isPlanned && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">Issuer website</span>
          <a href={cert.verificationUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs font-semibold text-primary-700 hover:text-primary-900 hover:underline">
            Verify →
          </a>
        </div>
      )}
    </div>
  );
}

// ── Future certification placeholder card ──────────────────────
function FutureCard({ item }) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm p-5 flex items-start gap-4 opacity-80">
      <span className="text-3xl flex-shrink-0 opacity-50">{item.icon}</span>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div>
            <h4 className="text-sm font-heading font-bold text-gray-700">{item.name}</h4>
            <p className="text-xs text-gray-400 mt-0.5">{item.fullName}</p>
          </div>
          <StatusBadge status={item.status} />
        </div>
        <p className="text-xs text-gray-400 mt-2">{item.statusNote}</p>
      </div>
    </div>
  );
}

// ── Section heading ────────────────────────────────────────────
function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      {eyebrow && (
        <span className="inline-block px-4 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-widest mb-3 border border-primary-100">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary-900 leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

// ── Org identity banner ────────────────────────────────────────
function OrgBanner() {
  return (
    <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-2xl p-6 sm:p-8 text-white mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-3xl flex-shrink-0">
          🏫
        </div>
        <div className="flex-1">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">Registered Organization</p>
          <h3 className="text-xl sm:text-2xl font-heading font-bold">{ORGANIZATION.name}</h3>
          <p className="text-blue-200 text-sm mt-1">
            {ORGANIZATION.shortName} &nbsp;·&nbsp; {ORGANIZATION.type} &nbsp;·&nbsp;
            {ORGANIZATION.city}, {ORGANIZATION.state}, {ORGANIZATION.country}
          </p>
          <p className="text-blue-300 text-xs mt-1">Established {ORGANIZATION.established}</p>
        </div>
        <div className="flex-shrink-0 text-right hidden sm:block">
          <p className="text-xs text-blue-300 font-semibold uppercase tracking-wide">Scope of Services</p>
          <ul className="mt-2 space-y-0.5">
            {ORGANIZATION.scope.slice(0, 4).map(s => (
              <li key={s} className="text-xs text-blue-200">• {s}</li>
            ))}
            {ORGANIZATION.scope.length > 4 && (
              <li className="text-xs text-blue-300">+{ORGANIZATION.scope.length - 4} more</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────
export default function LegalRegistrationSection() {
  return (
    <section
      id="legal-registration"
      aria-labelledby="legal-registration-heading"
      className="py-16 sm:py-20 bg-surface-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Transparency & Trust"
          title="Legal, Registration & Quality"
          id="legal-registration-heading"
          subtitle="AICIT is a registered organization with documented government registrations and quality certifications. All information on this page is sourced from official documents."
        />

        {/* Organization banner */}
        <OrgBanner />

        {/* Government Registrations */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🏛️</span>
            <h3 className="text-lg font-heading font-bold text-primary-900">Government Registrations</h3>
            <span className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GOVERNMENT_REGISTRATIONS.map(reg => (
              <GovtCard key={reg.id} reg={reg} />
            ))}
          </div>
        </div>

        {/* ISO / Quality Certifications */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📜</span>
            <h3 className="text-lg font-heading font-bold text-primary-900">Quality Certifications</h3>
            <span className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CERTIFICATIONS.map(cert => (
              <CertCard key={cert.id} cert={cert} />
            ))}
          </div>
        </div>

        {/* Future Certifications */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🔮</span>
            <h3 className="text-lg font-heading font-bold text-gray-500">Future Certifications</h3>
            <span className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 italic">None of these are currently active</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FUTURE_CERTIFICATIONS.map(item => (
              <FutureCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="mt-10 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
          <strong>Legal Disclaimer:</strong> The information on this page is derived from official government and certification documents held by AICIT.
          Government registrations (Udyam, Society) are independently verifiable on their respective portals.
          ISO certification status is subject to ongoing surveillance and renewal; the expired certificate is shown for reference only and does not imply current certification.
          This page does not constitute legal representation and should not be relied upon as a substitute for verifying documents directly with the issuing authority.
        </div>
      </div>
    </section>
  );
}
