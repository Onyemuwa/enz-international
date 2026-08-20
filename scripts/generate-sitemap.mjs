// Regenerates public/sitemap.xml from the route list + blog slugs + supported
// languages, with hreflang alternate links on every entry.
// Run with: npm run generate:sitemap
// Re-run whenever a route or insights/data/insights.js slug is added or removed.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { insights } from '../src/data/insights.js';

const SITE_URL = 'https://www.enzinternational.com'; // TODO: keep in sync with src/lib/siteConfig.js
const LANGUAGES = ['en', 'sw', 'fr', 'zh'];

const staticPaths = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'monthly' },
  { path: '/insights', priority: '0.8', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/careers', priority: '0.5', changefreq: 'monthly' },
];

const blogPaths = insights.map((p) => ({
  path: `/insights/${p.slug}`,
  priority: '0.6',
  changefreq: 'monthly',
}));

const allPaths = [...staticPaths, ...blogPaths];

const alternatesFor = (p) =>
  LANGUAGES.map((lng) => `    <xhtml:link rel="alternate" hreflang="${lng}" href="${SITE_URL}/${lng}${p}" />`).join('\n') +
  `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en${p}" />`;

const urlEntry = ({ path: p, priority, changefreq }, lang) => `  <url>
    <loc>${SITE_URL}/${lang}${p}</loc>
${alternatesFor(p)}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const body = allPaths.flatMap((entry) => LANGUAGES.map((lang) => urlEntry(entry, lang))).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

const outPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public/sitemap.xml');
writeFileSync(outPath, xml);
console.log(`Wrote ${outPath} (${allPaths.length * LANGUAGES.length} URLs)`);
