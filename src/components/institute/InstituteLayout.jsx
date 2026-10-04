import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useInstituteAuth } from '../../contexts/InstituteAuthContext.jsx';

const NAV = [
  {
    label: 'Dashboard',
    to: '/institute/dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>
      </svg>
    ),
  },
  {
    label: 'Students',
    to: '/institute/students',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
      </svg>
    ),
  },
  {
    label: 'Certificates',
    to: '/institute/certificates',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-.47 3.852 3.745 3.745 0 01-3.852.47A3.745 3.745 0 0112 21 3.745 3.745 0 019.768 19.8a3.745 3.745 0 01-3.852-.47 3.745 3.745 0 01-.47-3.852A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01.47-3.852 3.745 3.745 0 013.852-.47A3.745 3.745 0 0112 3 3.745 3.745 0 0114.232 4.2a3.745 3.745 0 013.852.47 3.745 3.745 0 01.47 3.852A3.745 3.745 0 0121 12z"/>
      </svg>
    ),
  },
  {
    label: 'Profile',
    to: '/institute/profile',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
  },
];

function SidebarContent({ onClose }) {
  const { user, logout } = useInstituteAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/institute/login');
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full bg-primary-950 text-white">
      {/* Logo + institute name */}
      <div className="px-5 py-5 border-b border-primary-800/60">
        <Link to="/institute/dashboard" onClick={onClose}
          className="flex items-center gap-3 group mb-3">
          <img src="/logos/AICIT logo.jpeg" alt="AICIT"
            className="h-9 w-9 rounded-xl object-contain bg-white p-0.5 shadow-card
                       group-hover:shadow-card-hover transition-shadow"
            onError={e => { e.target.style.display='none'; }}
          />
          <div>
            <div className="text-white font-heading font-extrabold text-base tracking-wider">AICIT</div>
            <div className="text-blue-400 text-[9px] font-medium tracking-wide uppercase">Institute Portal</div>
          </div>
        </Link>
        {user?.instituteName && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-900/60">
            <span className="w-2 h-2 rounded-full bg-trust-500 flex-shrink-0" />
            <span className="text-xs text-blue-200 font-medium truncate">{user.instituteName}</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest px-3 mb-2">Portal</p>
        {NAV.map(({ label, to, icon }) => (
          <NavLink key={to} to={to} onClick={onClose}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'}>
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}

        <div className="pt-4">
          <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest px-3 mb-2">External</p>
          <Link to="/verify" onClick={onClose} target="_blank"
            className="sidebar-link text-blue-300 hover:text-white">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-.47 3.852 3.745 3.745 0 01-3.852.47A3.745 3.745 0 0112 21 3.745 3.745 0 019.768 19.8a3.745 3.745 0 01-3.852-.47 3.745 3.745 0 01-.47-3.852A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01.47-3.852 3.745 3.745 0 013.852-.47A3.745 3.745 0 0112 3 3.745 3.745 0 0114.232 4.2a3.745 3.745 0 013.852.47 3.745 3.745 0 01.47 3.852A3.745 3.745 0 0121 12z"/>
            </svg>
            <span>Verify Certificate</span>
          </Link>
          <Link to="/" onClick={onClose}
            className="sidebar-link text-blue-300 hover:text-white">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>
            </svg>
            <span>Public Website</span>
          </Link>
        </div>
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-primary-800/60">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-primary-900/60 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary-700 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">
              {user?.fullName?.[0] || user?.email?.[0] || 'I'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {user?.fullName || 'Institute Admin'}
            </div>
            <div className="text-[10px] text-blue-400 truncate">{user?.email}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium
                     text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/>
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function InstituteLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface-100 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-shrink-0 flex-col shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"
               onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 flex-shrink-0 shadow-2xl animate-slide-in-left">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center
                           justify-between px-4 sm:px-6 flex-shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-surface-100 transition-colors"
              aria-label="Open sidebar">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
              </svg>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <span>AICIT</span>
              <span className="text-gray-300">/</span>
              <span className="font-semibold text-gray-700">Institute Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex badge badge-blue text-xs">Institute</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
