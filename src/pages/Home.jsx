import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import ServiceCard from '../components/ServiceCard';
import SEO from '../components/SEO';
import { useLanguage } from '../i18n/LanguageContext';
import { useModal } from '../context/ModalContext';
import { regions, hubs } from '../data/regions';
import { insights } from '../data/insights';
import { SITE_URL, WHATSAPP_NUMBER } from '../lib/siteConfig';

const stats = [
  { key: 'statYears', value: '10+' },
  { key: 'statMarkets', value: '50+' },
  { key: 'statProjects', value: '200+' },
  { key: 'statSatisfaction', value: '98%' },
];

const values = [
  { titleKey: 'value1', descKey: 'value1Desc', icon: 'shield' },
  { titleKey: 'value2', descKey: 'value2Desc', icon: 'award' },
  { titleKey: 'value3', descKey: 'value3Desc', icon: 'globe' },
];

const Home = () => {
  const { language, t } = useLanguage();
  const { openBooking, openPortal } = useModal();
  const [activeTab, setActiveTab] = useState('sourcing');

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ENZ INTERNATIONAL',
    url: `${SITE_URL}/${language}`,
    image: `${SITE_URL}/images/enz-logo.png`,
    telephone: '+86-1320-384-0456',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Guangzhou',
      addressCountry: 'CN',
    },
    areaServed: regions.map((r) => r.name),
  };

  const handleWhatsApp = () => window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank', 'noopener,noreferrer');

  return (
    <>
      <SEO
        title={t('heroTitle')}
        description={t('heroSub')}
        path=""
        jsonLd={localBusinessJsonLd}
      />

      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-navy via-slate-blue to-navy text-white py-20 md:py-32 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkNGFmMzciIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoNHY0aC00em0tMTAgMGgtNHYtNGg0djR6bTEwLTEwaC00di00aDR2NHptLTEwIDBINGwtNCA0aDE2eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="bg-gold/20 text-gold text-xs font-semibold px-4 py-1.5 rounded-full border border-gold/30">
                {t('heroBadge1')}
              </span>
              <span className="bg-white/10 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20">
                {t('heroBadge2')}
              </span>
              <span className="bg-white/10 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20">
                {t('heroBadge3')}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">{t('heroTitle')}</h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">{t('heroSub')}</p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <button
                onClick={openBooking}
                className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded-full shadow-lg transition flex items-center gap-2"
              >
                <Icon name="calendar" className="w-5 h-5" /> {t('ctaBooking')}
              </button>
              <button
                onClick={openPortal}
                className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full transition flex items-center gap-2"
              >
                <Icon name="user" className="w-5 h-5" /> {t('ctaPortal')}
              </button>
              <button
                onClick={handleWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-full transition flex items-center gap-2"
              >
                <Icon name="whatsapp" className="w-5 h-5" /> {t('footerWhatsapp')}
              </button>
            </div>
            <ul className="flex flex-wrap justify-center items-center gap-6 mt-12 text-white/60 text-sm list-none">
              <li className="flex items-center gap-1"><Icon name="check" className="w-4 h-4 text-gold" /> {t('trustYears')}</li>
              <li className="flex items-center gap-1"><Icon name="check" className="w-4 h-4 text-gold" /> {t('trustMarkets')}</li>
              <li className="flex items-center gap-1"><Icon name="check" className="w-4 h-4 text-gold" /> {t('trustCert')}</li>
              <li className="flex items-center gap-1"><Icon name="check" className="w-4 h-4 text-gold" /> {t('trustProjects')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== ABOUT + STATS ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy">{t('aboutTitle')}</h2>
            <p className="text-gray-600 text-lg mt-4 leading-relaxed">{t('aboutDesc')}</p>
            <Link to={`/${language}/about`} className="inline-block mt-4 text-gold font-medium hover:underline">
              {t('ctaLearnMore')} →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.key} className="bg-gray-bg rounded-2xl p-6 text-center border border-gray-200">
                <div className="text-3xl font-bold text-gold">{stat.value}</div>
                <div className="text-sm text-gray-600 mt-1">{t(stat.key)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-20 bg-gray-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-navy text-center">{t('servicesTitle')}</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mt-3">{t('servicesSubtitle')}</p>
          <div className="flex justify-center gap-4 mt-8" role="tablist" aria-label={t('servicesTitle')}>
            <button
              role="tab"
              aria-selected={activeTab === 'sourcing'}
              onClick={() => setActiveTab('sourcing')}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition ${
                activeTab === 'sourcing' ? 'bg-navy text-white shadow-md' : 'bg-white text-navy/70 hover:bg-gray-200'
              }`}
            >
              {t('tabSourcing')}
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'factory'}
              onClick={() => setActiveTab('factory')}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition ${
                activeTab === 'factory' ? 'bg-navy text-white shadow-md' : 'bg-white text-navy/70 hover:bg-gray-200'
              }`}
            >
              {t('tabFactory')}
            </button>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTab === 'sourcing' ? (
              <>
                <ServiceCard title={t('service1')} desc={t('service1Desc')} icon="globe" />
                <ServiceCard title={t('service3')} desc={t('service3Desc')} icon="user" />
                <ServiceCard title="Commodity Trading" desc="Copper, cobalt, agricultural, and more." icon="trendingUp" />
              </>
            ) : (
              <>
                <ServiceCard title={t('service2')} desc={t('service2Desc')} icon="calendar" />
                <ServiceCard title="Assembly Line Planning" desc="Customized factory floor design." icon="briefcase" />
                <ServiceCard title="Machinery Sourcing" desc="Reliable equipment from vetted vendors." icon="globe" />
              </>
            )}
          </div>
          <div className="text-center mt-10">
            <Link
              to={`/${language}/services`}
              className="inline-flex items-center gap-2 text-navy font-medium border border-navy/20 rounded-full px-6 py-3 hover:bg-white transition"
            >
              {t('ctaViewAll')} <Icon name="chevronRight" className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center">{t('valueTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 max-w-5xl mx-auto">
            {values.map((v) => (
              <div key={v.titleKey} className="bg-gray-bg rounded-2xl p-8 text-center border border-gray-200 hover:shadow-lg transition">
                <div className="flex justify-center mb-4">
                  <Icon name={v.icon} className="w-12 h-12 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-navy">{t(v.titleKey)}</h3>
                <p className="text-gray-600 text-sm mt-2">{t(v.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GLOBAL FOOTPRINT ===== */}
      <section className="py-16 bg-gray-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center">{t('footprintTitle')}</h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-10">
            {regions.map((r) => (
              <div
                key={r.code}
                className="bg-white rounded-xl shadow-sm px-5 py-3 flex items-center gap-3 border border-gray-100 min-w-[80px] justify-center"
              >
                <span className="text-xl font-bold text-gold">{r.code}</span>
                <span className="text-sm font-medium text-navy">{r.name}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            <span className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full shadow-sm mx-auto w-fit">
              <Icon name="mapPin" className="w-4 h-4 text-gold" />
              {t('footprintHubsLabel')}: {hubs.join(' · ')}
            </span>
          </div>
        </div>
      </section>

      {/* ===== INSIGHTS PREVIEW ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center">{t('insightsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 max-w-6xl mx-auto">
            {insights.map((insight) => (
              <div key={insight.slug} className="bg-gray-bg rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition">
                <div className="mb-3">
                  <Icon name={insight.icon} className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-lg font-bold text-navy">{insight.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{insight.excerpt}</p>
                <Link
                  to={`/${language}/insights/${insight.slug}`}
                  className="text-gold text-sm font-medium mt-3 inline-block hover:underline"
                >
                  {t('ctaReadMore')} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16 bg-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">{t('ctaBannerTitle')}</h2>
          <p className="text-white/70 text-lg mt-3 max-w-2xl mx-auto">{t('ctaBannerDesc')}</p>
          <button
            onClick={openBooking}
            className="mt-6 bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded-full shadow-lg transition inline-flex items-center gap-2"
          >
            <Icon name="calendar" className="w-5 h-5" /> {t('ctaBooking')}
          </button>
        </div>
      </section>
    </>
  );
};

export default Home;
