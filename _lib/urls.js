// Clean URLs.
//
// Pages are written as directories — en/services/index.html — so the address
// bar reads /en/services/ with no .html anywhere.
//
// Directory output rather than a host-level rewrite (Vercel's cleanUrls,
// Netlify's pretty URLs) because those are per-host settings: the same repo
// would show clean URLs on Vercel and .html on GitHub Pages. This works
// identically everywhere, with no configuration.
//
// The one cost is that opening a file straight off disk no longer resolves
// directory links, since file:// has no index resolution. Any local server
// handles it — see the README.
//
// ---------------------------------------------------------------------------
// A NOTE ON TRAILING SLASHES, WHICH IS NOT COSMETIC
// ---------------------------------------------------------------------------
// Every internal link produced here is relative, so it resolves against the
// URL the host actually served — not the one this file intended:
//
//   at /en/services/   ../about/  ->  /en/about/   correct
//   at /en/services    ../about/  ->  /about/      404
//
// A host that strips the trailing slash therefore breaks every link on the
// site at once. vercel.json must keep trailingSlash: true. This was shipped
// broken once; the local dev server did not strip slashes, so it looked fine
// right up until it was live.

/** 'about.html' -> 'about'. Home stays special: it is the language root. */
export const slugOf = (page) => page.replace(/\.html$/, '');

export const isHome = (page) => slugOf(page) === 'index';

/** How deep the page sits below the site root: /en/ is 1, /en/about/ is 2. */
export const depthOf = (page) => (isHome(page) ? 1 : 2);

/** Site-root-relative path, used for canonicals, hreflang and the sitemap. */
export const urlPath = (lang, page) => (isHome(page) ? `${lang}/` : `${lang}/${slugOf(page)}/`);

/**
 * Rewrites a whole document's links for the depth it will be written at.
 *
 * Doing it once here beats editing several hundred href="x.html" call sites,
 * and it cannot drift out of sync with them: page modules are free to write
 * the plain `about.html` form and this is what makes it correct everywhere.
 */
export function toCleanUrls(html, depth) {
  const up = '../'.repeat(depth); // page -> site root
  const sideways = '../'.repeat(depth - 1); // page -> its own language root

  return (
    html
      // ../assets/... and ../sitemap.xml are authored assuming depth 1.
      //
      // The preceding-character class matters: a quote or '(' marks the start
      // of an href/src, but a srcset holds several comma-separated URLs in
      // ONE attribute value — "x-400w.webp 400w, ../assets/x-800w.webp 800w"
      // — where every entry after the first is preceded by a space, not a
      // quote. Without \s here, only the first srcset candidate ever got
      // rewritten and every subsequent one 404'd at any depth below 1; it
      // shipped unnoticed because depth-1 pages (home) have up === '../'
      // regardless, so the bug was invisible until a depth-2 page carried a
      // multi-variant image — which about.html already did, in production.
      //
      // \s is deliberately not a bare wildcard: it still refuses to match
      // '../assets' when it is preceded by '.' or '/', i.e. embedded inside
      // an already-deeper '../../assets' chain, which would otherwise be
      // rewritten a second time and corrupted.
      .replace(/(["'(]|\s)\.\.\/(assets|sitemap\.xml|site\.webmanifest)/g, (m, q, tail) => `${q}${up}${tail}`)
      // language switcher: ../<lang>/<page>.html
      .replace(/(["'])\.\.\/([a-z]{2})\/([a-z0-9-]+)\.html(#[^"']*)?\1/g,
        (m, q, lang, page, hash) => `${q}${up}${lang}/${page === 'index' ? '' : page + '/'}${hash || ''}${q}`)
      // same-language page links: about.html, insight-foo.html#bar
      .replace(/(["'])([a-z0-9-]+)\.html(#[^"']*)?\1/g,
        (m, q, page, hash) => {
          // At depth 1 a link to index.html resolves to the empty string,
          // which is not a valid href — browsers treat it as "reload the
          // current document" but validators reject it. './' says the same
          // thing properly.
          const target = `${sideways}${page === 'index' ? '' : page + '/'}` || './';
          return `${q}${target}${hash || ''}${q}`;
        })
  );
}
