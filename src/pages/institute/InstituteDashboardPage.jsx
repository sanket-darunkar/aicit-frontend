import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInstituteAuth } from '../../contexts/InstituteAuthContext.jsx';
import { instituteApi } from '../../services/api.js';

const ACTIONS = [
  { label: 'Apply for Certificate', to: '/institute/batches',      icon: '🧾', desc: 'Single or bulk — pay ₹250 per certificate' },
  { label: 'Add Student',           to: '/institute/students/new', icon: '➕', desc: 'Enroll a new student' },
  { label: 'View Students',         to: '/institute/students',     icon: '🎓', desc: 'Browse and manage enrolled students' },
  { label: 'Issued Certificates',   to: '/institute/certificates', icon: '📜', desc: 'View and download issued certificates' },
];

function StatCard({ label, value, icon, loading }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-heading font-bold text-primary-900">
        {loading ? <span className="inline-block w-10 h-6 bg-gray-200 rounded animate-pulse" /> : value}
      </p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

export default function InstituteDashboardPage() {
  const { user } = useInstituteAuth();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instituteApi.get('/api/institute/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(() => {})          // non-critical — fall through showing '—'
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary-900">
          Welcome, {user?.fullName?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {user?.instituteName} &nbsp;·&nbsp; Institute Portal
        </p>
      </div>

      {/* Institute info strip */}
      <div className="bg-primary-800 rounded-xl p-5 text-white flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
          🏫
        </div>
        <div className="flex-1">
          <p className="font-heading font-bold">{user?.instituteName}</p>
          <p className="text-blue-200 text-sm">{user?.email} &nbsp;·&nbsp; {user?.role}</p>
        </div>
        <span className="px-3 py-1 bg-green-500 rounded-full text-xs font-bold self-start sm:self-auto">
          ACTIVE
        </span>
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Students"       value={stats?.totalStudents   ?? '—'} icon="🎓" loading={loading} />
        <StatCard label="Total Certificates"   value={stats?.totalCertificates ?? '—'} icon="📜" loading={loading} />
        <StatCard label="Pending Requests"     value={stats?.pendingCertificates ?? '—'} icon="⏳" loading={loading} />
        <StatCard label="Issued Certificates"  value={stats?.issuedCertificates ?? '—'} icon="✅" loading={loading} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ACTIONS.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5
                       hover:shadow-card-hover hover:border-primary-200 transition-all group"
          >
            <span className="text-3xl mb-3 block">{action.icon}</span>
            <h3 className="text-sm font-heading font-bold text-primary-900 mb-1 group-hover:text-primary-700">
              {action.label}
            </h3>
            <p className="text-xs text-gray-500">{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <p className="text-sm text-blue-800">
          <strong>Getting started:</strong> Add your students, then apply for certificates
          (single or bulk) at ₹250 each. Pay the fee via UPI and submit the UTR reference —
          AICIT verifies the payment, generates the certificates, and notifies you when the
          batch is ready to download.
        </p>
      </div>
    </div>
  );
}
