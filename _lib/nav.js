// The two lists that define the site's shape.
//
// NAV_ITEMS is what appears in the header and footer. ALL_PAGES is every page
// that gets generated — a superset, because legal pages and insight posts are
// reachable without sitting in the main navigation.
//
// Both the chrome and the file writer read ALL_PAGES, which is why it lives
// here rather than in either of them: one list, so a page cannot be generated
// without being in the sitemap, or listed in the nav without being generated.
import { services } from '../_content/services.js';
import { insights } from '../_content/insights.js';
import { markets } from '../_content/markets.js';
import { industries, resources } from '../_content/pages.js';

export const LANG_LABEL = { en: 'Language', sw: 'Lugha', fr: 'Langue', zh: '语言' };

export const NAV_ITEMS = [
  { page: 'index.html', key: 'navHome' },
  { page: 'services.html', key: 'navServices' },
  { page: 'process.html', key: 'navProcess' },
  { page: 'pricing.html', key: 'navPricing' },
  { page: 'markets.html', key: 'navMarkets' },
  { page: 'about.html', key: 'navAbout' },
  { page: 'insights.html', key: 'navInsights' },
  { page: 'contact.html', key: 'navContact' },
];

export const ALL_PAGES = [
  'index.html',
  'about.html',
  'services.html',
  'markets.html',
  'insights.html',
  ...insights.map((p) => `insight-${p.slug}.html`),
  'process.html',
  'pricing.html',
  'industries.html',
  'quality-control.html',
  'logistics.html',
  'faq.html',
  'resources.html',
  'contact.html',
  'careers.html',
  'privacy.html',
  'terms.html',
];

// Inside the mobile nav the dropdown is the wrong shape: the panel is
// absolutely positioned but the nav scrolls (`overflow-y: auto`), so an open
// menu is clipped by its own container. There is room to just show the four
// options, so it does.
