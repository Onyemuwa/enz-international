import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import ServiceCard from '../components/ServiceCard';
import SEO from '../components/SEO';
import Reveal from '../components/Reveal';
import AnimatedCounter from '../components/AnimatedCounter';
import { useLanguage } from '../i18n/LanguageContext';
import { useModal } from '../context/ModalContext';
import { regions, hubs } from '../data/regions';
import { insights } from '../data/insights';
import { SITE_URL, WHATSAPP_NUMBER } from '../lib/siteConfig';

const stats = [
  { key: 'statYears', value: 10, suffix: '+' },
  { key: 'statMarkets', value: 50, suffix: '+' },
  { key: 'statProjects', value: 200, suffix: '+' },
  { key: 'statSatisfaction', value: 98, suffix: '%' },
];

const values = [
  { titleKey: 'value1', descKey: 'value1Desc', icon: 'shield' },
  { titleKey: 'value2', descKey: 'value2Desc', icon: 'award' },
  { titleKey: 'value3', descKey: 'value3Desc', icon: 'globe' },
];

const whyItems = [
  { titleKey: 'why1Title', descKey: 'why1Desc', icon: 'shield' },
  { titleKey: 'why2Title', descKey: 'why2Desc', icon: 'briefcase' },
  { titleKey: 'why3Title', descKey: 'why3Desc', icon: 'mapPin' },
  { titleKey: 'why4Title', descKey: 'why4Desc', icon: 'mail' },
  { titleKey: 'why5Title', descKey: 'why5Desc', icon: 'award' },
  { titleKey: 'why6Title', descKey: 'why6Desc', icon: 'check' },
];

const regionServiceTags = {
  TZ: ['service1', 'service2'],
  KE: ['service1', 'service3'],
  CD: ['service1', 'service2'],
  US: ['service1', 'service3'],
  UK: ['service1', 'service3'],
};

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
        {/* Decorative glow orbs — pure CSS, no image assets */}
        <div aria-hidden="true" className="absolute -top-24 -right-24 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-32 -left-24 w-96 h-96 bg-slate-blue/40 rounded-full blur-3xl" />
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
                className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded-full shadow-lg shadow-gold/20 transition flex items-center gap-2 hover:scale-[1.03]"
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
          <Reveal className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy">{t('aboutTitle')}</h2>
            <p className="text-gray-600 text-lg mt-4 leading-relaxed">{t('aboutDesc')}</p>
            <Link to={`/${language}/about`} className="inline-block mt-4 text-gold font-medium hover:underline">
              {t('ctaLearnMore')} →
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <Reveal
                key={stat.key}
                delay={idx * 80}
                className="bg-gray-bg rounded-2xl p-6 text-center border border-gray-200 hover:border-gold/40 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl font-bold text-gold">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-600 mt-1">{t(stat.key)}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY ENZ ===== */}
      <section className="py-20 bg-navy text-white relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.07] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkNGFmMzciIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoNHY0aC00em0tMTAgMGgtNHYtNGg0djR6bTEwLTEwaC00di00aDR2NHptLTEwIDBINGwtNCA0aDE2eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Reveal className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold">{t('whyTitle')}</h2>
            <p className="text-white/70 text-lg mt-3">{t('whySubtitle')}</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 max-w-6xl mx-auto">
            {whyItems.map((item, idx) => (
              <Reveal
                key={item.titleKey}
                delay={idx * 70}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-gold/30 transition"
              >
                <Icon name={item.icon} className="w-8 h-8 text-gold mb-4" />
                <h3 className="font-bold">{t(item.titleKey)}</h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">{t(item.descKey)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-20 bg-gray-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-navy">{t('servicesTitle')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-3">{t('servicesSubtitle')}</p>
          </Reveal>
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
          <Reveal as="h2" className="text-2xl md:text-3xl font-bold text-navy text-center">
            {t('valueTitle')}
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 max-w-5xl mx-auto">
            {values.map((v, idx) => (
              <Reveal
                key={v.titleKey}
                delay={idx * 80}
                className="bg-gray-bg rounded-2xl p-8 text-center border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="flex justify-center mb-4">
                  <Icon name={v.icon} className="w-12 h-12 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-navy">{t(v.titleKey)}</h3>
                <p className="text-gray-600 text-sm mt-2">{t(v.descKey)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GLOBAL FOOTPRINT ===== */}
      <section className="py-20 bg-gray-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-navy">{t('footprintTitle')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-3">{t('footprintHubsLabel')}: {hubs.join(' · ')}</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-12 max-w-6xl mx-auto">
            {regions.map((r, idx) => (
              <Reveal
                key={r.code}
                delay={idx * 60}
                className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:border-gold/40 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-navy text-gold text-sm font-bold flex items-center justify-center shrink-0">
                    {r.code}
                  </span>
                  <span className="font-semibold text-navy">{r.name}</span>
                </div>
                <ul className="mt-4 space-y-1.5">
                  {(regionServiceTags[r.code] || []).map((sk) => (
                    <li key={sk} className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Icon name="check" className="w-3 h-3 text-gold shrink-0" /> {t(sk)}
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/${language}/markets`}
                  className="text-gold text-xs font-medium mt-4 inline-flex items-center gap-1 hover:underline"
                >
                  {t('ctaLearnMore')} <Icon name="chevronRight" className="w-3 h-3" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INSIGHTS PREVIEW ===== */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" className="text-2xl md:text-3xl font-bold text-navy text-center">
            {t('insightsTitle')}
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 max-w-6xl mx-auto">
            {insights.map((insight, idx) => (
              <Reveal
                key={insight.slug}
                delay={idx * 80}
                className="bg-gray-bg rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition"
              >
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16 bg-navy text-white relative overflow-hidden">
        <div aria-hidden="true" className="absolute -top-16 left-1/2 -translate-x-1/2 w-[32rem] h-64 bg-gold/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-2xl md:text-3xl font-bold">{t('ctaBannerTitle')}</h2>
          <p className="text-white/70 text-lg mt-3 max-w-2xl mx-auto">{t('ctaBannerDesc')}</p>
          <button
            onClick={openBooking}
            className="mt-6 bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded-full shadow-lg transition inline-flex items-center gap-2 hover:scale-[1.03]"
          >
            <Icon name="calendar" className="w-5 h-5" /> {t('ctaBooking')}
          </button>
        </div>
      </section>
    </>
  );
};

export default Home;
