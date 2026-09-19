// Serves the generated static site with the same behaviour vercel.json gave it:
// trailing-slash URLs, the .html and retired-language redirects, the security
// headers, and cache rules.
//
// THE SITE IS THE REPO ROOT, so the one thing this file must get right is what
// it refuses to serve. A naive express.static('.') would hand out server/,
// package.json, _content/, .git/ and the SQLite database itself. Instead
// nothing is reachable unless it is on an explicit allowlist: the /en and
// /assets trees plus a fixed set of root files.
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';

const ROOT_FILES = new Set(['index.html', '404.html', 'robots.txt', 'sitemap.xml', 'site.webmanifest']);

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
    // Retired languages: /sw/x, /fr/x, /zh/x -> /en/x
    let m = /^\/(?:sw|fr|zh)(\/.*)?$/.exec(req.path);
    if (m) return res.redirect(301, `/en${m[1] || '/'}${search(req)}`);

    // /en/index.html -> /en/
    if (req.path === '/en/index.html') return res.redirect(301, `/en/${search(req)}`);

    // /en/page.html -> /en/page/
    m = /^\/en\/([^/]+)\.html$/.exec(req.path);
    if (m) return res.redirect(301, `/en/${m[1]}/${search(req)}`);

    next();
  };
}

export function createSiteRouter({ root }) {
  const router = express.Router();

  const staticOptions = {
    dotfiles: 'ignore',
    index: 'index.html',
    redirect: true, // /en/services -> /en/services/
    cacheControl: false, // set per file type below
    setHeaders: (res, filePath) => res.set('Cache-Control', cacheControlFor(filePath)),
  };

  router.use('/en', express.static(path.join(root, 'en'), staticOptions));
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
