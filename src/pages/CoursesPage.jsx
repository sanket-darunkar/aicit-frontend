import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublicCourses } from '../services/publicService.js';
import { COURSES, COURSE_CATEGORIES } from '../config/siteConfig.js';
import { useLang } from '../i18n/LanguageContext.jsx';

const CAT_ICONS = { computer:'💻', accounting:'📊', design:'🎨', typing:'⌨️', govt:'🏛️' };
const CAT_COLORS = {
  computer:   'bg-blue-100 text-blue-700 border-blue-100',
  accounting: 'bg-green-100 text-green-700 border-green-100',
  design:     'bg-purple-100 text-purple-700 border-purple-100',
  typing:     'bg-amber-100 text-amber-700 border-amber-100',
  govt:       'bg-red-100 text-red-700 border-red-100',
};

function CourseCard({ course }) {
  const { t } = useLang();
  const cat   = course.category || '';
  const color = CAT_COLORS[cat] || 'bg-gray-100 text-gray-700 border-gray-100';
  const icon  = CAT_ICONS[cat]  || '📚';

  return (
    <div className="card flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-primary-900 text-sm leading-snug">
            {course.name}
          </h3>
          {course.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{course.description}</p>
          )}
        </div>
        {course.featured && (
          <span className="badge badge-gold flex-shrink-0 text-[10px]">★ Popular</span>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-50">
        <span className={`badge border ${color} text-[11px]`}>
          {COURSE_CATEGORIES.find(c => c.id === cat)?.label || cat}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {course.duration}
        </span>
        <Link to="/contact"
          className="text-xs text-primary-600 hover:text-primary-800 font-semibold transition-colors">
          {t('courses.enquireNow')} →
        </Link>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const { t } = useLang();
  const [liveCourses, setLive]   = useState(null);
  const [loading, setLoading]    = useState(true);
  const [search,  setSearch]     = useState('');
  const [active,  setActive]     = useState('all');

  useEffect(() => {
    getPublicCourses()
      .then(r => setLive(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // merge live into static for display
  const allCourses = liveCourses && liveCourses.length > 0
    ? liveCourses.map(lc => {
        const s = COURSES.find(c => c.name === lc.name);
        return { ...lc, category: s?.category || 'computer', featured: s?.featured || false };
      })
    : COURSES;

  const displayed = allCourses
    .filter(c => active === 'all' || c.category === active)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-900 to-primary-800 py-12 sm:py-16">
        <div className="container-xl text-center">
          <div className="eyebrow-white mx-auto mb-4">{t('courses.heading')}</div>
          <h1 className="heading-lg text-white mb-3">{t('courses.heading')}</h1>
          <p className="text-blue-200 max-w-lg mx-auto">{t('courses.subheading')}</p>
        </div>
      </div>

      <div className="container-xl py-10">
        {/* Search + filter row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
            </svg>
            <input type="search" placeholder={`${t('common.search')} courses...`}
              value={search} onChange={e => setSearch(e.target.value)}
              className="input pl-10 text-sm" />
          </div>
          <div className="flex flex-wrap gap-2">
            {COURSE_CATEGORIES.map(({ id, label }) => (
              <button key={id} onClick={() => setActive(id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                           border transition-all duration-150
                  ${active === id
                    ? 'bg-primary-800 text-white border-primary-800'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'}`}>
                {CAT_ICONS[id] || '📚'} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-500 mb-5 font-medium">
          Showing <strong>{displayed.length}</strong> course{displayed.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card space-y-3">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500 font-medium">{t('common.noData')}</p>
            <button onClick={() => { setSearch(''); setActive('all'); }}
              className="btn-ghost mt-3 text-sm">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayed.map((c, i) => <CourseCard key={c.id || i} course={c} />)}
          </div>
        )}

        {/* CTA */}
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
