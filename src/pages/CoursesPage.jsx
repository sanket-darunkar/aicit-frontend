import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { searchPublicCourses } from '../services/publicService.js';
import { useLang } from '../i18n/LanguageContext.jsx';

// Category labels produced by the backend catalog import (+ display icons).
const CATEGORIES = [
  { id: '',                          label: 'All Courses',            icon: '🌐' },
  { id: 'Computer & IT',             label: 'Computer & IT',          icon: '💻' },
  { id: 'Programming & Software',    label: 'Programming & Software', icon: '👨‍💻' },
  { id: 'Accounting & Finance',      label: 'Accounting & Finance',   icon: '📊' },
  { id: 'Design & Media',            label: 'Design & Media',         icon: '🎨' },
  { id: 'Typing',                    label: 'Typing',                 icon: '⌨️' },
  { id: 'Engineering & CAD',         label: 'Engineering & CAD',      icon: '📐' },
  { id: 'Hardware & Networking',     label: 'Hardware & Networking',  icon: '🖧' },
  { id: 'Office & Business',         label: 'Office & Business',      icon: '🏢' },
  { id: 'Vocational & Trades',       label: 'Vocational & Trades',    icon: '🛠️' },
];
const ICON_BY_CAT = Object.fromEntries(CATEGORIES.map(c => [c.id, c.icon]));

function CourseCard({ course }) {
  const { t } = useLang();
  const icon = ICON_BY_CAT[course.category] || '📚';
  return (
    <div className="card flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-primary-900 text-sm leading-snug">{course.name}</h3>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">{course.code}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-50">
        {course.category && <span className="badge border bg-gray-100 text-gray-700 border-gray-100 text-[11px]">{course.category}</span>}
        <span className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {course.durationDisplay || '—'}
        </span>
        <Link to="/contact" className="text-xs text-primary-600 hover:text-primary-800 font-semibold transition-colors">
          {t('courses.enquireNow')} →
        </Link>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const { t } = useLang();
  const [courses, setCourses]  = useState([]);
  const [total, setTotal]      = useState(0);
  const [totalPages, setTP]    = useState(0);
  const [loading, setLoading]  = useState(true);
  const [search,  setSearch]   = useState('');
  const [active,  setActive]   = useState('');
  const [page,    setPage]     = useState(0);
  const debounceRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await searchPublicCourses({ search, category: active, page, size: 24, sort: 'name' });
      setCourses(res.data?.content ?? []);
      setTotal(res.data?.totalElements ?? 0);
      setTP(res.data?.totalPages ?? 0);
    } catch {
      setCourses([]);
    } finally { setLoading(false); }
  }, [search, active, page]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(load, 300);
    return () => clearTimeout(debounceRef.current);
  }, [load]);

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 py-12 sm:py-16">
        <div className="container-xl text-center">
          <div className="eyebrow-white mx-auto mb-4">{t('courses.heading')}</div>
          <h1 className="heading-lg text-white mb-3">{t('courses.heading')}</h1>
          <p className="text-blue-200 max-w-lg mx-auto">{t('courses.subheading')}</p>
        </div>
      </div>

      <div className="container-xl py-10">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
            </svg>
            <input type="search" placeholder={`${t('common.search')} courses...`}
              value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
              className="input pl-10 text-sm" />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ id, label, icon }) => (
              <button key={id || 'all'} onClick={() => { setActive(id); setPage(0); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150
                  ${active === id ? 'bg-primary-800 text-white border-primary-800'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'}`}>
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-5 font-medium">
          {loading ? 'Searching…' : <>Found <strong>{total}</strong> course{total !== 1 ? 's' : ''}</>}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card space-y-3">
                <div className="skeleton h-5 w-3/4" /><div className="skeleton h-3 w-full" /><div className="skeleton h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500 font-medium">{t('common.noData')}</p>
            <button onClick={() => { setSearch(''); setActive(''); setPage(0); }}
              className="btn-ghost mt-3 text-sm">Clear filters</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {courses.map((c) => <CourseCard key={c.id} course={c} />)}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 bg-white">← Previous</button>
                <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
                <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 bg-white">Next →</button>
              </div>
            )}
          </>
        )}

        <div className="mt-12 bg-gradient-to-r from-primary-800 to-primary-900 rounded-3xl p-8 text-center">
          <h3 className="heading-sm text-white mb-3">Ready to Get Certified?</h3>
          <p className="text-blue-200 mb-6 max-w-md mx-auto text-sm">
            Register your institute with AICIT and start offering certified courses to students across India.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/register-institute" className="btn-gold">{t('nav.registerInstitute')}</Link>
            <Link to="/contact" className="btn-white">{t('nav.contact')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
