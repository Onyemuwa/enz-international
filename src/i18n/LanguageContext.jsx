import { createContext, useContext, useMemo, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import dict, { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { lang } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const language = SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;

  const t = useCallback(
    (key, vars) => {
      let str = dict[language]?.[key] ?? dict[DEFAULT_LANGUAGE]?.[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, v);
        });
      }
      return str;
    },
    [language]
  );

  const setLanguage = useCallback(
    (nextLang) => {
      if (!SUPPORTED_LANGUAGES.includes(nextLang)) return;
      const segments = location.pathname.split('/').filter(Boolean);
      segments[0] = nextLang;
      navigate(`/${segments.join('/')}${location.search}`);
    },
    [location, navigate]
  );

  const value = useMemo(() => ({ language, t, setLanguage }), [language, t, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
