import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import Icon from '../components/Icon';
import { useLanguage } from '../i18n/LanguageContext';
import { markets } from '../data/markets';

const Markets = () => {
  const { language, t } = useLanguage();

  return (
    <>
      <SEO title={t('marketsTitle')} description={t('marketsSubtitle')} path="/markets" />
      <Breadcrumbs items={[{ label: t('navMarkets') }]} />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-navy">{t('marketsTitle')}</h1>
          <p className="text-gray-600 text-lg mt-4">{t('marketsSubtitle')}</p>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
          {markets.map((market) => (
            <Link
              key={market.slug}
              to={`/${language}/markets/${market.slug}`}
              className="bg-gray-bg rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition flex items-start gap-4"
            >
              <span className="text-xl font-bold text-gold shrink-0">{market.region}</span>
              <div>
                <h2 className="font-bold text-navy">{market.name}</h2>
                <p className="text-sm text-gray-600 mt-1">{market.heroLine}</p>
              </div>
              <Icon name="chevronRight" className="w-5 h-5 text-gray-300 ml-auto shrink-0 self-center" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Markets;
