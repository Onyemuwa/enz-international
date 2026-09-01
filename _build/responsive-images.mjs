// Generates responsive variants of every content photograph.
//
// WHY
// The site ships ~2.2 MB of photography. Every visitor downloaded the full-size
// file regardless of screen: a phone at 390 CSS px was pulling the 1920 px,
// 415 KB hero to paint it 390 px wide. That is the largest cost on the page,
// it lands on the LCP element, and this site's audience is substantially on
// mobile networks in East Africa and the DRC — the exact case where it hurts
// most.
//
// WHAT
// For each source image, emit WebP variants at a ladder of widths and let the
// browser pick via srcset. Variants are never upscaled past the original, and
// a width is skipped when it lands within 15% of the one below it, so we don't
// ship two files that are effectively the same picture.
//
// The originals stay untouched and remain the src fallback, so a browser
// without srcset (or a variant that failed to generate) still gets a picture.
//
// Run: npm run images   — then re-run the generator so the markup picks up the
// new files. Output is deterministic, so re-running is safe and idempotent.

import sharp from 'sharp';
import { readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const IMG = path.join(HERE, '..', 'assets', 'images');

// Widths chosen against real layout slots, not round numbers: 400/800 cover
// phones at 1x and 2x, 1200 covers the card grids on a laptop, 1600/1920 cover
// the full-bleed hero on a desktop.
const LADDER = [400, 800, 1200, 1600, 1920];

// Icons, logo and the social card are excluded: the logo is a flat mark that
// is already tiny at display size, and og-cover is fetched by crawlers at one
// fixed size, so variants of either would be dead weight.
const SKIP = /^(enz-logo|favicon-|apple-touch-icon|og-cover)/;

const VARIANT = /-\d{3,4}w\.webp$/;

const manifest = {};
let before = 0;
let generated = 0;
let addedBytes = 0;

const sources = readdirSync(IMG)
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .filter((f) => !SKIP.test(f))
  .filter((f) => !VARIANT.test(f));

for (const file of sources) {
  const src = path.join(IMG, file);
  const meta = await sharp(src).metadata();
  before += statSync(src).size;

  const stem = file.replace(/\.[^.]+$/, '');
  const widths = [];
  for (const w of LADDER) {
    if (w > meta.width) continue;
    // Skip a width that is barely narrower than the previous one.
    if (widths.length && w < widths[widths.length - 1] * 1.15) continue;
    widths.push(w);
  }
  // Always include the native width so the largest variant is not a downscale
  // of the thing we already have.
  if (!widths.includes(meta.width) && meta.width <= LADDER[LADDER.length - 1]) {
    if (!widths.length || meta.width > widths[widths.length - 1] * 1.15) widths.push(meta.width);
  }

  const entries = [];
  for (const w of widths) {
    const out = path.join(IMG, `${stem}-${w}w.webp`);
    if (!existsSync(out)) {
      await sharp(src)
        .resize({ width: w, withoutEnlargement: true })
        // effort:6 costs build time only; quality 74 is where this photography
        // stops showing artefacts on flat surfaces like container paint.
        .webp({ quality: 74, effort: 6 })
        .toFile(out);
      generated++;
    }
    const size = statSync(out).size;
    addedBytes += size;
    entries.push({ w, file: `${stem}-${w}w.webp`, kb: Math.round(size / 1024) });
  }

  manifest[file] = { width: meta.width, height: meta.height, variants: entries };
  const ladder = entries.map((e) => `${e.w}w:${e.kb}KB`).join(' ');
  console.log(`${file.padEnd(30)} ${meta.width}x${meta.height}  ->  ${ladder}`);
}

// ---------------------------------------------------------------------------
// The logo, which is its own case.
// ---------------------------------------------------------------------------
// enz-logo.png is 1828x1300 and 72 KB, and it is painted at 51x36 in the
// header and footer of all 76 pages. That was the single heaviest thing on the
// page after the hero, spent on an image displayed at 3% of its width.
//
// It is NOT simply replaced, because the high-resolution file is still the
// right answer for the JSON-LD `logo` field — structured-data consumers want a
// large logo, and shrinking it there would be a downgrade nobody sees on the
// page. So the original stays for that, and this writes a display-size copy
// for the two <img> tags.
//
// PNG rather than WebP: a flat logo with alpha palettes extremely well, so
// PNG comes out roughly half the size of WebP here. 204px is 4x the 51px CSS
// width, which stays sharp on a 3x phone.
const LOGO_DISPLAY_WIDTH = 204;
const logoSrc = path.join(IMG, 'enz-logo.png');
if (existsSync(logoSrc)) {
  const out = path.join(IMG, `enz-logo-${LOGO_DISPLAY_WIDTH}.png`);
  const meta = await sharp(logoSrc).metadata();
  await sharp(logoSrc)
    .resize({ width: LOGO_DISPLAY_WIDTH, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(out);
  const wasKB = Math.round(statSync(logoSrc).size / 1024);
  const nowKB = Math.round(statSync(out).size / 1024);
  const h = Math.round((meta.height / meta.width) * LOGO_DISPLAY_WIDTH);
  manifest['enz-logo-display'] = { width: LOGO_DISPLAY_WIDTH, height: h, variants: [] };
  console.log(`\nenz-logo.png ${meta.width}x${meta.height} ${wasKB}KB -> enz-logo-${LOGO_DISPLAY_WIDTH}.png ${LOGO_DISPLAY_WIDTH}x${h} ${nowKB}KB (header/footer only; original kept for JSON-LD)`);
}

// The generator reads this to build srcset and to emit intrinsic width/height.
// Written as JSON rather than JS so it is obviously derived data that nobody
// should hand-edit.
writeFileSync(path.join(IMG, 'manifest.json'), JSON.stringify(manifest, null, 2));

// Report what a real device pulls, not the smallest rung on the ladder. A
// phone at 375 CSS px is almost always DPR 2, so it asks for ~750 device px
// and takes the 800w variant — quoting the 400w figure would flatter the
// result by more than half.
const pick = (deviceWidth) =>
  Object.values(manifest).reduce((sum, m) => {
    const hit = m.variants.find((v) => v.w >= deviceWidth) || m.variants[m.variants.length - 1];
    return sum + (hit?.kb || 0);
  }, 0);

console.log(`\n${sources.length} sources, ${generated} new variants written`);
console.log(`originals, as previously served : ${Math.round(before / 1024)} KB`);
console.log(`all variants on disk            : ${Math.round(addedBytes / 1024)} KB`);
console.log(`\nwhat a device actually pulls for a full page of these:`);
console.log(`  phone  375px @1x  (~375 device px) : ${pick(375)} KB`);
console.log(`  phone  375px @2x  (~750 device px) : ${pick(750)} KB   <- the common case`);
console.log(`  laptop 1366px @1x                  : ${pick(1366)} KB`);
console.log('\nmanifest.json written — re-run `node _generate-static.mjs`');
