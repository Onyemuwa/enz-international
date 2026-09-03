// ONE-TIME generation script — NOT part of the shipped site, NOT required to
// run it, and deleted after use. Regenerates all pages from the content data
// preserved in _content/ (a snapshot of the old React app's data files, kept
// solely so this script has something to read — see _content/README).
// Run with: node _generate-static.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { SUPPORTED_LANGUAGES } from './_content/translations.js';
import { services } from './_content/services.js';
import { insights } from './_content/insights.js';
import { markets } from './_content/markets.js';
import { industries, resources } from './_content/pages.js';
import { images } from './_content/images.js';

// Extracted build modules. These were all inline in this file, which had grown
// to ~2,600 lines and mixed constants, URL rewriting, translation lookup,
// components, page builders and the file writer in one scroll.
import { OUT, SITE_URL, ASSET_VERSION, FONT_HREF } from './_lib/site-config.js';
import { slugOf, isHome, urlPath } from './_lib/urls.js';
import { t } from './_lib/i18n.js';
import { icon } from './_lib/icons.js';
import { ALL_PAGES } from './_lib/nav.js';
import { aboutPage, careersPage, contactPage, homePage, insightPostPage, insightsListPage, marketsPage, servicesPage } from './_lib/pages-primary.js';
import { faqPage, industriesPage, legalPage, logisticsPage, pricingPage, processPage, qualityControlPage, resourcesPage } from './_lib/pages-detail.js';
import { servicePage, marketPage } from './_lib/pages-landing.js';
import { media } from './_lib/components.js';


// ============================================================================
// Write files
// ============================================================================

for (const lang of SUPPORTED_LANGUAGES) {
  const dir = path.join(OUT, lang);
  mkdirSync(dir, { recursive: true });

  // index.html stays at the language root; everything else becomes its own
  // directory, so /en/services/ serves /en/services/index.html.
  const emit = (page, html) => {
    if (isHome(page)) {
      writeFileSync(path.join(dir, 'index.html'), html);
      return;
    }
    const slug = slugOf(page);
    const sub = path.join(dir, slug);
    mkdirSync(sub, { recursive: true });
    writeFileSync(path.join(sub, 'index.html'), html);

    // A stub at the OLD address, pointing at the new one.
    //
    // Moving to clean URLs deleted en/services.html and created
    // en/services/index.html. Every bookmark, search result and remembered
    // URL pointing at the old address would otherwise 404 — a local dev
    // server that auto-redirects .html hides this completely, which is how it
    // shipped unnoticed.
    //
    // Host config (_redirects, vercel.json) issues a real 301 where it is
    // supported and takes precedence. This file is the floor: it works on
    // GitHub Pages and anywhere else with no configuration at all.
    //
    // noindex, because the stub must never compete with the page it points to;
    // the canonical names the real URL for anything that does look.
    writeFileSync(
      path.join(dir, `${slug}.html`),
      `<!DOCTYPE html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="robots" content="noindex" />
    <meta http-equiv="refresh" content="0; url=${slug}/" />
    <link rel="canonical" href="${SITE_URL}/${lang}/${slug}/" />
    <title>Moved</title>
  </head>
  <body>
    <script>location.replace('${slug}/');</script>
    <p>This page has moved to <a href="${slug}/">/${lang}/${slug}/</a>.</p>
  </body>
</html>
`
    );
  };

  const pages = [
    ['index.html', homePage],
    ['about.html', aboutPage],
    ['services.html', servicesPage],
    ['markets.html', marketsPage],
    ['insights.html', insightsListPage],
    ['contact.html', contactPage],
    ['careers.html', careersPage],
    ['process.html', processPage],
    ['industries.html', industriesPage],
    ['quality-control.html', qualityControlPage],
    ['logistics.html', logisticsPage],
    ['faq.html', faqPage],
    ['resources.html', resourcesPage],
    ['pricing.html', pricingPage],
  ];

  for (const [file, builder] of pages) {
    emit(file, builder(lang));
  }

  for (const post of insights) {
    emit(`insight-${post.slug}.html`, insightPostPage(lang, post));
  }

  // One landing page per service and per market. See _lib/pages-landing.js for
  // why these are their own URLs rather than anchors on the hub pages.
  for (const service of services) {
    emit(`${service.slug}.html`, servicePage(lang, service));
  }
  for (const market of markets) {
    emit(`${market.slug}.html`, marketPage(lang, market));
  }

  emit('privacy.html', legalPage(lang, 'privacy'));
  emit('terms.html', legalPage(lang, 'terms'));

  console.log(`Wrote ${lang}/ (${pages.length + insights.length + services.length + markets.length + 2} pages)`);
}

// ---------------------------------------------------------------------------
// Root files: language redirect, 404, manifest, host config, robots, sitemap
// ---------------------------------------------------------------------------

// Root visitors land on English. A <meta refresh> is the fallback for the rare
// client that runs no script; the script path is instant and, unlike the meta
// tag, uses replace() so Back doesn't bounce the visitor straight back here.
// Note the paths are one level shallower than in a language folder.
writeFileSync(
  path.join(OUT, 'index.html'),
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="0; url=en/index.html" />
    <link rel="canonical" href="${SITE_URL}/en/" />
    <link rel="icon" type="image/png" sizes="512x512" href="assets/images/favicon-512.png" />
    <title>ENZ INTERNATIONAL — Global Sourcing &amp; Industrial Excellence</title>
    <meta name="description" content="${t('en', 'heroSub')}" />
    <link rel="stylesheet" href="assets/css/site.css?v=${ASSET_VERSION}" />
  </head>
  <body class="bg-white text-ink">
    <script>
      // On a server, 'en/' is the clean URL and resolves to en/index.html.
      // Opened straight off disk it is a DIRECTORY, and file:// has no index
      // resolution — the browser shows a file listing instead of the site.
      // So from disk, go to the file itself.
      location.replace(location.protocol === 'file:' ? 'en/index.html' : 'en/');
    </script>
    <main class="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <p class="lead">Redirecting to <a href="en/index.html" class="link-arrow">ENZ INTERNATIONAL</a>…</p>
        <p class="text-sm text-slate mt-6 max-w-md mx-auto">
          Opening these files directly shows the landing page, but its links will not work:
          the site uses clean URLs, which need a server. Run <strong>preview.bat</strong>
          (or <code>node preview.mjs</code>) and open <strong>localhost:5500/en/</strong> instead.
        </p>
      </div>
    </main>
  </body>
</html>`
);

// Static hosts serve this for any unmatched path, so it is a real page with
// real navigation — a dead end here is a lost visitor, not just a 404.
writeFileSync(
  path.join(OUT, '404.html'),
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, follow" />
    <title>Page not found | ENZ INTERNATIONAL</title>
    <meta name="theme-color" content="#0171BA" />
    <link rel="icon" type="image/png" sizes="512x512" href="/assets/images/favicon-512.png" />

    <!-- ===================================================================
         THIS PAGE IS SELF-CONTAINED ON PURPOSE.
         ===================================================================
         A 404 is served for URLs that do not exist, from any depth, on any
         host. It is the one page that has to work when something has already
         gone wrong, so it cannot depend on an external stylesheet resolving:

         - Root-relative /assets/... is correct at a domain root and WRONG
           under a subpath (user.github.io/repo/), where it resolves outside
           the site and 404s in turn — leaving an unstyled error page.
         - Relative assets/... is correct at one depth only, and a 404 can be
           served for /a/b/c/nonsense.

         So the styles it needs are inlined. The external stylesheet is still
         linked afterwards for the fonts and to match the rest of the site
         where it does resolve, but nothing here depends on it arriving.
         =================================================================== -->
    <style>
      *,*::before,*::after{box-sizing:border-box}
      body{margin:0;background:#FAFBFC;color:#1E2E40;
        font-family:'Sora','Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
        -webkit-font-smoothing:antialiased}
      .wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:5rem 1rem;text-align:center}
      .inner{max-width:34rem}
      .code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
        font-size:.8125rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#0171BA;margin:0}
      h1{font-size:clamp(2.375rem,5.8vw,4.25rem);line-height:1.06;font-weight:600;
        letter-spacing:-.032em;margin:1rem 0 0}
      h1 .accent{color:#0171BA}
      .lead{color:#5A6A75;font-size:1rem;line-height:1.75;margin:1.25rem 0 0}
      .actions{display:flex;flex-wrap:wrap;justify-content:center;gap:.75rem;margin-top:2.25rem}
      .btn{display:inline-flex;align-items:center;justify-content:center;min-height:3.375rem;
        padding:1rem 2rem;border-radius:999px;font-size:1rem;font-weight:500;text-decoration:none;
        border:1px solid transparent;transition:background-color .18s,border-color .18s}
      .btn-primary{background:#0171BA;color:#fff}
      .btn-primary:hover{background:#015C96}
      .btn-secondary{border-color:#D3DBE1;color:#1E2E40}
      .btn-secondary:hover{border-color:#1E2E40}
      .more{display:flex;flex-wrap:wrap;justify-content:center;gap:.5rem 1.5rem;margin-top:2.5rem;font-size:.875rem}
      .more a{color:#5A6A75;text-decoration:none;text-transform:capitalize;transition:color .18s}
      .more a:hover{color:#1E2E40}
      a:focus-visible{outline:2px solid #0171BA;outline-offset:2px;border-radius:5px}
      @media (prefers-reduced-motion:reduce){*{transition-duration:.01ms !important}}
    </style>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${FONT_HREF}" />
  </head>
  <body>
    <main class="wrap">
      <div class="inner">
        <p class="code">Error 404</p>
        <h1>This page <span class="accent">isn't here</span></h1>
        <p class="lead">The page you're looking for doesn't exist, or it may have moved. The links below will get you back on track.</p>
        <div class="actions">
          <a href="/en/" data-to="" class="btn btn-primary">Back to homepage</a>
          <a href="/en/contact/" data-to="contact/" class="btn btn-secondary">Contact us</a>
        </div>
        <div class="more">
          ${['services', 'process', 'markets', 'insights', 'faq']
            .map((slug) => `<a href="/en/${slug}/" data-to="${slug}/">${slug}</a>`)
            .join('')}
        </div>
      </div>
    </main>

    <!-- Root-relative hrefs above are correct for a domain-root deployment and
         are what a crawler and a no-script visitor follow. This repoints them
         if the site turns out to be served from a subpath, which the markup
         alone cannot know. Everything still works without it. -->
    <script>
      (function () {
        var path = location.pathname;
        // /repo/en/nonsense -> "/repo"; /en/nonsense -> ""
        var m = path.match(/^(.*?)\\/(?:en|sw|fr|zh)\\//);
        var base = m ? m[1] : '';
        // A 404 under a subpath with no language segment, e.g. /repo/nope
        if (!m && path.lastIndexOf('/') > 0) base = path.slice(0, path.indexOf('/', 1));
        if (!base) return;
        var links = document.querySelectorAll('[data-to]');
        for (var i = 0; i < links.length; i++) {
          links[i].setAttribute('href', base + '/en/' + links[i].getAttribute('data-to'));
        }
      })();
    </script>
  </body>
</html>`
);

// Installable-app metadata. Also what Android uses for the home-screen icon
// and the address-bar colour, so it is worth having even with no PWA ambition.
writeFileSync(
  path.join(OUT, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'ENZ INTERNATIONAL',
      short_name: 'ENZ',
      description: t('en', 'heroSub'),
      start_url: '/en/',
      scope: '/',
      display: 'standalone',
      background_color: '#FFFFFF',
      theme_color: '#0B1A24',
      icons: [
        { src: '/assets/images/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/assets/images/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    null,
    2
  ) + '\n'
);

// Caching and security headers, in each host's own dialect. Both files are
// inert on a host that doesn't read them, so shipping both costs nothing and
// means the site is correctly configured wherever it lands.
//
// The split that matters: HTML must stay revalidated (so a content fix goes
// live immediately), while /assets/ is immutable for a year — safe because
// every asset URL carries ?v=ASSET_VERSION and changes when the file does.
const CACHE_LONG = 'public, max-age=31536000, immutable';
const CACHE_HTML = 'public, max-age=0, must-revalidate';
const SECURITY_HEADERS = [
  ['X-Content-Type-Options', 'nosniff'],
  ['X-Frame-Options', 'SAMEORIGIN'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()'],
  ['Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload'],
];

// Netlify and Cloudflare Pages. One rule covers every old .html address.
writeFileSync(
  path.join(OUT, '_redirects'),
  `# Clean-URL migration: /en/services.html -> /en/services/
# 301 so search engines move their index across rather than keeping both.
/en/index.html   /en/       301
/en/:page.html   /en/:page/ 301

# Retired languages. /sw/, /fr/ and /zh/ served English body copy while
# claiming to be translated, so they were withdrawn - see the header of
# _content/translations.js. These 301s carry indexed URLs to the English
# equivalent instead of 404ing them.
/sw/*   /en/:splat   301
/fr/*   /en/:splat   301
/zh/*   /en/:splat   301
`
);

writeFileSync(
  path.join(OUT, '_headers'),
  `# Netlify / Cloudflare Pages. Generated by _generate-static.mjs.
/*
${SECURITY_HEADERS.map(([k, v]) => `  ${k}: ${v}`).join('\n')}
  Cache-Control: ${CACHE_HTML}

/assets/*
  Cache-Control: ${CACHE_LONG}
`
);

writeFileSync(
  path.join(OUT, 'vercel.json'),
  JSON.stringify(
    {
      $schema: 'https://openapi.vercel.sh/vercel.json',
      // No framework, no build step: Vercel serves this folder as-is.
      framework: null,
      buildCommand: null,
      outputDirectory: '.',
      cleanUrls: false,
      // MUST be true, and this is not cosmetic.
      //
      // Pages are directories (en/services/index.html) and every internal link
      // is relative (../about/). Relative resolution depends entirely on the
      // trailing slash:
      //
      //   at /en/services/  ->  ../about/  =  /en/about/   correct
      //   at /en/services   ->  ../about/  =  /about/      404
      //
      // With trailingSlash:false Vercel 308s /en/services/ to /en/services,
      // stripping the slash, and from there every nav link on the page
      // resolves one directory too high. Land on the homepage, click anything,
      // get "Page not found" — which is exactly what it did in production
      // while every local check passed, because the dev server does not
      // rewrite trailing slashes.
      trailingSlash: true,
      // Clean-URL migration: the old /en/services.html addresses must 301 to
      // /en/services/ or every existing bookmark and search result 404s.
      redirects: [
        { source: '/:lang(en)/index.html', destination: '/:lang/', permanent: true },
        { source: '/:lang(en)/:page.html', destination: '/:lang/:page/', permanent: true },
        // Retired languages. /sw/, /fr/ and /zh/ served English body copy while
        // claiming to be translated, so they were withdrawn — see the header of
        // _content/translations.js. These 301s mean every URL Google already
        // indexed lands on the English equivalent instead of a 404, which is
        // how ranking signal is carried across rather than thrown away.
        //
        // Written out per language rather than as /:lang(sw|fr|zh)/:page*.
        // That combined form matched the bare /fr/ but NOT nested paths, so
        // /sw/services/ was still 404ing in production while the rule looked
        // correct in the config. Verified against the live site, not assumed.
        ...['sw', 'fr', 'zh'].flatMap((l) => [
          { source: `/${l}`, destination: '/en/', permanent: true },
          { source: `/${l}/:path*`, destination: '/en/:path*', permanent: true },
        ]),
      ],
      headers: [
        { source: '/(.*)', headers: SECURITY_HEADERS.map(([key, value]) => ({ key, value })) },
        { source: '/assets/(.*)', headers: [{ key: 'Cache-Control', value: CACHE_LONG }] },
        { source: '/(.*).html', headers: [{ key: 'Cache-Control', value: CACHE_HTML }] },
      ],
    },
    null,
    2
  ) + '\n'
);

// Everything shipped is indexable. Privacy and terms were once disallowed;
// search engines treat a reachable privacy policy as a trust signal, and
// hiding it gained nothing. The client portal that used to be excluded here
// has been removed from the site entirely.
writeFileSync(
  path.join(OUT, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
);

const sitemapPages = ALL_PAGES;
const TODAY = new Date().toISOString().slice(0, 10);

// Per-page <lastmod>, derived from git rather than from the clock.
//
// This used to be `new Date()` for every URL, which told search engines that
// all 76 pages changed on every single rebuild — including a rebuild that only
// touched one stylesheet. Google discounts lastmod it can see is unreliable,
// so a field that is wrong on 75 pages costs the one page where it is right.
//
// Instead: a page whose generated HTML differs from what is committed really
// did change now, so it gets today. Every other page reports the date of the
// last commit that actually touched its file. Both facts come from git, so
// they stay true without anyone maintaining them.
//
// If git is unavailable (a tarball, a fresh checkout with no history, a CI box
// without the binary) this degrades to today's date for everything, which is
// exactly the old behaviour — the sitemap is never wrong in a way that breaks
// the build.
const lastmodFor = (() => {
  const git = (args) =>
    execFileSync('git', args, { cwd: OUT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

  let dirty = new Set();
  let committed = new Map();
  try {
    // Files whose working-tree content differs from HEAD, i.e. changed by this run.
    for (const line of git(['status', '--porcelain']).split('\n')) {
      const f = line.slice(3).trim();
      if (f) dirty.add(f.replace(/^"|"$/g, ''));
    }
    // Newest commit date per path, in one pass over the log.
    let date = null;
    for (const line of git(['log', '--format=%cs', '--name-only']).split('\n')) {
      const t = line.trim();
      if (!t) continue;
      if (/^\d{4}-\d{2}-\d{2}$/.test(t)) date = t;
      else if (date && !committed.has(t)) committed.set(t, date);
    }
  } catch {
    console.warn('! git unavailable - sitemap lastmod falls back to today for every URL');
    return () => TODAY;
  }

  return (file) => (dirty.has(file) ? TODAY : committed.get(file) || TODAY);
})();

// The repo-relative file that serves a given page, matching what emit() writes.
const outFileFor = (lang, page) =>
  isHome(page) ? `${lang}/index.html` : `${lang}/${slugOf(page)}/index.html`;
// Home outranks a legal page; a hub outranks a leaf.
const priorityFor = (page) => {
  if (page === 'index.html') return '1.0';
  if (['privacy.html', 'terms.html'].includes(page)) return '0.3';
  if (page.startsWith('insight-')) return '0.6';
  return '0.8';
};
const urls = SUPPORTED_LANGUAGES.flatMap((lang) =>
  sitemapPages.map(
    (page) =>
      `  <url>\n    <loc>${SITE_URL}/${urlPath(lang, page)}</loc>\n    <lastmod>${lastmodFor(outFileFor(lang, page))}</lastmod>\n    <priority>${priorityFor(page)}</priority>\n${SUPPORTED_LANGUAGES.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}/${urlPath(l, page)}" />`
      ).join('\n')}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/${urlPath('en', page)}" />\n  </url>`
  )
);
writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
);

console.log(
  `\nDone. ${SUPPORTED_LANGUAGES.length} languages x ${ALL_PAGES.length} pages, plus index / 404 / manifest / robots / sitemap / host headers.`
);
