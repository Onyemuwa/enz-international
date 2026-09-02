// Fails if the generated HTML breaks an SEO rule the site depends on.
//
// These are all things that were audited by hand once and would otherwise
// silently rot: a description drifting out of the SERP window, a page losing
// its canonical, a second <h1> appearing, an external link shipped without
// rel="noopener". Run it after the generator.
//
//   node _build/check-seo.mjs
//
// Exits non-zero on any violation, so it can gate a deploy.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['node_modules', '.git', '_build', '_lib', '_content', 'assets', '.vercel']);

const pages = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    if (SKIP.has(e)) continue;
    const p = path.join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e === 'index.html') pages.push(p);
  }
})(ROOT);

const fail = [];
const warn = [];
let checked = 0;

for (const file of pages) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const html = readFileSync(file, 'utf8');
  if (/content="0; url=/.test(html)) continue; // redirect stub
  checked++;

  const one = (re) => (html.match(re) || [])[1];

  // ---- title ------------------------------------------------------------
  const title = one(/<title>([\s\S]*?)<\/title>/);
  if (!title) fail.push(`${rel}: no <title>`);
  else if (title.length > 60) warn.push(`${rel}: title ${title.length} chars (Google shows ~60)`);

  // ---- description ------------------------------------------------------
  const desc = one(/<meta name="description" content="([^"]*)"/);
  if (!desc) fail.push(`${rel}: no meta description`);
  else if (desc.length < 150 || desc.length > 160)
    warn.push(`${rel}: description ${desc.length} chars (target 150-160)`);

  // ---- canonical, robots, hreflang --------------------------------------
  const canonical = one(/rel="canonical" href="([^"]*)"/);
  if (!canonical) fail.push(`${rel}: no canonical`);
  else {
    // Self-referencing: the canonical must point at this page's own URL.
    const expected = '/' + rel.replace(/index\.html$/, '');
    if (!canonical.endsWith(expected)) fail.push(`${rel}: canonical points elsewhere -> ${canonical}`);
  }
  if (!/<meta name="robots" content="[^"]*index/.test(html)) fail.push(`${rel}: no indexable robots meta`);
  if (!/rel="alternate" hreflang="x-default"/.test(html)) fail.push(`${rel}: no x-default hreflang`);

  // ---- social cards -----------------------------------------------------
  for (const tag of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:site_name']) {
    if (!html.includes(`property="${tag}"`)) fail.push(`${rel}: missing ${tag}`);
  }
  for (const tag of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    if (!html.includes(`name="${tag}"`)) fail.push(`${rel}: missing ${tag}`);
  }

  // ---- structured data --------------------------------------------------
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!ld.length) fail.push(`${rel}: no JSON-LD`);
  for (const m of ld) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      fail.push(`${rel}: invalid JSON-LD — ${e.message}`);
    }
  }

  // ---- headings ---------------------------------------------------------
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) fail.push(`${rel}: ${h1s} <h1> tags (must be exactly 1)`);

  // ---- images -----------------------------------------------------------
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt=/.test(m[0])) fail.push(`${rel}: <img> without alt — ${m[0].slice(0, 70)}`);
  }

  // ---- external links ---------------------------------------------------
  for (const m of html.matchAll(/<a\b[^>]*href="https?:\/\/[^"]*"[^>]*>/g)) {
    const tag = m[0];
    if (/enzinternational\.co/.test(tag)) continue; // same site
    if (!/rel="[^"]*noopener/.test(tag) || !/rel="[^"]*noreferrer/.test(tag))
      fail.push(`${rel}: external link without rel="noopener noreferrer" — ${tag.slice(0, 70)}`);
  }
}

// ---- sitemap + robots ---------------------------------------------------
const sitemap = readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const robots = readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
const locs = (sitemap.match(/<loc>/g) || []).length;
if (locs !== checked) fail.push(`sitemap has ${locs} URLs but ${checked} pages were generated`);
if (!/Sitemap:\s*https?:\/\/\S+sitemap\.xml/.test(robots)) fail.push('robots.txt does not reference the sitemap');

console.log(`Checked ${checked} pages, ${locs} sitemap URLs\n`);
const show = (label, list) => {
  if (!list.length) return;
  console.log(`${label} (${list.length}):`);
  for (const l of list.slice(0, 20)) console.log('   ' + l);
  if (list.length > 20) console.log(`   ...and ${list.length - 20} more`);
  console.log();
};
show('FAIL', fail);
show('warn', warn);

if (!fail.length && !warn.length) console.log('All SEO checks passed.');
process.exit(fail.length ? 1 : 0);
