import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { translations, LANGUAGES } from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useLocalStorage('arf.lang', 'vi');

  const t = useCallback(
    (key, fallback) => translations[lang]?.[key] ?? translations['en']?.[key] ?? fallback ?? key,
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, t, languages: LANGUAGES }),
    [lang, setLang, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be inside LanguageProvider');
  return ctx;
}

export default LanguageContext;
