import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import Icon from '../components/Icon';
import Reveal from '../components/Reveal';
import { useLanguage } from '../i18n/LanguageContext';
import { useModal } from '../context/ModalContext';
import { services } from '../data/services';
import { SITE_URL } from '../lib/siteConfig';

const engagementModels = [
  {
    title: 'Single Sourcing Project',
    desc: 'One product, one order. Ideal for testing a new supplier relationship or a one-off procurement need.',
    fits: 'First-time buyers, sample orders, seasonal purchases',
    icon: 'briefcase',
  },
  {
    title: 'Ongoing Retainer',
    desc: 'Continuous sourcing and quality control across multiple SKUs and repeat orders, with a dedicated point of contact.',
    fits: 'Growing brands with recurring purchase cycles',
    icon: 'calendar',
  },
  {
    title: 'Full Factory Partnership',
    desc: 'End-to-end factory establishment plus ongoing operational and sourcing support after commissioning.',
    fits: 'Businesses localizing production in a new market',
    icon: 'award',
  },
];

const Services = () => {
  const { language, t } = useLanguage();
  const { openBooking } = useModal();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, idx) => ({
      '@type': 'Service',
      position: idx + 1,
      name: t(s.titleKey),
      description: t(s.descKey),
      provider: { '@type': 'Organization', name: 'ENZ INTERNATIONAL' },
      url: `${SITE_URL}/${language}/services#${s.slug}`,
    })),
  };

  return (
    <>
      <SEO
        title={t('servicesTitle')}
        description={t('servicesSubtitle')}
        path="/services"
        jsonLd={jsonLd}
      />
      <Breadcrumbs items={[{ label: t('navServices') }]} />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-navy">{t('servicesTitle')}</h1>
          <p className="text-gray-600 text-lg mt-4">{t('servicesSubtitle')}</p>
          <nav aria-label="Jump to service" className="flex flex-wrap justify-center gap-3 mt-8">
            {services.map((s) => (
              <a
                key={s.slug}
                href={`#${s.slug}`}
                className="text-sm font-medium text-navy border border-navy/15 rounded-full px-4 py-2 hover:bg-gray-bg hover:border-gold/40 transition"
              >
                {t(s.titleKey)}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {services.map((service, idx) => (
        <section
          id={service.slug}
          key={service.slug}
          className={`py-16 scroll-mt-24 ${idx % 2 === 0 ? 'bg-gray-bg' : 'bg-white'}`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start max-w-5xl">
            <Reveal>
              <Icon name={service.icon} className="w-10 h-10 text-gold mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-navy">{t(service.titleKey)}</h2>
              <p className="text-gold font-medium mt-1">{service.tagline}</p>
              <p className="text-gray-600 mt-4">{t(service.descKey)}</p>
              <ul className="mt-6 space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                    <Icon name="check" className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={openBooking}
                className="mt-8 bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded-full transition inline-flex items-center gap-2"
              >
                <Icon name="calendar" className="w-4 h-4" /> {t('ctaBooking')}
              </button>
            </Reveal>

            <Reveal delay={100} as="ol" className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
              {service.process.map((p, stepIdx) => (
                <li key={p.step} className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-navy text-gold text-sm font-bold flex items-center justify-center">
                    {stepIdx + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-navy">{p.step}</p>
                    <p className="text-sm text-gray-600">{p.desc}</p>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      ))}

      {/* ===== ENGAGEMENT MODELS ===== */}
      <section className="py-16 bg-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold">How We Can Work Together</h2>
            <p className="text-white/70 mt-3">Three engagement models, scoped to how much of the process you want us to own.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
            {engagementModels.map((m, idx) => (
              <Reveal key={m.title} delay={idx * 90} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-gold/30 hover:bg-white/10 transition">
                <Icon name={m.icon} className="w-8 h-8 text-gold mb-3" />
                <h3 className="font-bold">{m.title}</h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">{m.desc}</p>
                <p className="text-gold text-xs mt-4 font-medium uppercase tracking-wide">Best for</p>
                <p className="text-white/70 text-sm mt-1">{m.fits}</p>
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={openBooking}
              className="bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded-full shadow-lg transition inline-flex items-center gap-2"
            >
              <Icon name="calendar" className="w-5 h-5" /> {t('ctaBooking')}
            </button>
            <p className="text-white/50 text-sm mt-4">
              Have questions first?{' '}
              <Link to={`/${language}/contact`} className="text-gold hover:underline">
                See our FAQ
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
