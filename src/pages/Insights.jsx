import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import Icon from '../components/Icon';
import { useLanguage } from '../i18n/LanguageContext';
import { insights } from '../data/insights';

const Insights = () => {
  const { language, t } = useLanguage();

  return (
    <>
      <SEO title={t('insightsTitle')} description={t('insightsSubtitle')} path="/insights" />
      <Breadcrumbs items={[{ label: t('navInsights') }]} />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-navy">{t('insightsTitle')}</h1>
          <p className="text-gray-600 text-lg mt-4">{t('insightsSubtitle')}</p>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          {insights.map((insight) => (
            <article key={insight.slug} className="bg-gray-bg rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition flex flex-col">
              <div className="mb-3 flex items-center justify-between">
                <Icon name={insight.icon} className="w-8 h-8 text-gold" />
                <span className="text-xs font-medium text-gold bg-gold/10 px-2.5 py-1 rounded-full">{insight.category}</span>
              </div>
              <h2 className="text-lg font-bold text-navy">{insight.title}</h2>
              <p className="text-gray-600 text-sm mt-2 flex-1">{insight.excerpt}</p>
              <div className="text-xs text-gray-400 mt-4 flex items-center gap-2">
                <time dateTime={insight.publishedDate}>{insight.publishedDate}</time>
                <span aria-hidden="true">·</span>
                <span>{insight.readTime} {t('insightsReadTime')}</span>
              </div>
              <Link
                to={`/${language}/insights/${insight.slug}`}
                className="text-gold text-sm font-medium mt-4 inline-block hover:underline"
              >
                {t('ctaReadMore')} →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default Insights;
