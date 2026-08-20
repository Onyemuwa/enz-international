import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import SEO from '../components/SEO';
import { useLanguage } from '../i18n/LanguageContext';

const NotFound = () => {
  const { language, t } = useLanguage();
  return (
    <>
      <SEO title={t('notFoundTitle')} description={t('notFoundDesc')} path="/404" noindex />
      <section className="py-24 bg-white min-h-[60vh] flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold font-bold text-6xl">404</p>
          <h1 className="text-2xl md:text-3xl font-bold text-navy mt-4">{t('notFoundTitle')}</h1>
          <p className="text-gray-600 mt-2">{t('notFoundDesc')}</p>
          <Link
            to={`/${language}`}
            className="inline-flex items-center gap-2 mt-8 bg-gold hover:bg-gold-light text-navy font-semibold px-6 py-3 rounded-full transition"
          >
            <Icon name="arrowLeft" className="w-4 h-4" /> {t('ctaBackHome')}
          </Link>
        </div>
      </section>
    </>
  );
};

export default NotFound;
