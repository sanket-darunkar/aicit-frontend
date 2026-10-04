import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Auth contexts
import { AdminAuthProvider, useAdminAuth }         from './contexts/AdminAuthContext.jsx';
import { InstituteAuthProvider, useInstituteAuth } from './contexts/InstituteAuthContext.jsx';

// Layout
import Navbar  from './components/layout/Navbar.jsx';
import Footer  from './components/layout/Footer.jsx';
import AdminLayout     from './components/admin/AdminLayout.jsx';
import InstituteLayout from './components/institute/InstituteLayout.jsx';

// Public pages
import HomePage                    from './pages/HomePage.jsx';
import AboutPage                   from './pages/AboutPage.jsx';
import CoursesPage                 from './pages/CoursesPage.jsx';
import ContactPage                 from './pages/ContactPage.jsx';
import CertificateVerificationPage from './pages/CertificateVerificationPage.jsx';
import RegisterInstitutePage       from './pages/RegisterInstitutePage.jsx';
import PlaceholderPage             from './pages/PlaceholderPage.jsx';

// Admin pages
import AdminLoginPage           from './pages/admin/AdminLoginPage.jsx';
import AdminDashboardPage       from './pages/admin/AdminDashboardPage.jsx';
import AdminInstitutesPage      from './pages/admin/AdminInstitutesPage.jsx';
import AdminInstituteDetailPage from './pages/admin/AdminInstituteDetailPage.jsx';
import AdminCertificatesPage    from './pages/admin/AdminCertificatesPage.jsx';
import AdminCertificateDetailPage from './pages/admin/AdminCertificateDetailPage.jsx';
import AdminCoursesPage         from './pages/admin/AdminCoursesPage.jsx';
import AdminStudentsPage        from './pages/admin/AdminStudentsPage.jsx';
import AdminAuditLogsPage       from './pages/admin/AdminAuditLogsPage.jsx';

// Institute pages
import InstituteLoginPage           from './pages/institute/InstituteLoginPage.jsx';
import InstituteDashboardPage       from './pages/institute/InstituteDashboardPage.jsx';
import InstituteStudentsPage        from './pages/institute/InstituteStudentsPage.jsx';
import InstituteAddStudentPage      from './pages/institute/InstituteAddStudentPage.jsx';
import InstituteStudentDetailPage   from './pages/institute/InstituteStudentDetailPage.jsx';
import InstituteStudentEditPage     from './pages/institute/InstituteStudentEditPage.jsx';
import InstituteCertificatesPage    from './pages/institute/InstituteCertificatesPage.jsx';
import InstituteProfilePage         from './pages/institute/InstituteProfilePage.jsx';

// ── Loading fallback ──────────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <svg className="animate-spin w-8 h-8 text-primary-700" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  );
}

// ── Public layout ─────────────────────────────────────────────
function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200]
                   focus:bg-white focus:text-primary-800 focus:font-bold focus:px-4 focus:py-2
                   focus:rounded-xl focus:shadow-lg focus:ring-2 focus:ring-primary-600">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// ── Auth guards ───────────────────────────────────────────────
function AdminGuard({ children }) {
  const { isAuthenticated } = useAdminAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return <AdminLayout>{children}</AdminLayout>;
}

function InstituteGuard({ children }) {
  const { isAuthenticated } = useInstituteAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/institute/login" state={{ from: location }} replace />;
  }
  return <InstituteLayout>{children}</InstituteLayout>;
}

// ── Root ──────────────────────────────────────────────────────
export default function App() {
  return (
    <AdminAuthProvider>
      <InstituteAuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* ── Public website ──────────────────────────── */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/courses" element={<PublicLayout><CoursesPage /></PublicLayout>} />
            <Route path="/verify" element={<PublicLayout><CertificateVerificationPage /></PublicLayout>} />
            <Route path="/verify/:certNumber" element={<PublicLayout><CertificateVerificationPage /></PublicLayout>} />
            <Route path="/register-institute" element={<PublicLayout><RegisterInstitutePage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/student-information" element={<PublicLayout><PlaceholderPage title="Student Information" description="Student portal coming soon." icon="🎓" /></PublicLayout>} />
            <Route path="/gallery"  element={<PublicLayout><PlaceholderPage title="Gallery"           description="Photo gallery coming soon."  icon="🖼️" /></PublicLayout>} />
            <Route path="/terms"    element={<PublicLayout><PlaceholderPage title="Terms & Conditions" description="Content pending legal review." icon="📋" /></PublicLayout>} />
            <Route path="/privacy"  element={<PublicLayout><PlaceholderPage title="Privacy Policy"    description="Content pending legal review." icon="🔒" /></PublicLayout>} />
            <Route path="/certificate-policy" element={<PublicLayout><PlaceholderPage title="Certificate Policy" description="Under preparation." icon="📜" /></PublicLayout>} />

            {/* ── Admin portal ────────────────────────────── */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard"
              element={<AdminGuard><AdminDashboardPage /></AdminGuard>} />
            <Route path="/admin/institutes"
              element={<AdminGuard><AdminInstitutesPage /></AdminGuard>} />
            <Route path="/admin/institutes/:id"
              element={<AdminGuard><AdminInstituteDetailPage /></AdminGuard>} />
            <Route path="/admin/students"
              element={<AdminGuard><AdminStudentsPage /></AdminGuard>} />
            <Route path="/admin/certificates"
              element={<AdminGuard><AdminCertificatesPage /></AdminGuard>} />
            <Route path="/admin/certificates/:id"
              element={<AdminGuard><AdminCertificateDetailPage /></AdminGuard>} />
            <Route path="/admin/courses"
              element={<AdminGuard><AdminCoursesPage /></AdminGuard>} />
            <Route path="/admin/audit-logs"
              element={<AdminGuard><AdminAuditLogsPage /></AdminGuard>} />

            {/* ── Institute portal ─────────────────────────── */}
            <Route path="/institute/login" element={<InstituteLoginPage />} />
            <Route path="/institute" element={<Navigate to="/institute/dashboard" replace />} />
            <Route path="/institute/dashboard"
              element={<InstituteGuard><InstituteDashboardPage /></InstituteGuard>} />
            <Route path="/institute/students"
              element={<InstituteGuard><InstituteStudentsPage /></InstituteGuard>} />
            <Route path="/institute/students/new"
              element={<InstituteGuard><InstituteAddStudentPage /></InstituteGuard>} />
            <Route path="/institute/students/:id"
              element={<InstituteGuard><InstituteStudentDetailPage /></InstituteGuard>} />
            <Route path="/institute/students/:id/edit"
              element={<InstituteGuard><InstituteStudentEditPage /></InstituteGuard>} />
            <Route path="/institute/certificates"
              element={<InstituteGuard><InstituteCertificatesPage /></InstituteGuard>} />
            <Route path="/institute/profile"
              element={<InstituteGuard><InstituteProfilePage /></InstituteGuard>} />

            {/* ── 404 ─────────────────────────────────────── */}
            <Route path="*" element={<PublicLayout><PlaceholderPage title="Page Not Found" description="The page you're looking for doesn't exist." icon="404" /></PublicLayout>} />

          </Routes>
        </Suspense>
      </InstituteAuthProvider>
    </AdminAuthProvider>
  );
}
