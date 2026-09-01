// Responsive image variants, produced by `_build/responsive-images.mjs`.
//
// Photography is the heaviest thing on this site, and before this every
// visitor got the full-size file regardless of screen: a phone at 390 CSS px
// pulled the 1920 px, 415 KB hero in order to paint it 390 px wide. srcset
// lets the browser take the width it actually needs — measured at ~490 KB
// across the page on a 2x phone instead of ~1.9 MB. This site's audience is
// substantially on mobile networks in East Africa and the DRC, where that gap
// is the difference between a fast page and an abandoned one.
//
// If the manifest is missing the site still builds and every <img> falls back
// to its original single src, so this is an optimisation and never a hard
// dependency. Regenerate with: cd _build && npm run images

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { OUT_IMAGES } from './site-config.js';

const VARIANTS = (() => {
  const f = path.join(OUT_IMAGES, 'manifest.json');
  if (!existsSync(f)) {
    console.warn('! assets/images/manifest.json missing - images ship at full size only');
    return {};
  }
  return JSON.parse(readFileSync(f, 'utf8'));
})();

/**
 * Builds width/height (+ srcset/sizes where variants exist) for one image file.
 *
 * Intrinsic width/height are emitted even without variants: the .media wrapper
 * already reserves space via aspect-ratio, but the attributes keep the image
 * from collapsing if the stylesheet ever fails to arrive.
 */
export function srcsetAttrs(fileName, sizes) {
  const entry = VARIANTS[fileName];
  if (!entry) return '';
  const dims = ` width="${entry.width}" height="${entry.height}"`;
  if (!entry.variants || entry.variants.length < 2) return dims;
  const set = entry.variants.map((v) => `../assets/images/${v.file} ${v.w}w`).join(', ');
  return `${dims} srcset="${set}" sizes="${sizes}"`;
}
