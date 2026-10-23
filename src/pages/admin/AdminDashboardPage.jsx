import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext.jsx';
import { adminApi } from '../../services/api.js';
import StatCard from '../../components/dashboard/StatCard.jsx';
import SectionCard from '../../components/dashboard/SectionCard.jsx';
import StatusDonut from '../../components/dashboard/StatusDonut.jsx';
import MiniBarChart from '../../components/dashboard/MiniBarChart.jsx';
import ActivityFeed from '../../components/dashboard/ActivityFeed.jsx';
import {
  CERT_STATUS_META, INSTITUTE_STATUS_META, PAYMENT_STATUS_META, CHART_COLORS,
} from '../../components/dashboard/dashboardTheme.js';

// ── Icons (inline, stroke) ────────────────────────────────────
const I = {
  clock:   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  school:  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M9 21V9l6-6 6 6v12"/></svg>,
  cap:     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v7"/></svg>,
  doc:     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>,
  seal:    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  pause:   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"/></svg>,
  rupee:   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h12M6 10h12M9 6c3 0 4.5 1.5 4.5 4S12 14 9 14l6 6"/></svg>,
};

const QUICK_ACTIONS = [
  { label: 'Review Applications', to: '/admin/institutes?status=PENDING_REVIEW', icon: '📋', ring: 'hover:border-amber-300 hover:bg-amber-50' },
  { label: 'Verify Payments',     to: '/admin/batches?paymentStatus=VERIFICATION_PENDING', icon: '💳', ring: 'hover:border-gold-300 hover:bg-gold-50' },
  { label: 'Certificate Queue',   to: '/admin/certificates?status=REQUESTED', icon: '📜', ring: 'hover:border-purple-300 hover:bg-purple-50' },
  { label: 'All Institutes',      to: '/admin/institutes', icon: '🏫', ring: 'hover:border-primary-300 hover:bg-primary-50' },
  { label: 'Students',            to: '/admin/students', icon: '🎓', ring: 'hover:border-trust-300 hover:bg-trust-50' },
  { label: 'Manage Courses',      to: '/admin/courses', icon: '📚', ring: 'hover:border-blue-300 hover:bg-blue-50' },
];

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();
  const [stats,   setStats]   = useState({});
  const [loading, setLoading] = useState(true);

  const [certByStatus, setCertByStatus] = useState(null);
  const [instByStatus, setInstByStatus] = useState(null);
  const [payByStatus,  setPayByStatus]  = useState(null);
  const [activity,     setActivity]     = useState(null);
  const [auxLoading,   setAuxLoading]   = useState(true);

  // Primary KPI stats (existing endpoint, unchanged)
  useEffect(() => {
    adminApi.get('/api/admin/dashboard/stats')
      .then(r => setStats(r.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Secondary analytics — all existing endpoints, each failure-tolerant.
  useEffect(() => {
    let alive = true;

    // Count certificates per status by querying each status's total (cheap: size=1 → totalElements)
    const certStatuses = Object.keys(CERT_STATUS_META);
    Promise.all(certStatuses.map(s =>
      adminApi.get(`/api/admin/certificates?status=${s}&page=0&size=1`)
        .then(r => ({ s, total: r.data?.totalElements ?? 0 }))
        .catch(() => ({ s, total: 0 }))
    )).then(rows => {
      if (!alive) return;
      setCertByStatus(rows.map(({ s, total }) => ({
        name: CERT_STATUS_META[s].label, value: total, color: CERT_STATUS_META[s].color, key: s,
      })));
    });

    // Institutes per status
    const instStatuses = Object.keys(INSTITUTE_STATUS_META);
    Promise.all(instStatuses.map(s =>
      adminApi.get(`/api/admin/institutes?status=${s}&page=0&size=1`)
        .then(r => ({ s, total: r.data?.totalElements ?? 0 }))
        .catch(() => ({ s, total: 0 }))
    )).then(rows => {
      if (!alive) return;
      setInstByStatus(rows.map(({ s, total }) => ({
        name: INSTITUTE_STATUS_META[s].label, value: total, color: INSTITUTE_STATUS_META[s].color,
      })));
    });

    // Batches per payment status
    const payStatuses = Object.keys(PAYMENT_STATUS_META);
    Promise.all(payStatuses.map(s =>
      adminApi.get(`/api/admin/batches?paymentStatus=${s}&page=0&size=1`)
        .then(r => ({ s, total: r.data?.totalElements ?? 0 }))
        .catch(() => ({ s, total: 0 }))
    )).then(rows => {
      if (!alive) return;
      setPayByStatus(rows.map(({ s, total }) => ({
        name: PAYMENT_STATUS_META[s].label, value: total, color: PAYMENT_STATUS_META[s].color, key: s,
      })));
    });

    // Recent audit-log activity
    adminApi.get('/api/admin/audit-logs?page=0&size=8')
      .then(r => { if (alive) setActivity(r.data?.content ?? []); })
      .catch(() => { if (alive) setActivity([]); })
      .finally(() => { if (alive) setAuxLoading(false); });

    return () => { alive = false; };
  }, []);

  const pendingPayments = payByStatus?.find(p => p.key === 'VERIFICATION_PENDING')?.value ?? 0;

  const feedItems = (activity ?? []).map((a, i) => ({
    id: a.id ?? i,
    title: a.description || a.action || 'Activity',
    meta: a.actorEmail || a.actorType,
    time: a.createdAt,
    dotColor: a.action?.includes('REJECT') ? CHART_COLORS.red
            : a.action?.includes('ISSUED') || a.action?.includes('APPROV') || a.action?.includes('PAID') ? CHART_COLORS.green
            : CHART_COLORS.primary,
  }));

  return (
    <div className="space-y-6 page-enter">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-primary-900">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Admin'} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here&apos;s what&apos;s happening across the AICIT platform.</p>
        </div>
        <span className="badge badge-blue self-start sm:self-auto">Management Console</span>
      </div>

      {/* ── Payments-to-verify callout ── */}
      {pendingPayments > 0 && (
        <Link to="/admin/batches?paymentStatus=VERIFICATION_PENDING"
          className="flex items-center gap-4 bg-gradient-to-r from-gold-500 to-gold-400 rounded-2xl p-4
                     text-white shadow-card hover:shadow-card-hover transition-all">
          <span className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">💳</span>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-sm">{pendingPayments} payment{pendingPayments > 1 ? 's' : ''} awaiting verification</p>
            <p className="text-white/85 text-xs">Review the submitted UTR references and process the batches.</p>
          </div>
          <span className="text-white/90 text-sm font-semibold whitespace-nowrap">Verify now →</span>
        </Link>
      )}

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Pending Applications" value={stats.pendingApplications} loading={loading}
          icon={I.clock} accent="from-amber-400 to-amber-600"
          to="/admin/institutes?status=PENDING_REVIEW" />
        <StatCard label="Active Institutes" value={stats.approvedInstitutes} loading={loading}
          icon={I.school} accent="from-trust-500 to-trust-700"
          to="/admin/institutes?status=APPROVED" />
        <StatCard label="Total Students" value={stats.totalStudents} loading={loading}
          icon={I.cap} accent="from-primary-600 to-primary-800"
          to="/admin/students" />
        <StatCard label="Certs Pending" value={stats.pendingCertificates} loading={loading}
          icon={I.doc} accent="from-amber-500 to-orange-500"
          to="/admin/certificates?status=REQUESTED" />
        <StatCard label="Certificates Issued" value={stats.issuedCertificates} loading={loading}
          icon={I.seal} accent="from-purple-500 to-purple-700"
          to="/admin/certificates?status=ISSUED" />
        <StatCard label="Suspended" value={stats.suspendedInstitutes} loading={loading}
          icon={I.pause} accent="from-red-400 to-red-600"
          to="/admin/institutes?status=SUSPENDED" />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard title="Certificates by Status" subtitle="Lifecycle breakdown" icon="📜"
          action={{ label: 'View all', to: '/admin/certificates' }}>
          <StatusDonut data={certByStatus ?? []} unit="total" loading={certByStatus === null} />
        </SectionCard>

        <SectionCard title="Institutes by Status" subtitle="Onboarding pipeline" icon="🏫"
          action={{ label: 'Manage', to: '/admin/institutes' }}>
          <MiniBarChart data={instByStatus ?? []} loading={instByStatus === null} />
        </SectionCard>

        <SectionCard title="Payments by Status" subtitle="Batch payment pipeline" icon="💳"
          action={{ label: 'Batches', to: '/admin/batches' }}>
          <MiniBarChart data={payByStatus ?? []} loading={payByStatus === null} />
        </SectionCard>
      </div>

      {/* ── Quick actions + activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard title="Quick Actions" icon="⚡" className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map(a => (
              <Link key={a.label} to={a.to}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-gray-100
                            text-center transition-all duration-200 ${a.ring}`}>
                <span className="text-2xl">{a.icon}</span>
                <span className="text-xs font-semibold text-gray-700">{a.label}</span>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity" subtitle="Latest admin actions" icon="🕑"
          action={{ label: 'Audit log', to: '/admin/audit-logs' }}>
          <ActivityFeed items={feedItems} loading={auxLoading} empty="No recent activity" />
        </SectionCard>
      </div>
    </div>
  );
}
