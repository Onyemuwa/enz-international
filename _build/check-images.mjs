// Every <img> src and srcset candidate in the generated site must be a real file.
//
//   node _build/check-images.mjs
//
// Exits non-zero on any missing file, so it can gate a deploy.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] || '.');
const SKIP = new Set(['node_modules', '.git', '_build', '_lib', '_content', '.vercel', 'server', 'data']);
const pages = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    if (SKIP.has(e)) continue;
    const p = path.join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e === 'index.html') pages.push(p);
  }
})(ROOT);

let total = 0;
const bad = [];
for (const file of pages) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const html = readFileSync(file, 'utf8');
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const srcs = [];
    const src = /\ssrc="([^"]+)"/.exec(m[0]);
    if (src) srcs.push(src[1]);
    const set = /\ssrcset="([^"]+)"/.exec(m[0]);
    if (set) for (const part of set[1].split(',')) srcs.push(part.trim().split(/\s+/)[0]);
    for (const s of srcs) {
      total++;
      if (/^(https?:|data:)/.test(s)) continue;
      if (!existsSync(path.join(path.dirname(file), decodeURIComponent(s)))) bad.push(`${rel} -> ${s}`);
    }
  }
}
console.log(`Checked ${total} <img> references across ${pages.length} pages`);
if (bad.length) {
  console.log(`${bad.length} MISSING:\n  ${bad.join('\n  ')}`);
  process.exit(1);
}
console.log('All <img> src/srcset resolve to a real file.');
