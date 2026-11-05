// Every internal link and #anchor in the generated site must resolve.
//
//   node _build/check-links.mjs
//
// Checks the generated pages only (server/, data/ and the source folders are
// skipped). Exits non-zero on any broken link, so it can gate a deploy.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] || '.');
const SKIP = new Set(['node_modules', '.git', '_build', '_lib', '_content', 'assets', '.vercel', 'server', 'data']);
const pages = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    if (SKIP.has(e)) continue;
    const p = path.join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e === 'index.html') pages.push(p);
  }
})(ROOT);

const bad = [];
for (const file of pages) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const html = readFileSync(file, 'utf8');
  if (/content="0; url=/.test(html)) continue; // redirect stubs
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const pageUrl = '/' + rel.replace(/index\.html$/, '');
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(href)) continue;
    if (href.startsWith('#')) {
      const id = decodeURIComponent(href.slice(1));
      if (id && !ids.has(id)) bad.push(`${rel} -> ${href} (no matching id on this page)`);
      continue;
    }
    const hash = href.indexOf('#');
    const pathPart = hash === -1 ? href : href.slice(0, hash);
    const resolved = new URL(pathPart || '.', 'http://x' + pageUrl).pathname;
    let target = path.join(ROOT, decodeURIComponent(resolved));
    if (resolved.endsWith('/')) target = path.join(target, 'index.html');
    if (!existsSync(target)) bad.push(`${rel} -> ${href} (target missing: ${resolved})`);
  }
}
console.log(`Checked ${pages.length} pages`);
if (bad.length) {
  console.log(`${bad.length} BROKEN:\n  ${bad.join('\n  ')}`);
  process.exit(1);
}
console.log('Zero broken links, zero missing anchors.');
