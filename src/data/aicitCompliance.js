/**
 * AICIT Compliance & Registration Data
 * ─────────────────────────────────────
 * SOURCE OF TRUTH: Official documents uploaded October 2024
 *   - Udyam Registration Certificate (UDYAM-MH-20-0221747)
 *   - Society Registration Application (SRN: NGP/44214/1860/18)
 *   - ISO 9001:2015 Certificate No. IN8309A (expired July 2025)
 *   - ISO Certification Form
 *
 * SECURITY RULES – DO NOT COMMIT:
 *   - PAN number
 *   - Bank account / IFSC
 *   - Personal mobile numbers or emails
 *   - Personal addresses of members/owners
 *   - Financial figures (turnover, investment)
 *   - Full residential addresses
 *
 * To update a certification, edit the relevant object below.
 * The section component reads this file and re-renders automatically.
 */

// ── Organization Identity ───────────────────────────────────────
export const ORGANIZATION = {
  name:       'All India Council for Information Technology',
  shortName:  'AICIT',
  type:       'Education / Computer Education',
  city:       'Nagpur',
  state:      'Maharashtra',
  country:    'India',
  established: '2018',
  scope: [
    'Advance Certificate in Computer Fundamentals',
    'Certificate in Computer Based Typing (Hindi / English / Marathi)',
    'Certificate in MS Office and Internet',
    'Certificate in Tally ERP9 (Basic & Advanced)',
    'Diploma in Desktop Publishing',
    'Certificate in Computer Networking & Advance Networking',
    'Diploma in Web Designing',
  ],
};

// ── Status constants ────────────────────────────────────────────
export const CERT_STATUS = {
  ACTIVE:               'ACTIVE',
  EXPIRED:              'EXPIRED',
  PENDING_VERIFICATION: 'PENDING_VERIFICATION',
  PLANNED:              'PLANNED',
  REGISTERED:           'REGISTERED',
};

// ── Government Registrations ────────────────────────────────────
/**
 * Government / statutory registrations.
 * These are facts from official documents and are safe to display publicly.
 */
export const GOVERNMENT_REGISTRATIONS = [
  {
    id:               'udyam',
    title:            'Udyam Registration',
    subtitle:         'Ministry of MSME — Government of India',
    registrationNumber: 'UDYAM-MH-20-0221747',
    authority:        'Ministry of Micro, Small & Medium Enterprises (MSME)',
    portal:           'udyamregistration.gov.in',
    verificationUrl:  'https://udyamregistration.gov.in',
    enterpriseType:   'Micro',
    majorActivity:    'Services',
    unitName:         'Computer Education',
    dateOfIncorporation:   '13 July 2018',
    dateOfRegistration:    '25 October 2024',
    classificationYear:    '2024–25',
    status:           CERT_STATUS.REGISTERED,
    icon:             '🏛️',
    // Sensitive fields intentionally omitted:
    // address, mobile, email, PAN, bank details, owner name
  },
  {
    id:               'society',
    title:            'Society Registration',
    subtitle:         'Societies Registration Act, 1860',
    registrationNumber: 'SRN: NGP/44214/1860/18',
    authority:        'Government of Maharashtra — Nagpur Region',
    applicationDate:  '13 July 2018',
    objective:        'Promotion and advancement of computer education and information technology literacy across India through affiliated institutes.',
    status:           CERT_STATUS.REGISTERED,
    icon:             '📋',
    // Members' personal addresses intentionally omitted
  },
];

// ── Quality & ISO Certifications ────────────────────────────────
/**
 * ISO and quality certifications.
 *
 * ISO 9001:2015 certificate (IN8309A) issued by Integral Certification (P) Ltd.
 * Valid until 18 July 2027.
 */
export const CERTIFICATIONS = [
  {
    id:                'iso_9001_prev',
    name:              'ISO 9001:2015',
    fullName:          'Quality Management System',
    certificateNumber: 'IN8309A',
    issuer:            'Integral Certification (P) Ltd.',
    issuerAddress:     'Laxmi Nagar, Delhi',
    issuerWebsite:     'https://www.iclcert.com',
    accreditationBody: 'ICL — CAB # 112001',
    issueDate:         '19 July 2023',
    expiryDate:        '18 July 2027',
    surveillanceDue:   '14 July 2026',
    scope:             'Computer Education Services — as listed in certificate',
    status:            CERT_STATUS.ACTIVE,
    statusNote:        'Certificate is valid and current. Expiry: 18 July 2027.',
    verificationUrl:   'https://www.iclcert.com',
    showDocument:      false,  // set true only if a sanitized copy is added to /src/assets/
    documentUrl:       null,
    icon:              '📄',
  },
  {
    id:                'iso_9001_current',
    name:              'ISO 9001:2015',
    fullName:          'Quality Management System — Surveillance',
    certificateNumber: 'IN8309A',
    issuer:            'Integral Certification (P) Ltd.',
    issueDate:         '19 July 2023',
    expiryDate:        '18 July 2027',
    scope:             'Computer Education Services',
    status:            CERT_STATUS.ACTIVE,
    statusNote:        'Under active surveillance. Next surveillance due: 14 July 2026.',
    verificationUrl:   'https://www.iclcert.com',
    showDocument:      false,
    documentUrl:       null,
    icon:              '✅',
  },
];

// ── Future / Planned Certifications ────────────────────────────
/**
 * Certifications that are planned or in progress.
 * NEVER display these as completed or active.
 */
export const FUTURE_CERTIFICATIONS = [
  {
    id:         'iso_21001',
    name:       'ISO 21001:2018',
    fullName:   'Educational Organizations Management System (EOMS)',
    status:     CERT_STATUS.PLANNED,
    statusNote: 'Planned for future certification cycle.',
    icon:       '🎓',
  },
  {
    id:         'iso_27001',
    name:       'ISO/IEC 27001',
    fullName:   'Information Security Management System (ISMS)',
    status:     CERT_STATUS.PLANNED,
    statusNote: 'Planned for future certification cycle.',
    icon:       '🔒',
  },
  {
    id:         'trademark',
    name:       'Trademark Registration',
    fullName:   'AICIT Brand & Logo Trademark',
    status:     CERT_STATUS.PLANNED,
    statusNote: 'Trademark application under consideration.',
    icon:       '™️',
  },
  {
    id:         'accreditation',
    name:       'National Accreditation',
    fullName:   'Industry / Government Accreditation Membership',
    status:     CERT_STATUS.PLANNED,
    statusNote: 'Under evaluation.',
    icon:       '🏅',
  },
];
