// Serves the generated static site with the same behaviour vercel.json gave it:
// trailing-slash URLs, the .html and retired-language redirects, the security
// headers, and cache rules.
//
// THE SITE IS THE REPO ROOT, so the one thing this file must get right is what
// it refuses to serve. A naive express.static('.') would hand out server/,
// package.json, _content/, .git/ and the SQLite database itself. Instead
// nothing is reachable unless it is on an explicit allowlist: the /assets tree,
// a fixed set of root files, and the page directories named in site-pages.json
// (written by the generator, one entry per page).
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';

const ROOT_FILES = new Set(['index.html', '404.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest']);

// A page slug is only ever served if it is a plain lowercase word AND is not one
// of the names this server uses for something else.
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED = new Set(['assets', 'api', 'admin', 'server', 'data', 'node_modules', 'en', 'sw', 'fr', 'zh']);

/** The page slugs from site-pages.json; an unreadable file means no pages, never "everything". */
export function loadPageSlugs(root) {
  try {
    const list = JSON.parse(fs.readFileSync(path.join(root, 'site-pages.json'), 'utf8'));
    return list.filter((s) => typeof s === 'string' && SLUG.test(s) && !RESERVED.has(s));
  } catch {
    return [];
  }
}

const HTML = 'public, max-age=0, must-revalidate';
// CSS and JS are cache-busted by ?v=ASSET_VERSION in the generated HTML, so a
// changed file always arrives under a new URL and can be cached for a year.
const IMMUTABLE = 'public, max-age=31536000, immutable';
// Images are NOT versioned: replacing a photo keeps its filename. A year-long
// immutable cache here would keep showing visitors the old stock photo long
// after the real one was uploaded, so images get a day, then revalidate.
const IMAGE = 'public, max-age=86400, stale-while-revalidate=604800';
const SHORT = 'public, max-age=3600';

function cacheControlFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return HTML;
  if (['.css', '.js', '.woff2', '.woff'].includes(ext)) return IMMUTABLE;
  if (['.webp', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.gif', '.avif'].includes(ext)) return IMAGE;
  return SHORT;
}

export function securityHeaders(config) {
  return (req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
    if (config.isProd) res.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    next();
  };
}

/** HTTPS and www -> apex redirects. Skipped for the health check. */
export function canonicalRedirects(config) {
  return (req, res, next) => {
    if (req.path === '/api/health') return next();
    const host = req.get('host') || '';
    if (config.forceHttps && req.get('x-forwarded-proto') === 'http') {
      return res.redirect(308, `https://${config.redirectWww ? host.replace(/^www\./, '') : host}${req.originalUrl}`);
    }
    if (config.redirectWww && host === `www.${config.canonicalHost}`) {
      return res.redirect(301, `${config.siteUrl}${req.originalUrl}`);
    }
    next();
  };
}

/** The redirects that used to live in vercel.json. */
export function legacyRedirects() {
  const search = (req) => {
    const i = req.originalUrl.indexOf('?');
    return i === -1 ? '' : req.originalUrl.slice(i);
  };
  return (req, res, next) => {
    // English used to live under /en/, and three retired languages redirected
    // to it. All of those addresses now map onto the same path at the site root:
    //   /en/services/  /sw/services/  /fr/  ->  /services/  /
    //   /en/index.html ->  /        /en/page.html -> /page/
    const m = /^\/(?:en|sw|fr|zh)(\/.*)?$/.exec(req.path);
    if (m) {
      let rest = m[1] || '/';
      rest = rest.replace(/index\.html$/, '').replace(/^\/([^/]+)\.html$/, '/$1/');
      return res.redirect(301, `${rest}${search(req)}`);
    }

    // /index.html -> /
    if (req.path === '/index.html') return res.redirect(301, `/${search(req)}`);

    next();
  };
}

export function createSiteRouter({ root }) {
  const router = express.Router();
  const pageSlugs = loadPageSlugs(root);

  const staticOptions = {
    dotfiles: 'ignore',
    index: 'index.html',
    redirect: true, // /services -> /services/
    cacheControl: false, // set per file type below
    setHeaders: (res, filePath) => res.set('Cache-Control', cacheControlFor(filePath)),
  };

  for (const slug of pageSlugs) router.use(`/${slug}`, express.static(path.join(root, slug), staticOptions));
  router.use('/assets', express.static(path.join(root, 'assets'), staticOptions));

  const sendRoot = (file) => (req, res, next) => {
    res.set('Cache-Control', cacheControlFor(file));
    res.sendFile(path.join(root, file), { dotfiles: 'deny' }, (err) => err && next());
  };

  router.get('/', sendRoot('index.html'));
  for (const file of ROOT_FILES) if (file !== 'index.html' && file !== '404.html') router.get(`/${file}`, sendRoot(file));

  // Anything else — including /server, /package.json, /_content and /data —
  // falls through to here and is a 404, never a file.
  router.use((req, res) => {
    const page = path.join(root, '404.html');
    res.status(404);
    if (req.method === 'HEAD' || !fs.existsSync(page)) return res.type('text/plain').send('Not found');
    res.set('Cache-Control', HTML);
    res.sendFile(page);
  });

  return router;
}
