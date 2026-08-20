import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../i18n/LanguageContext';
import { SUPPORTED_LANGUAGES, LOCALE_MAP } from '../i18n/translations';
import { SITE_URL, SITE_NAME } from '../lib/siteConfig';

/**
 * Per-page SEO: title, description, canonical + hreflang alternates, Open Graph,
 * Twitter Card, and optional JSON-LD structured data.
 *
 * `path` is the language-agnostic path (no /:lang prefix), e.g. "/services".
 * Pass "" for the homepage.
 */
const SEO = ({ title, description, path = '', image, jsonLd, noindex = false }) => {
  const { language } = useLanguage();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonical = `${SITE_URL}/${language}${path}`;
  const ogImage = image || `${SITE_URL}/images/og-cover.jpg`;

  return (
    <Helmet>
      <html lang={language} />
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* hreflang alternates for every supported language + x-default */}
      {SUPPORTED_LANGUAGES.map((lng) => (
        <link key={lng} rel="alternate" hrefLang={lng} href={`${SITE_URL}/${lng}${path}`} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/en${path}`} />

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={LOCALE_MAP[language]} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
};

export default SEO;
