import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInstituteAuth } from '../../contexts/InstituteAuthContext.jsx';
import { instituteApi } from '../../services/api.js';
import StatCard from '../../components/dashboard/StatCard.jsx';
import SectionCard from '../../components/dashboard/SectionCard.jsx';
import StatusDonut from '../../components/dashboard/StatusDonut.jsx';
import MiniBarChart from '../../components/dashboard/MiniBarChart.jsx';
import ActivityFeed from '../../components/dashboard/ActivityFeed.jsx';
import {
  CERT_STATUS_META, PAYMENT_STATUS_META, CHART_COLORS, inr,
} from '../../components/dashboard/dashboardTheme.js';

const I = {
  cap:   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v7"/></svg>,
  doc:   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25"/></svg>,
  clock: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  check: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
};

const ACTIONS = [
  { label: 'Apply for Certificate', to: '/institute/batches',      icon: '🧾', desc: 'Single or bulk — ₹250 per certificate', accent: 'hover:border-primary-300 hover:bg-primary-50' },
  { label: 'Add Student',           to: '/institute/students/new', icon: '➕', desc: 'Enroll a new student', accent: 'hover:border-trust-300 hover:bg-trust-50' },
  { label: 'View Students',         to: '/institute/students',     icon: '🎓', desc: 'Browse & manage students', accent: 'hover:border-blue-300 hover:bg-blue-50' },
  { label: 'Certificates',          to: '/institute/certificates', icon: '📜', desc: 'View & download issued', accent: 'hover:border-purple-300 hover:bg-purple-50' },
];

export default function InstituteDashboardPage() {
  const { user } = useInstituteAuth();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  const [certByStatus, setCertByStatus] = useState(null);
  const [payByStatus,  setPayByStatus]  = useState(null);
  const [batches,      setBatches]      = useState(null);
  const [auxLoading,   setAuxLoading]   = useState(true);

  // Primary KPI stats (existing endpoint, unchanged)
  useEffect(() => {
    instituteApi.get('/api/institute/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Secondary analytics — existing endpoints, failure-tolerant.
  useEffect(() => {
    let alive = true;

    const certStatuses = Object.keys(CERT_STATUS_META);
    Promise.all(certStatuses.map(s =>
      instituteApi.get(`/api/institute/certificates?status=${s}&page=0&size=1`)
        .then(r => ({ s, total: r.data?.totalElements ?? 0 }))
        .catch(() => ({ s, total: 0 }))
    )).then(rows => {
      if (!alive) return;
      setCertByStatus(rows.map(({ s, total }) => ({
        name: CERT_STATUS_META[s].label, value: total, color: CERT_STATUS_META[s].color,
      })));
    });

    const payStatuses = Object.keys(PAYMENT_STATUS_META);
    Promise.all(payStatuses.map(s =>
      instituteApi.get(`/api/institute/batches?paymentStatus=${s}&page=0&size=1`)
        .then(r => ({ s, total: r.data?.totalElements ?? 0 }))
        .catch(() => ({ s, total: 0 }))
    )).then(rows => {
      if (!alive) return;
      setPayByStatus(rows.map(({ s, total }) => ({
        name: PAYMENT_STATUS_META[s].label, value: total, color: PAYMENT_STATUS_META[s].color,
      })));
    });

    instituteApi.get('/api/institute/batches?page=0&size=6')
      .then(r => { if (alive) setBatches(r.data?.content ?? []); })
      .catch(() => { if (alive) setBatches([]); })
      .finally(() => { if (alive) setAuxLoading(false); });

    return () => { alive = false; };
  }, []);

  const batchFeed = (batches ?? []).map((b, i) => ({
    id: b.id ?? i,
    title: `${b.type || 'Batch'} · ${b.certificateCount ?? 0} cert${(b.certificateCount ?? 0) === 1 ? '' : 's'} · ${inr(b.totalAmount)}`,
    meta: (b.batchCode ? b.batchCode + ' · ' : '') + (PAYMENT_STATUS_META[b.paymentStatus]?.label || b.paymentStatus || ''),
    time: b.createdAt,
    dotColor: PAYMENT_STATUS_META[b.paymentStatus]?.color || CHART_COLORS.primary,
  }));

  return (
    <div className="space-y-6 page-enter">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-heading font-extrabold text-primary-900">
          Welcome back, {user?.fullName?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">{user?.instituteName} · Institute Portal</p>
      </div>

      {/* ── Institute banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-800 to-primary-950
                      p-6 text-white shadow-card">
        <div className="absolute inset-0 bg-dot-pattern bg-dot-md opacity-10" aria-hidden />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0 ring-1 ring-white/20">
            🏫
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-lg truncate">{user?.instituteName}</p>
            <p className="text-blue-200 text-sm truncate">{user?.email} · {user?.role?.replace('_', ' ')}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-trust-500 rounded-full text-xs font-bold self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> ACTIVE
          </span>
        </div>
      </div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={stats?.totalStudents} loading={loading}
          icon={I.cap} accent="from-primary-600 to-primary-800" to="/institute/students" />
        <StatCard label="Total Certificates" value={stats?.totalCertificates} loading={loading}
          icon={I.doc} accent="from-blue-500 to-blue-700" to="/institute/certificates" />
        <StatCard label="Pending Requests" value={stats?.pendingCertificates} loading={loading}
          icon={I.clock} accent="from-amber-400 to-amber-600" to="/institute/batches" />
        <StatCard label="Issued Certificates" value={stats?.issuedCertificates} loading={loading}
          icon={I.check} accent="from-trust-500 to-trust-700" to="/institute/certificates" />
      </div>

      {/* ── Charts + actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard title="Your Certificates" subtitle="By status" icon="📜"
          action={{ label: 'View all', to: '/institute/certificates' }}>
          <StatusDonut data={certByStatus ?? []} unit="total" loading={certByStatus === null} />
        </SectionCard>

        <SectionCard title="Payment Pipeline" subtitle="Batches by payment status" icon="💳"
          action={{ label: 'Batches', to: '/institute/batches' }}>
          <MiniBarChart data={payByStatus ?? []} loading={payByStatus === null} />
        </SectionCard>

        <SectionCard title="Quick Actions" icon="⚡">
          <div className="grid grid-cols-2 gap-3">
            {ACTIONS.map(a => (
              <Link key={a.label} to={a.to}
                className={`flex flex-col gap-1.5 p-4 rounded-xl border-2 border-gray-100
                            transition-all duration-200 ${a.accent}`}>
                <span className="text-2xl">{a.icon}</span>
                <span className="text-xs font-bold text-primary-900 leading-tight">{a.label}</span>
                <span className="text-[10px] text-gray-400 leading-tight">{a.desc}</span>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* ── Recent batches ── */}
      <SectionCard title="Recent Batches" subtitle="Your latest certificate requests" icon="🧾"
        action={{ label: 'All batches', to: '/institute/batches' }}>
        <ActivityFeed items={batchFeed} loading={auxLoading}
          empty="No batches yet — apply for your first certificate" />
      </SectionCard>

      {/* ── Getting started note ── */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-3">
        <span className="text-xl flex-shrink-0">💡</span>
        <p className="text-sm text-blue-800 leading-relaxed">
          <strong>Getting started:</strong> Add your students, then apply for certificates
          (single or bulk) at ₹250 each. Pay via UPI, submit the UTR reference — AICIT verifies
          the payment, generates the certificates, and notifies you when the batch is ready to download.
        </p>
      </div>
    </div>
  );
}
