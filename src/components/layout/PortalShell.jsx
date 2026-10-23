import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

/**
 * Shared premium shell for both Admin and Institute portals.
 * - Collapsible desktop sidebar (persisted in localStorage)
 * - Mobile slide-in drawer
 * - Top bar with page context, profile menu, and a public-site link
 *
 * props:
 *  - brand      : { title, subtitle }  (e.g. { title:'AICIT', subtitle:'Admin Portal' })
 *  - nav        : [{ label, to, icon, end? }]
 *  - extraNav   : optional [{ label, to, icon, external? }]
 *  - user       : { fullName, email, role }
 *  - onLogout   : () => void
 *  - loginPath  : where to send after logout
 *  - accent     : tailwind color token prefix for the active state (default 'primary')
 *  - children   : page content
 */
export default function PortalShell({ brand, nav, extraNav = [], user, onLogout, loginPath, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('aicit_sidebar_collapsed') === '1'
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  // Persist collapse state
  useEffect(() => {
    localStorage.setItem('aicit_sidebar_collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  // Close profile menu on outside click
  useEffect(() => {
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => { onLogout(); navigate(loginPath); };

  const currentLabel =
    [...nav].reverse().find(n => location.pathname.startsWith(n.to.split('?')[0]))?.label || brand.subtitle;

  const NavItem = ({ item, onNavigate }) => (
    <NavLink to={item.to} end={item.end} onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) => `group flex items-center gap-3 rounded-xl text-sm font-medium
        transition-all duration-150 ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'}
        ${isActive
          ? 'bg-white/10 text-white shadow-inner-blue'
          : 'text-blue-100/70 hover:text-white hover:bg-white/5'}`}>
      {({ isActive }) => (
        <>
          <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-blue-300/80 group-hover:text-white'}`}>
            {item.icon}
          </span>
          {!collapsed && <span className="truncate">{item.label}</span>}
          {!collapsed && isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400" />}
        </>
      )}
    </NavLink>
  );

  const Sidebar = ({ mobile }) => (
    <div className="flex flex-col h-full bg-gradient-to-b from-primary-900 to-primary-950 text-white">
      {/* Brand */}
      <div className={`flex items-center gap-3 border-b border-white/10 ${collapsed && !mobile ? 'px-0 justify-center py-5' : 'px-5 py-5'}`}>
        <Link to={nav[0]?.to || '/'} className="flex items-center gap-3 min-w-0">
          <img src="/logos/AICIT-logo.png" alt="AICIT"
            className="h-9 w-9 rounded-xl object-contain flex-shrink-0 bg-white/5 p-0.5"
            onError={e => { e.target.style.display = 'none'; }} />
          {(!collapsed || mobile) && (
            <div className="min-w-0">
              <div className="font-heading font-extrabold text-base tracking-wider leading-none">{brand.title}</div>
              <div className="text-blue-300 text-[9px] font-semibold tracking-widest uppercase mt-1">{brand.subtitle}</div>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {(!collapsed || mobile) && (
          <p className="text-[9px] font-bold text-blue-400/70 uppercase tracking-widest px-3 mb-2">Menu</p>
        )}
        {nav.map(item => <NavItem key={item.to} item={item} onNavigate={mobile ? () => setDrawerOpen(false) : undefined} />)}

        {extraNav.length > 0 && (
          <div className="pt-4">
            {(!collapsed || mobile) && (
              <p className="text-[9px] font-bold text-blue-400/70 uppercase tracking-widest px-3 mb-2">Quick Access</p>
            )}
            {extraNav.map(item => (
              item.external
                ? <a key={item.to} href={item.to} target="_blank" rel="noreferrer"
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 rounded-xl text-sm font-medium text-blue-100/70
                               hover:text-white hover:bg-white/5 transition-all ${collapsed && !mobile ? 'justify-center py-2.5' : 'px-3 py-2.5'}`}>
                    <span className="text-blue-300/80 flex-shrink-0">{item.icon}</span>
                    {(!collapsed || mobile) && <span className="truncate">{item.label}</span>}
                  </a>
                : <NavItem key={item.to} item={item} onNavigate={mobile ? () => setDrawerOpen(false) : undefined} />
            ))}
          </div>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className={`flex items-center gap-3 rounded-xl bg-white/5 ${collapsed && !mobile ? 'justify-center p-2' : 'px-3 py-2.5'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700
                          flex items-center justify-center flex-shrink-0 ring-1 ring-white/20">
            <span className="text-sm font-bold text-white">{user?.fullName?.[0] || user?.email?.[0] || 'U'}</span>
          </div>
          {(!collapsed || mobile) && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user?.fullName || 'User'}</div>
              <div className="text-[10px] text-blue-300 truncate">{user?.role?.replace(/_/g, ' ') || ''}</div>
            </div>
          )}
        </div>
        {(!collapsed || mobile) && (
          <button onClick={handleLogout}
            className="w-full mt-2 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium
                       text-red-300 hover:bg-red-500/15 hover:text-red-200 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sign Out
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-surface-100 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-shrink-0 flex-col shadow-xl transition-all duration-200
                        ${collapsed ? 'w-[76px]' : 'w-64'}`}>
        <Sidebar mobile={false} />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-[90] flex">
          <div className="fixed inset-0 bg-primary-950/60 backdrop-blur-sm animate-fade-in"
               onClick={() => setDrawerOpen(false)} />
          <aside className="relative w-72 max-w-[82%] flex-shrink-0 shadow-2xl animate-slide-in-left">
            <Sidebar mobile />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-white/90 backdrop-blur border-b border-gray-100 flex items-center
                           justify-between px-3 sm:px-6 flex-shrink-0 z-20">
          <div className="flex items-center gap-2 min-w-0">
            <button onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-surface-100 transition-colors"
              aria-label="Open menu">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            </button>
            <button onClick={() => setCollapsed(c => !c)}
              className="hidden md:inline-flex p-2 rounded-lg text-gray-400 hover:bg-surface-100 hover:text-gray-600 transition-colors"
              aria-label="Toggle sidebar">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" /></svg>
            </button>
            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <span className="text-xs text-gray-400">{brand.title}</span>
              <span className="text-gray-300">/</span>
              <span className="text-xs font-semibold text-gray-700 truncate">{currentLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <a href="/" target="_blank" rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                         text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
              Public Site
            </a>

            {/* Profile menu */}
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-surface-100 transition-colors">
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-800
                                 flex items-center justify-center text-white text-sm font-bold">
                  {user?.fullName?.[0] || user?.email?.[0] || 'U'}
                </span>
                <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-gray-100 shadow-card-hover
                                py-2 animate-slide-up z-30">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full uppercase">
                      {user?.role?.replace(/_/g, ' ') || 'User'}
                    </span>
                  </div>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto page-enter">{children}</div>
        </main>
      </div>
    </div>
  );
}
