import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { useLanguage } from '../i18n/LanguageContext';
import { subscribeNewsletter } from '../lib/api';
import { CONTACT_PHONE, WHATSAPP_NUMBER } from '../lib/siteConfig';
import { hubs } from '../data/regions';

const Footer = () => {
  const { language, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const linkTo = (to) => `/${language}${to}`;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    await subscribeNewsletter(email);
    setSubscribed(true);
    setEmail('');
  };

  const handleWhatsApp = () => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank', 'noopener,noreferrer');

  return (
    <footer className="bg-navy text-white/70 py-12 border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <img src="/images/enz-logo.png" alt="ENZ INTERNATIONAL" width="140" height="40" className="h-10 w-auto object-contain mb-3" />
          <p className="text-sm max-w-xs">{t('footerAbout')}</p>
        </div>

        <div>
          <h2 className="text-white font-semibold text-sm mb-3">{t('footerServices')}</h2>
          <ul className="text-sm space-y-2">
            <li><Link to={linkTo('/services')} className="hover:text-gold transition">{t('tabSourcing')}</Link></li>
            <li><Link to={linkTo('/services')} className="hover:text-gold transition">{t('tabFactory')}</Link></li>
            <li><Link to={linkTo('/services')} className="hover:text-gold transition">{t('service3')}</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-white font-semibold text-sm mb-3">{t('footerCompany')}</h2>
          <ul className="text-sm space-y-2">
            <li><Link to={linkTo('/about')} className="hover:text-gold transition">{t('navAbout')}</Link></li>
            <li><Link to={linkTo('/insights')} className="hover:text-gold transition">{t('navInsights')}</Link></li>
            <li><Link to={linkTo('/careers')} className="hover:text-gold transition">{t('navCareers')}</Link></li>
            <li><Link to={linkTo('/contact')} className="hover:text-gold transition">{t('navContact')}</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-white font-semibold text-sm mb-3">{t('footerContact')}</h2>
          <p className="text-sm flex items-center gap-2">
            <Icon name="phone" className="w-4 h-4 text-gold" />
            <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="hover:text-gold transition">
              {CONTACT_PHONE}
            </a>
          </p>
          <button
            onClick={handleWhatsApp}
            className="mt-3 flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 px-4 py-2 rounded-full text-sm transition"
          >
            <Icon name="whatsapp" className="w-4 h-4" /> {t('footerWhatsapp')}
          </button>

          <form onSubmit={handleSubscribe} className="mt-6">
            <label htmlFor="newsletter-email" className="text-white font-semibold text-sm block mb-1">
              {t('footerNewsletterTitle')}
            </label>
            <p className="text-xs text-white/50 mb-2">{t('footerNewsletterDesc')}</p>
            {subscribed ? (
              <p className="text-sm text-gold" role="status">{t('footerNewsletterSuccess')}</p>
            ) : (
              <div className="flex gap-2">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footerNewsletterPlaceholder')}
                  className="flex-1 min-w-0 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
                <button type="submit" className="bg-gold text-navy text-sm font-semibold px-3 py-2 rounded-lg hover:bg-gold-light transition">
                  {t('ctaSubscribe')}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
        <p>{t('footerRights', { year: new Date().getFullYear() })}</p>
        <p className="flex items-center gap-1">
          <Icon name="mapPin" className="w-3 h-3" />
          {hubs.join(' · ')}
        </p>
        <div className="flex gap-4">
          <Link to={linkTo('/privacy')} className="hover:text-gold transition">{t('footerPrivacy')}</Link>
          <Link to={linkTo('/terms')} className="hover:text-gold transition">{t('footerTerms')}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
