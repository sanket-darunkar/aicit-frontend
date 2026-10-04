import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext.jsx';
import { adminApi } from '../../services/api.js';

const STAT_CARDS = [
  { key: 'pendingApplications', label: 'Pending Applications', color: 'bg-amber-500',   icon: '⏳', link: '/admin/institutes?status=PENDING_REVIEW' },
  { key: 'approvedInstitutes',  label: 'Active Institutes',    color: 'bg-green-600',   icon: '🏫', link: '/admin/institutes?status=APPROVED' },
  { key: 'totalStudents',       label: 'Total Students',       color: 'bg-primary-700', icon: '🎓', link: '/admin/students' },
  { key: 'pendingCertificates', label: 'Certs Pending Review', color: 'bg-amber-600',   icon: '📋', link: '/admin/certificates?status=REQUESTED' },
  { key: 'issuedCertificates',  label: 'Certificates Issued',  color: 'bg-purple-600',  icon: '📜', link: '/admin/certificates?status=ISSUED' },
  { key: 'suspendedInstitutes', label: 'Suspended Institutes', color: 'bg-red-500',     icon: '⏸', link: '/admin/institutes?status=SUSPENDED' },
];

const QUICK_ACTIONS = [
  { label: 'Review Applications', to: '/admin/institutes?status=PENDING_REVIEW', icon: '📋', color: 'border-amber-300 text-amber-700 hover:bg-amber-50' },
  { label: 'All Institutes',      to: '/admin/institutes',                        icon: '🏫', color: 'border-primary-300 text-primary-700 hover:bg-primary-50' },
  { label: 'Student Browser',     to: '/admin/students',                          icon: '🎓', color: 'border-green-300 text-green-700 hover:bg-green-50' },
  { label: 'Certificate Queue',   to: '/admin/certificates?status=REQUESTED',     icon: '📜', color: 'border-purple-300 text-purple-700 hover:bg-purple-50' },
  { label: 'Manage Courses',      to: '/admin/courses',                           icon: '📚', color: 'border-blue-300 text-blue-700 hover:bg-blue-50' },
];

export default function AdminDashboardPage() {
  const { user }  = useAdminAuth();
  const [stats,   setStats]   = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/api/admin/dashboard/stats')
      .then(r => setStats(r.data || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-primary-900">
          Welcome, {user?.fullName?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">AICIT Admin Dashboard</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CARDS.map(card => (
          <Link key={card.key} to={card.link}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5
                       hover:shadow-card-hover transition-shadow group">
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center
                            justify-center text-white text-lg mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl font-heading font-bold text-gray-900">
              {loading ? <span className="animate-pulse bg-gray-200 rounded w-8 h-6 inline-block"/> : (stats[card.key] ?? '—')}
            </p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-heading font-bold text-primary-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {QUICK_ACTIONS.map(action => (
            <Link key={action.label} to={action.to}
              className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-colors text-center ${action.color}`}>
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs font-semibold">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-primary-50 border border-primary-100 rounded-xl p-5">
        <p className="text-sm text-primary-800">
          <strong>Tip:</strong> Newly registered institutes appear in{' '}
          <Link to="/admin/institutes?status=PENDING_REVIEW" className="underline font-semibold">Pending Applications</Link>.
          Approve them to create their login credentials.
        </p>
      </div>
    </div>
  );
}
