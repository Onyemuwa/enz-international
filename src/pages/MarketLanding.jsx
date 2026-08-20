import { useParams, Navigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import Icon from '../components/Icon';
import { useLanguage } from '../i18n/LanguageContext';
import { useModal } from '../context/ModalContext';
import { markets } from '../data/markets';
import { services } from '../data/services';

const MarketLanding = () => {
  const { language, t } = useLanguage();
  const { openBooking } = useModal();
  const { marketSlug } = useParams();
  const market = markets.find((m) => m.slug === marketSlug);

  if (!market) return <Navigate to={`/${language}/markets`} replace />;

  return (
    <>
      <SEO
        title={`China Sourcing for ${market.name}`}
        description={market.intro}
        path={`/markets/${market.slug}`}
      />
      <Breadcrumbs items={[{ label: t('navMarkets'), to: '/markets' }, { label: market.name }]} />

      <section className="relative bg-gradient-to-br from-navy via-slate-blue to-navy text-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="bg-gold/20 text-gold text-xs font-semibold px-4 py-1.5 rounded-full border border-gold/30">
            {market.region} · {market.fullName || market.name}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mt-6 leading-tight">{market.heroLine}</h1>
          <p className="text-white/80 text-lg mt-6">{market.intro}</p>
          <button
            onClick={openBooking}
            className="mt-8 bg-gold hover:bg-gold-light text-navy font-semibold px-8 py-4 rounded-full shadow-lg transition inline-flex items-center gap-2"
          >
            <Icon name="calendar" className="w-5 h-5" /> {t('ctaBooking')}
          </button>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-navy text-center">{t('servicesTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 max-w-5xl mx-auto">
            {services.map((service) => (
              <div key={service.slug} className="bg-gray-bg rounded-2xl p-6 border border-gray-200">
                <Icon name={service.icon} className="w-10 h-10 text-gold mb-3" />
                <h3 className="font-bold text-navy">{t(service.titleKey)}</h3>
                <p className="text-sm text-gray-600 mt-2">{t(service.descKey)}</p>
                <Link
                  to={`/${language}/services#${service.slug}`}
                  className="text-gold text-sm font-medium mt-3 inline-block hover:underline"
                >
                  {t('ctaLearnMore')} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-bg text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to={`/${language}/markets`}
            className="inline-flex items-center gap-2 text-navy font-medium hover:text-gold transition"
          >
            <Icon name="arrowLeft" className="w-4 h-4" /> {t('marketPageBackToMarkets')}
          </Link>
        </div>
      </section>
    </>
  );
};

export default MarketLanding;
