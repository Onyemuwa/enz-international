// The document wrapper: <head>, SEO metadata, and the shell every page fills.
//
// pageShell() is the single place a page becomes a document. It is also where
// toCleanUrls() runs, which is why page modules can write the plain
// "about.html" form and still produce correct relative links at any depth -
// the rewrite happens once, here, rather than at several hundred call sites.
//
// Canonical, hreflang and the JSON-LD graph are emitted together because they
// have to agree with each other. Splitting them is how a canonical ends up
// pointing at a URL the hreflang set does not contain.
import { SITE_URL, CONTACT_EMAIL, ASSET_VERSION, FONT_HREF } from './site-config.js';
import { depthOf, urlPath, toCleanUrls } from './urls.js';
import { t } from './i18n.js';
import { icon } from './icons.js';
import { media } from './components.js';
import { headerHTML, footerHTML, bookingModalHTML, whatsappButtonHTML, breadcrumbsHTML, breadcrumbJsonLd } from './chrome.js';
import { SUPPORTED_LANGUAGES, LOCALE_MAP } from '../_content/translations.js';
import { regions } from '../_content/regions.js';
import { images } from '../_content/images.js';
import { timelines, glossary } from '../_content/pages2.js';

export function clampDescription(text, max = 160) {
  if (!text || text.length <= max) return text;

  const head = text.slice(0, max + 1);

  const sentence = Math.max(head.lastIndexOf('. '), head.lastIndexOf('! '), head.lastIndexOf('? '));
  if (sentence > max * 0.55) return text.slice(0, sentence + 1);

  for (const sep of [' — ', ' – ', '; ', ', ']) {
    const at = head.lastIndexOf(sep);
    if (at > max * 0.6) return text.slice(0, at);
  }

  const word = head.lastIndexOf(' ');
  return text.slice(0, word > 0 ? word : max).replace(/[,;:—–-]$/, '') + '…';
}

export function seoHead({ lang, title, description, page, jsonLd, robots }) {
  description = clampDescription(description);
  const canonical = `${SITE_URL}/${urlPath(lang, page)}`;
  const alternates = SUPPORTED_LANGUAGES.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE_URL}/${urlPath(l, page)}" />`).join('\n    ');
  // Google renders roughly 60 characters of a <title> before truncating, and
  // the brand suffix alone is 21 of them — enough to push 18 pages past the
  // cut, where the tail that gets dropped is the brand we added it for.
  //
  // So the suffix adapts instead of being fixed: full brand when it fits, the
  // short form when it doesn't, and no suffix at all when the page's own title
  // already fills the budget. Characters go to the words that describe the
  // page, and nothing is ever truncated mid-phrase — a long title is left
  // whole rather than cut, because Google cutting it reads better than we do.
  const withBrand = `${title} | ENZ INTERNATIONAL`;
  const withShortBrand = `${title} | ENZ`;
  const fullTitle =
    withBrand.length <= 60 ? withBrand : withShortBrand.length <= 60 ? withShortBrand : title;
  return `<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0B1A24" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
    <meta name="color-scheme" content="light" />
    <title>${fullTitle}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="${robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}" />
    <meta name="author" content="ENZ INTERNATIONAL" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/png" sizes="512x512" href="../assets/images/favicon-512.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="../assets/images/apple-touch-icon.png" />
    <link rel="manifest" href="../site.webmanifest" />
    ${alternates}
    <link rel="alternate" hreflang="x-default" href="${SITE_URL}/${urlPath('en', page)}" />

    <!-- The stylesheet is a single plain file, committed to the repo. It is
         compiled from _build/tailwind.src.css only when markup changes; the
         site itself still needs no build step to deploy. (The Tailwind Play
         CDN that used to sit here is explicitly not for production: it ships a
         compiler to every visitor and repaints the page after first paint.) -->
    <link rel="stylesheet" href="../assets/css/site.css?v=${ASSET_VERSION}" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preload" as="style" href="${FONT_HREF}" />
    <link rel="stylesheet" href="${FONT_HREF}" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="${FONT_HREF}" /></noscript>

    <meta property="og:type" content="${page.startsWith('insight-') ? 'article' : 'website'}" />
    <meta property="og:site_name" content="ENZ INTERNATIONAL" />
    <meta property="og:title" content="${fullTitle}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE_URL}/assets/images/og-cover.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="ENZ INTERNATIONAL — global sourcing and industrial excellence" />
    <meta property="og:locale" content="${LOCALE_MAP[lang]}" />
    ${SUPPORTED_LANGUAGES.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${LOCALE_MAP[l]}" />`).join('\n    ')}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${fullTitle}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${SITE_URL}/assets/images/og-cover.png" />
    ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}`;
}

export function pageShell({ lang, page, title, description, jsonLd, crumbs, bodyHTML, robots }) {
  // Merge whatever structured data the page supplies with the sitewide
  // Organization/WebSite entities and the breadcrumb trail, so every page ships
  // one @graph rather than three competing scripts.
  const graph = [];
  if (jsonLd) graph.push(...(jsonLd['@graph'] || [jsonLd]));
  graph.push({
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'ENZ INTERNATIONAL',
    url: `${SITE_URL}/${lang}/`,
    logo: `${SITE_URL}/assets/images/enz-logo.png`,
    email: CONTACT_EMAIL,
    telephone: '+86-132-0384-0456',
    areaServed: regions.map((r) => r.name),
  });
  graph.push({
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/${lang}/`,
    name: 'ENZ INTERNATIONAL',
    inLanguage: lang,
    publisher: { '@id': `${SITE_URL}/#organization` },
  });
  if (crumbs) graph.push(breadcrumbJsonLd(lang, page, crumbs));
  const merged = { '@context': 'https://schema.org', '@graph': graph };

  const doc = `<!DOCTYPE html>
<html lang="${lang}">
  <head>
    ${seoHead({ lang, title, description, page, jsonLd: merged, robots })}
  </head>
  <body class="bg-white text-ink">
    <a href="#main-content" class="skip-link">${t(lang, 'skipToContent')}</a>
    ${headerHTML(lang, page)}
    ${crumbs ? breadcrumbsHTML(lang, crumbs) : ''}
    <main id="main-content">
      ${bodyHTML}
    </main>
    ${footerHTML(lang, page)}
    ${whatsappButtonHTML(lang)}
    ${bookingModalHTML(lang)}
    <script src="../assets/js/config.js?v=${ASSET_VERSION}"></script>
    <script src="../assets/js/api.js?v=${ASSET_VERSION}"></script>
    <script src="../assets/js/site.js?v=${ASSET_VERSION}" defer></script>
    <script type="module" src="../assets/js/motion-effects.js?v=${ASSET_VERSION}"></script>
  </body>
</html>`;

  // Every href/src above is authored as if the page sat at /<lang>/x.html.
  // This is the single place that translates them for the real depth.
  return toCleanUrls(doc, depthOf(page));
}

// ============================================================================
// Page content builders
// ============================================================================

// ============================================================================
// Homepage
// ============================================================================
// The page answers one question in order: what goes wrong → what we do about
// it → what that costs → how to start. It used to carry eight reference
// sections as well (Incoterms, landed cost, payment terms, timelines, common
// mistakes, why-China, glossary); those are now on the pages built for them,
// linked from here. They were good content in the wrong place — a buyer looks
// them up after deciding to talk to you, not while deciding whether to.
