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
export const CONTACT_EMAIL = 'enzinternational.co@gmail.com';

// Cache-buster appended to every JS URL. Browsers cache these aggressively by
// filename, so a fixed script can keep losing to a stale copy already sitting
// in someone's cache — which is exactly how a since-fixed bug keeps "coming
// back" for a viewer. BUMP THIS whenever a file in assets/js/ changes.
export const ASSET_VERSION = '73';

// Sora is self-hosted: assets/fonts/sora-latin.woff2 (SIL Open Font License),
// declared in _build/tailwind.src.css and preloaded in the page head.
