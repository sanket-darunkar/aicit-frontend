/**
 * AICIT – Centralized site configuration
 * Update this file with verified information.
 * Fields marked [PENDING] require confirmation from the business owner.
 */

export const SITE = {
  name:        'AICIT',
  fullName:    'All India Council for Information Technology',
  tagline:     'Empowering Institutes. Certifying Futures.',
  description: 'A centralized education and certificate management platform for authorized institutes across India.',
  url:         'https://aicit.org.in',            // [PENDING – update with actual domain]
  email:       'info@aicit.org.in',
  phone:       '+91 8888723485',                  // [PENDING – update with AICIT contact]
  address: {
    line1:  'Lok Kalyan Society, Anmol Nagar',
    line2:  'Wathoda Layout, Nagpur',
    state:  'Maharashtra',
    pin:    '440034',
  },
  social: {
    facebook:  '',   // [PENDING]
    instagram: '',   // [PENDING]
    twitter:   '',   // [PENDING]
    youtube:   '',   // [PENDING]
    whatsapp:  '918888723485',
  },
  establishedYear: 2024,   // [PENDING – confirm actual year]
};

// ── Payment / UPI config ─────────────────────────────────────
// Certificate pricing is enforced server-side (₹250 per certificate).
// These values only control what the institute SEES on the payment screen.
// Payment is manual/out-of-band: the institute pays via UPI, then submits
// the UTR/reference number, which an AICIT admin verifies manually.
//
// Everything here is overridable via Vite env vars (VITE_UPI_*), so the
// UPI ID / payee / QR can be changed per environment WITHOUT touching code.
//
// QR image:
//   - If VITE_UPI_QR_IMAGE (or staticQrImage below) points to an image, that
//     exact QR is shown as-is (recommended for a bank-issued static QR).
//   - Otherwise a QR is generated dynamically from upiVpa + amount so the
//     scanned payee always matches the UPI ID displayed on screen.
const env = import.meta.env;

export const PAYMENT = {
  unitAmount:     Number(env.VITE_UPI_UNIT_AMOUNT ?? 250),  // ₹ per certificate (display only; server is source of truth)
  currency:       'INR',
  currencySymbol: '₹',
  upiVpa:         env.VITE_UPI_VPA        ?? '1202946131@airtel',
  payeeName:      env.VITE_UPI_PAYEE_NAME ?? 'AICIT',
  note:           env.VITE_UPI_NOTE       ?? 'AICIT Certificate Fee',
  // Optional pre-generated/bank-issued static QR image served from /public.
  // When present it is shown as-is (a bank static QR has NO amount embedded,
  // so the payer types the amount in). If the file is missing or unset, the
  // panel generates the QR dynamically from the VPA + amount instead.
  staticQrImage:  env.VITE_UPI_QR_IMAGE   ?? '/payment/MainAICITQR.jpeg',
};

// ── Announcement ticker messages ─────────────────────────────
export const ANNOUNCEMENTS = [
  'Institute Registration Open – Apply Now to become an Authorized AICIT Partner',
  'Certificate Verification available online – Visit aicit.org.in/verify',
  'New Courses added – Graphic Designing, Advanced Tally Prime with GST',
  'Contact us for institute affiliation: info@aicit.org.in',
];

// ── Navigation links ──────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Home',                     to: '/' },
  { label: 'About',                    to: '/about' },
  { label: 'Student Information',      to: '/student-information' },
  { label: 'Certificate Verification', to: '/verify' },
  { label: 'All Courses',              to: '/courses' },
  { label: 'Gallery',                  to: '/gallery' },
  { label: 'Contact',                  to: '/contact' },
];

// ── Courses ───────────────────────────────────────────────────
export const COURSE_CATEGORIES = [
  { id: 'all',        label: 'All Courses' },
  { id: 'computer',   label: 'Computer & IT' },
  { id: 'accounting', label: 'Accounting & Finance' },
  { id: 'design',     label: 'Design & Media' },
  { id: 'typing',     label: 'Typing' },
  { id: 'govt',       label: 'Government Exams' },
];

export const COURSES = [
  // Computer & IT
  { id: 1,  category: 'computer',   name: 'Diploma in Computer Application (DCA)',              duration: '6 Months',  featured: true  },
  { id: 2,  category: 'computer',   name: 'MS-CIT',                                             duration: '3 Months',  featured: true  },
  { id: 3,  category: 'computer',   name: 'Course on Computer Concepts (CCC)',                  duration: '3 Months',  featured: false },
  { id: 4,  category: 'computer',   name: 'Certificate in Hardware & Networking',               duration: '5 Months',  featured: false },
  { id: 5,  category: 'computer',   name: 'KLiC Web Designing',                                 duration: '3 Months',  featured: false },
  { id: 6,  category: 'computer',   name: 'Google Workspace Expert',                            duration: '2 Months',  featured: false },
  // Accounting
  { id: 7,  category: 'accounting', name: 'Tally Prime with GST',                               duration: '2 Months',  featured: true  },
  { id: 8,  category: 'accounting', name: 'Advanced Tally Prime with GST',                      duration: '2 Months',  featured: false },
  { id: 9,  category: 'accounting', name: 'Advanced Excel',                                     duration: '2 Months',  featured: false },
  { id: 10, category: 'accounting', name: 'Certificate in Account Expert with Tally.ERP9',      duration: '3 Months',  featured: false },
  { id: 11, category: 'accounting', name: 'Office Assistance',                                  duration: '3 Months',  featured: false },
  // Design
  { id: 12, category: 'design',     name: 'Graphic Designing',                                  duration: '3 Months',  featured: true  },
  { id: 13, category: 'design',     name: 'KLiC Video Editing',                                 duration: '2 Months',  featured: false },
  { id: 14, category: 'design',     name: 'Certificate in Desktop Publishing (DTP)',             duration: '3 Months',  featured: false },
  { id: 15, category: 'design',     name: 'Diploma in Desktop Publishing',                      duration: '3 Months',  featured: false },
  { id: 16, category: 'design',     name: 'Certificate in Web Design',                          duration: '3 Months',  featured: false },
  // Typing
  { id: 17, category: 'typing',     name: 'English Typing – 30 W.P.M.',                        duration: '3 Months',  featured: false },
  { id: 18, category: 'typing',     name: 'English Typing – 40 W.P.M.',                        duration: '3 Months',  featured: false },
  { id: 19, category: 'typing',     name: 'Marathi Typing – 30 W.P.M.',                        duration: '3 Months',  featured: false },
  { id: 20, category: 'typing',     name: 'Marathi Typing – 40 W.P.M.',                        duration: '3 Months',  featured: false },
  { id: 21, category: 'typing',     name: 'Hindi Typing – 30 W.P.M.',                          duration: '3 Months',  featured: false },
  { id: 22, category: 'typing',     name: 'Hindi Typing – 40 W.P.M.',                          duration: '3 Months',  featured: false },
  { id: 23, category: 'typing',     name: 'GCC-TBC Pune Board Typing',                         duration: '6 Months',  featured: false },
  // Combo / Special
  { id: 24, category: 'computer',   name: 'MS-CIT + English Typing 30 & 40 WPM + Diploma',     duration: '6 Months',  featured: true  },
  { id: 25, category: 'computer',   name: 'MS-CIT + Typing + Tally Prime + Diploma',            duration: '8 Months',  featured: false },
];

// ── Why Choose Us cards ───────────────────────────────────────
export const WHY_CHOOSE_US = [
  {
    title:       'Best In Industry',
    description: 'At the forefront of India\'s digital revolution stands AICIT – a trailblazer in advancing the nation\'s IT landscape through quality education and certified training.',
    icon:        'trophy',
  },
  {
    title:       'Job Oriented Courses',
    description: 'Our academics are designed so that students learn the latest software versions used in the IT industry – making them completely job-ready from day one.',
    icon:        'briefcase',
  },
  {
    title:       'Professional Staff',
    description: 'We conduct annual programs and seminars for our faculty to ensure awareness of the latest technological advancements and teaching best practices.',
    icon:        'users',
  },
  {
    title:       'Placement Assistance',
    description: 'Students are taught skills like resume writing, presentation skills, and time management so that they become completely industry-ready.',
    icon:        'chart',
  },
];

// ── Platform stats (static placeholders; replace with live API later) ──
export const STATS = [
  { label: 'Affiliated Institutes', value: '50+',   icon: 'building' },
  { label: 'Students Enrolled',     value: '5,000+', icon: 'users'   },
  { label: 'Certificates Issued',   value: '3,500+', icon: 'badge'   },
  { label: 'Courses Offered',       value: '350+',   icon: 'book'    },
];
