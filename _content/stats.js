// The homepage stat strip.
//
// ===========================================================================
// WHY THESE NUMBERS CHANGED
// ===========================================================================
// The strip used to read:
//
//     10+ Years Active    50+ Markets Served    200+ Projects Delivered
//     98% Client Satisfaction
//
// which is the default set that ships with a hundred agency templates, and at
// least one of them was provably untrue on this very site: it claimed 50+
// markets while every other page — the markets hub, the five market pages,
// regions.js — lists five. A buyer who notices that stops believing the rest
// of the page, and this is a sourcing firm, where being someone you can check
// IS the product.
//
// The rest could not be verified from anything in this repo. There is no
// founding date, no project count and no satisfaction survey anywhere in the
// content, so publishing them would have been inventing evidence about a real
// business — the same line _content/proof.js draws for testimonials and
// SETUP.md draws for certifications.
//
// So the strip is now DERIVED FROM THE SITE'S OWN CONTENT. Each number is
// counted from the data that renders the pages, which means it cannot drift
// out of date and cannot be wrong: add a sixth market and the strip says six.
//
// ===========================================================================
// PUTTING YOUR REAL NUMBERS BACK
// ===========================================================================
// These are good, honest stats, but they describe the service rather than the
// track record — and a track record is more persuasive when you have one.
// Once you can stand behind a figure, add it here:
//
//   { value: 12, suffix: '+', labelKey: 'statYears', confirmed: true }
//
// `confirmed: false` entries are NOT rendered. That is the whole safety
// mechanism: a number cannot reach the live site until someone has explicitly
// said it is true.
//
// Add translations for any new labelKey in _content/translations.js.
// ===========================================================================

import { markets } from './markets.js';
import { services } from './services.js';
import { qcStages } from './pages.js';

/**
 * Stats derived from content. Every one of these is checkable by clicking
 * around the site, which is the point.
 */
export const derivedStats = [
  { value: markets.length, suffix: '', labelKey: 'statMarkets', confirmed: true },
  { value: qcStages.length, suffix: '', labelKey: 'statStages', confirmed: true },
  { value: services.length, suffix: '', labelKey: 'statServices', confirmed: true },
  // Not derived from a count, but it is the response time the booking form and
  // the hero both already promise, so the site is already committed to it.
  { value: 24, suffix: 'h', labelKey: 'statResponse', confirmed: true },
];

/**
 * Track-record numbers. All ship `confirmed: false`, so none of them render.
 * Set a real value and flip the flag to publish it.
 */
export const trackRecordStats = [
  { value: 0, suffix: '+', labelKey: 'statYears', confirmed: false },
  { value: 0, suffix: '+', labelKey: 'statProjects', confirmed: false },
  { value: 0, suffix: '%', labelKey: 'statSatisfaction', confirmed: false },
];

/**
 * What the homepage renders: confirmed track-record numbers first (they are
 * the stronger claim when they exist), topped up with derived ones to four.
 */
export const homeStats = [...trackRecordStats, ...derivedStats]
  .filter((s) => s.confirmed)
  .slice(0, 4);

export default homeStats;
