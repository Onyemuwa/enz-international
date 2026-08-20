import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { useLanguage } from '../i18n/LanguageContext';
import { useModal } from '../context/ModalContext';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES } from '../i18n/translations';

const NAV_ITEMS = [
  { to: '', key: 'navHome' },
  { to: '/services', key: 'navServices' },
  { to: '/markets', key: 'navMarkets' },
  { to: '/about', key: 'navAbout' },
  { to: '/insights', key: 'navInsights' },
  { to: '/contact', key: 'navContact' },
];

const Header = () => {
  const { language, t, setLanguage } = useLanguage();
  const { openPortal } = useModal();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkTo = (to) => `/${language}${to}`;

  return (
    <header className="bg-navy text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link to={linkTo('')} className="flex items-center space-x-3" aria-label={`${t('breadcrumbHome')} — ENZ INTERNATIONAL`}>
          <img
            src="/images/enz-logo.png"
            alt="ENZ INTERNATIONAL"
            width="140"
            height="40"
            className="h-10 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link key={item.key} to={linkTo(item.to)} className="hover:text-gold transition-colors">
              {t(item.key)}
            </Link>
          ))}
          <button
            onClick={openPortal}
            className="flex items-center space-x-1 border border-gold/40 px-4 py-1.5 rounded-full text-gold hover:bg-gold/10 transition"
          >
            <Icon name="user" className="w-4 h-4" />
            <span>{t('navPortal')}</span>
          </button>
          <label className="sr-only" htmlFor="lang-select-desktop">
            Language
          </label>
          <select
            id="lang-select-desktop"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-navy border border-white/20 rounded-md px-2 py-1 text-xs cursor-pointer focus:outline-gold/50"
          >
            {SUPPORTED_LANGUAGES.map((lng) => (
              <option key={lng} value={lng}>
                {lng.toUpperCase()}
              </option>
            ))}
          </select>
        </nav>

        <button
          className="lg:hidden text-white"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <Icon name="close" className="w-7 h-7" /> : <Icon name="menu" className="w-7 h-7" />}
        </button>
      </div>

      {isMenuOpen && (
        <nav id="mobile-nav" aria-label="Primary" className="lg:hidden bg-navy/95 backdrop-blur-md border-t border-white/10 px-4 py-6 space-y-4 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              to={linkTo(item.to)}
              onClick={() => setIsMenuOpen(false)}
              className="block hover:text-gold"
            >
              {t(item.key)}
            </Link>
          ))}
          <button
            onClick={() => {
              openPortal();
              setIsMenuOpen(false);
            }}
            className="flex items-center space-x-2 text-gold border border-gold/40 px-4 py-1.5 rounded-full w-fit"
          >
            <Icon name="user" className="w-4 h-4" />
            <span>{t('navPortal')}</span>
          </button>
          <div className="pt-2">
            <label className="sr-only" htmlFor="lang-select-mobile">
              Language
            </label>
            <select
              id="lang-select-mobile"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-navy border border-white/20 rounded-md px-3 py-1.5 text-xs w-full max-w-[140px]"
            >
              {SUPPORTED_LANGUAGES.map((lng) => (
                <option key={lng} value={lng}>
                  {LANGUAGE_LABELS[lng]}
                </option>
              ))}
            </select>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
