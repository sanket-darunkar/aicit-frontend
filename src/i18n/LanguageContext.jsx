import React, { createContext, useContext, useState, useCallback } from 'react';
import { t as translate } from './translations.js';

const STORAGE_KEY = 'aicit_lang';
const SUPPORTED   = ['en', 'mr', 'hi'];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(saved) ? saved : 'en';
  });

  const setLang = useCallback((code) => {
    if (!SUPPORTED.includes(code)) return;
    setLangState(code);
    localStorage.setItem(STORAGE_KEY, code);
    // Update html lang attribute for accessibility
    document.documentElement.lang = code;
  }, []);

  /** Translate helper bound to current language */
  const t = useCallback((keyPath) => translate(keyPath, lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, supported: SUPPORTED }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider');
  return ctx;
}
