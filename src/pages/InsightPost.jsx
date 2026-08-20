import { useParams, Link, Navigate } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import Icon from '../components/Icon';
import { useLanguage } from '../i18n/LanguageContext';
import { insights } from '../data/insights';
import { SITE_URL } from '../lib/siteConfig';

const InsightPost = () => {
  const { language, t } = useLanguage();
  const { slug } = useParams();
  const post = insights.find((p) => p.slug === slug);

  if (!post) return <Navigate to={`/${language}/insights`} replace />;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedDate,
    author: { '@type': 'Organization', name: 'ENZ INTERNATIONAL' },
    publisher: { '@type': 'Organization', name: 'ENZ INTERNATIONAL' },
    mainEntityOfPage: `${SITE_URL}/${language}/insights/${post.slug}`,
  };

  return (
    <>
      <SEO title={post.title} description={post.excerpt} path={`/insights/${post.slug}`} jsonLd={jsonLd} />
      <Breadcrumbs items={[{ label: t('navInsights'), to: '/insights' }, { label: post.title }]} />

      <article className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <span className="text-xs font-medium text-gold bg-gold/10 px-2.5 py-1 rounded-full">{post.category}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-navy mt-4">{post.title}</h1>
          <div className="text-sm text-gray-400 mt-4 flex items-center gap-2">
            <span>{t('insightsPublished')}</span>
            <time dateTime={post.publishedDate}>{post.publishedDate}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readTime} {t('insightsReadTime')}</span>
          </div>

          <div className="prose prose-navy max-w-none mt-10 space-y-6">
            {post.body.map((paragraph, idx) => (
              <p key={idx} className="text-gray-700 leading-relaxed text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          <Link
            to={`/${language}/insights`}
            className="inline-flex items-center gap-2 mt-12 text-navy font-medium hover:text-gold transition"
          >
            <Icon name="arrowLeft" className="w-4 h-4" /> {t('insightsBackToList')}
          </Link>
        </div>
      </article>
    </>
  );
};

export default InsightPost;
