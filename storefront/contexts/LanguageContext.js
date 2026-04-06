import { createContext, useContext, useState, useEffect } from 'react';
import t from '../lib/translations';

const LanguageContext = createContext(null);

export const LANGUAGES = [
  { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English', dir: 'ltr' },
  { code: 'fr', label: 'FR', flag: '🇫🇷', name: 'Français', dir: 'ltr' },
  { code: 'ar', label: 'AR', flag: '🇩🇿', name: 'العربية', dir: 'rtl' },
];

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('ep_lang') || 'en';
    if (t[saved]) setLang(saved);
  }, []);

  const switchLang = (code) => {
    if (!t[code]) return;
    setLang(code);
    localStorage.setItem('ep_lang', code);
  };

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const tr = t[lang] || t.en;

  return (
    <LanguageContext.Provider value={{ lang, switchLang, tr, currentLang, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
