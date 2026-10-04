import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LanguageContext.jsx';

export default function PlaceholderPage({ title, description, icon = '🚧' }) {
  const { t } = useLang();
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-surface-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-primary-50 border border-primary-100
                        flex items-center justify-center text-5xl mx-auto mb-6 shadow-xs">
          {icon}
        </div>
        <h1 className="heading-sm text-primary-900 mb-3">{title || t('common.comingSoon')}</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          {description || 'This section is under development and will be available soon.'}
        </p>
        <Link to="/" className="btn-primary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
          </svg>
          {t('common.backHome')}
        </Link>
      </div>
    </div>
  );
}
