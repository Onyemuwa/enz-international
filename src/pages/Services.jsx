import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import Icon from '../components/Icon';
import { useLanguage } from '../i18n/LanguageContext';
import { useModal } from '../context/ModalContext';
import { services } from '../data/services';
import { SITE_URL } from '../lib/siteConfig';

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
        </div>
      </section>

      {services.map((service, idx) => (
        <section
          id={service.slug}
          key={service.slug}
          className={`py-16 scroll-mt-24 ${idx % 2 === 0 ? 'bg-gray-bg' : 'bg-white'}`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start max-w-5xl">
            <div>
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
            </div>

            <ol className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
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
            </ol>
          </div>
        </section>
      ))}
    </>
  );
};

export default Services;
