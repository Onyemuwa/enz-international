import { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const STORAGE_KEY = 'enz_cookie_consent'; // 'all' | 'essential'

/**
 * GDPR-style consent banner. Analytics scripts (GA4/GTM/Pixel) must only be
 * loaded after consent === 'all' — see SETUP.md "Analytics" for the gating
 * pattern to use once those integrations are added (Phase 2).
 */
const CookieConsent = () => {
  const { t } = useLanguage();
  const [consent, setConsent] = useState(() => localStorage.getItem(STORAGE_KEY));

  useEffect(() => {
    if (consent) localStorage.setItem(STORAGE_KEY, consent);
  }, [consent]);

  if (consent) return null;

  return (
    <div
      role="dialog"
      aria-label={t('cookieTitle')}
      className="fixed bottom-0 inset-x-0 z-[70] bg-white border-t border-gray-200 shadow-2xl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <p className="font-semibold text-navy text-sm">{t('cookieTitle')}</p>
          <p className="text-xs text-gray-500 mt-1">{t('cookieDesc')}</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setConsent('essential')}
            className="border border-gray-300 text-navy text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-50 transition"
          >
            {t('cookieEssentialOnly')}
          </button>
          <button
            onClick={() => setConsent('all')}
            className="bg-gold hover:bg-gold-light text-navy text-sm font-semibold px-4 py-2 rounded-full transition"
          >
            {t('cookieAcceptAll')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
