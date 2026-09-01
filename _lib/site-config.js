// Site-wide constants.
//
// These are the values that appear in more than one place and must never
// disagree with themselves — the canonical origin, the contact details printed
// in the header, the footer, the booking modal and the JSON-LD, and the cache
// key on every script tag.
//
// They live here rather than in the generator so that a page module can import
// the one it needs without pulling in the whole build.

import path from 'node:path';

/** Repo root. The generated site IS the repo, so output is written in place. */
export const OUT = path.resolve('.');
export const OUT_IMAGES = path.join(OUT, 'assets', 'images');

export const SITE_URL = 'https://enzinternational.co';
export const WHATSAPP_NUMBER = '8613203840456';
export const CONTACT_PHONE = '+86 132 0384 0456';
export const CONTACT_EMAIL = 'info@enzinternational.co';

// Cache-buster appended to every JS URL. Browsers cache these aggressively by
// filename, so a fixed script can keep losing to a stale copy already sitting
// in someone's cache — which is exactly how a since-fixed bug keeps "coming
// back" for a viewer. BUMP THIS whenever a file in assets/js/ changes.
export const ASSET_VERSION = '39';

// Sora, matching onemartent.com — one of the two reference sites.
//
// Inter is the default of nearly every framework starter, which is precisely
// why a site built on it reads as generic however it is laid out. Sora is
// geometric with wide apertures and a distinctive lowercase g, so it carries
// a headline instead of just setting one.
//
// One family, four weights, one request. `display=swap` paints text
// immediately in the fallback stack and re-renders in Sora, so a slow font
// never produces an invisible headline.
export const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap';
