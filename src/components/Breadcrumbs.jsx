import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { SITE_URL } from '../lib/siteConfig';
import { Helmet } from 'react-helmet-async';

/**
 * items: [{ label, to }] — final item should omit `to` (current page).
 * Also emits BreadcrumbList structured data for SEO.
 */
const Breadcrumbs = ({ items }) => {
  const { language, t } = useLanguage();
  const linkTo = (to) => `/${language}${to}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('breadcrumbHome'), item: `${SITE_URL}/${language}` },
      ...items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: item.label,
        item: item.to ? `${SITE_URL}${linkTo(item.to)}` : undefined,
      })),
    ],
  };

  return (
    <nav aria-label="Breadcrumb" className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-sm text-gray-500">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link to={linkTo('')} className="hover:text-gold transition">
            {t('breadcrumbHome')}
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1">
            <span aria-hidden="true">/</span>
            {item.to ? (
              <Link to={linkTo(item.to)} className="hover:text-gold transition">
                {item.label}
              </Link>
            ) : (
              <span className="text-navy font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
