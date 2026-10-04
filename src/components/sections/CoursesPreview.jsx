import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { COURSES, COURSE_CATEGORIES } from '../../config/siteConfig.js';
import { useLang } from '../../i18n/LanguageContext.jsx';

const CAT_ICONS = {
  all:        '🌐',
  computer:   '💻',
  accounting: '📊',
  design:     '🎨',
  typing:     '⌨️',
  govt:       '🏛️',
};

const CAT_COLORS = {
  computer:   'bg-blue-100 text-blue-700',
  accounting: 'bg-green-100 text-green-700',
  design:     'bg-purple-100 text-purple-700',
  typing:     'bg-amber-100 text-amber-700',
  govt:       'bg-red-100 text-red-700',
};

function CourseCard({ course }) {
  const { t } = useLang();
  const colorClass = CAT_COLORS[course.category] || 'bg-gray-100 text-gray-700';
  const icon = CAT_ICONS[course.category] || '📚';
  const durationNum = course.duration.split(' ')[0];

  return (
    <div className="card group hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Top accent */}
      <div className={`h-1.5 -mx-6 -mt-6 mb-5 rounded-t-2xl ${colorClass.split(' ')[0]}`} />

      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-primary-900 text-sm leading-snug line-clamp-2">
            {course.name}
          </h3>
        </div>
        {course.featured && (
          <span className="badge badge-gold flex-shrink-0">★ {t('courses.featured')}</span>
        )}
      </div>

      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-50">
        <span className={`badge ${colorClass} text-xs`}>
          {COURSE_CATEGORIES.find(c => c.id === course.category)?.label || course.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {course.duration}
        </span>
      </div>
    </div>
  );
}

export default function CoursesPreview() {
  const { t } = useLang();
  const [active, setActive] = useState('all');

  const filtered = active === 'all'
    ? COURSES.filter(c => c.featured).slice(0, 8)
    : COURSES.filter(c => c.category === active).slice(0, 8);

  return (
    <section className="section-light">
      <div className="container-xl">
        {/* Header */}
        <div className="section-label">
          <div className="eyebrow mx-auto">{t('courses.heading')}</div>
          <h2 className="heading-lg text-primary-900 mt-3">{t('courses.heading')}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mt-3">{t('courses.subheading')}</p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {COURSE_CATEGORIES.map(({ id, label }) => (
            <button key={id} onClick={() => setActive(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                         transition-all duration-200 border
                ${active === id
                  ? 'bg-primary-800 text-white border-primary-800 shadow-card'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700'}`}>
              <span>{CAT_ICONS[id] || '📚'}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map(course => <CourseCard key={course.id} course={course} />)}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link to="/courses" className="btn-outline">
            {t('courses.viewAll')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
