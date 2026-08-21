// ONE-TIME generation script — NOT part of the shipped site, NOT required to
// run it, and deleted after use. Regenerates all pages from the content data
// preserved in _content/ (a snapshot of the old React app's data files, kept
// solely so this script has something to read — see _content/README).
// Run with: node _generate-static.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import dict, { SUPPORTED_LANGUAGES, LOCALE_MAP } from './_content/translations.js';
import { services } from './_content/services.js';
import { insights } from './_content/insights.js';
import { markets } from './_content/markets.js';
import { regions, hubs } from './_content/regions.js';
import { faqs } from './_content/faqs.js';

const OUT = path.resolve('.'); // repo root — this IS the site
const SITE_URL = 'https://www.enzinternational.com'; // TODO: replace with your real domain (see SETUP.md)
const WHATSAPP_NUMBER = '8613203840456';
const CONTACT_PHONE = '+86 132 0384 0456';
const CONTACT_EMAIL = 'info@enzinternational.com';

function t(lang, key, vars) {
  let str = dict[lang]?.[key] ?? dict.en[key] ?? key;
  if (vars) Object.entries(vars).forEach(([k, v]) => (str = str.replace(`{${k}}`, v)));
  return str;
}

const ICON_PATHS = {
  globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  chevronDown: '<polyline points="6 9 12 15 18 9"/>',
  chevronRight: '<polyline points="9 6 15 12 9 18"/>',
  whatsapp:
    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  calendar:
    '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  mapPin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  trendingUp: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
};

function icon(name, cls = 'w-5 h-5') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="${cls}" aria-hidden="true">${ICON_PATHS[name] || ''}</svg>`;
}

// ---------- Reusable premium style fragments ----------
const CARD = 'bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300';
const CARD_MUTED = 'bg-gray-bg rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300';
const CARD_DARK = 'bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:bg-white/[0.07] hover:border-gold/30 hover:-translate-y-0.5 transition-all duration-300';
const BTN_PRIMARY =
  'bg-gold hover:bg-gold-light text-navy font-semibold rounded-full shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30 hover:scale-[1.02] transition-all duration-300';
const BTN_GHOST_LIGHT =
  'bg-white/10 backdrop-blur-sm border border-white/25 hover:bg-white/20 hover:border-white/40 text-white transition-all duration-300';

const NAV_ITEMS = [
  { page: 'index.html', key: 'navHome' },
  { page: 'services.html', key: 'navServices' },
  { page: 'markets.html', key: 'navMarkets' },
  { page: 'about.html', key: 'navAbout' },
  { page: 'insights.html', key: 'navInsights' },
  { page: 'contact.html', key: 'navContact' },
];

const ALL_PAGES = [
  'index.html',
  'about.html',
  'services.html',
  'markets.html',
  'insights.html',
  ...insights.map((p) => `insight-${p.slug}.html`),
  'contact.html',
  'portal.html',
  'careers.html',
  'privacy.html',
  'terms.html',
];

function langSwitcher(lang, currentPage) {
  const template = `../__LANG__/${currentPage}`;
  const options = SUPPORTED_LANGUAGES.map(
    (l) => `<option value="${l}" ${l === lang ? 'selected' : ''}>${l.toUpperCase()}</option>`
  ).join('');
  return `<select aria-label="Language" data-lang-select data-target-template="${template}" class="bg-navy border border-white/20 rounded-md px-2 py-1 text-xs cursor-pointer">${options}</select>`;
}

function headerHTML(lang, currentPage) {
  const links = NAV_ITEMS.map(
    (item) =>
      `<a href="${item.page}" class="hover:text-gold transition-colors${item.page === currentPage ? ' text-gold' : ''}">${t(lang, item.key)}</a>`
  ).join('\n');
  const mobileLinks = NAV_ITEMS.map((item) => `<a href="${item.page}" class="block hover:text-gold">${t(lang, item.key)}</a>`).join('\n');

  return `
  <header class="bg-navy/95 backdrop-blur-md text-white sticky top-0 z-50 border-b border-white/5">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
      <a href="index.html" class="flex items-center space-x-3">
        <img src="../assets/images/enz-logo.png" alt="ENZ INTERNATIONAL" width="140" height="40" class="h-10 w-auto object-contain" />
      </a>
      <nav class="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide" aria-label="Primary">
        ${links}
        <button data-open-portal class="flex items-center space-x-1.5 border border-gold/30 px-4 py-1.5 rounded-full text-gold hover:bg-gold/10 hover:border-gold/50 transition-all">
          ${icon('user', 'w-4 h-4')}<span>${t(lang, 'navPortal')}</span>
        </button>
        ${langSwitcher(lang, currentPage)}
      </nav>
      <button id="mobile-menu-toggle" aria-expanded="false" aria-controls="mobile-nav" class="lg:hidden text-white" aria-label="Toggle menu">
        ${icon('menu', 'w-7 h-7')}
      </button>
    </div>
    <nav id="mobile-nav" hidden aria-label="Primary" class="lg:hidden bg-navy/98 border-t border-white/10 px-4 py-6 space-y-4 text-sm">
      ${mobileLinks}
      <button data-open-portal class="flex items-center space-x-2 text-gold border border-gold/30 px-4 py-1.5 rounded-full w-fit">
        ${icon('user', 'w-4 h-4')}<span>${t(lang, 'navPortal')}</span>
      </button>
      <div class="pt-2">${langSwitcher(lang, currentPage)}</div>
    </nav>
  </header>`;
}

function footerHTML(lang) {
  return `
  <footer class="bg-navy text-white/70 py-16 border-t border-white/5">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div>
        <img src="../assets/images/enz-logo.png" alt="ENZ INTERNATIONAL" width="140" height="40" class="h-10 w-auto object-contain mb-4" />
        <p class="text-sm max-w-xs leading-relaxed">${t(lang, 'footerAbout')}</p>
      </div>
      <div>
        <h2 class="text-white font-semibold text-sm mb-4 tracking-wide">${t(lang, 'footerServices')}</h2>
        <ul class="text-sm space-y-3">
          <li><a href="services.html" class="hover:text-gold transition">${t(lang, 'tabSourcing')}</a></li>
          <li><a href="services.html" class="hover:text-gold transition">${t(lang, 'tabFactory')}</a></li>
          <li><a href="services.html" class="hover:text-gold transition">${t(lang, 'service3')}</a></li>
        </ul>
      </div>
      <div>
        <h2 class="text-white font-semibold text-sm mb-4 tracking-wide">${t(lang, 'footerCompany')}</h2>
        <ul class="text-sm space-y-3">
          <li><a href="about.html" class="hover:text-gold transition">${t(lang, 'navAbout')}</a></li>
          <li><a href="markets.html" class="hover:text-gold transition">${t(lang, 'navMarkets')}</a></li>
          <li><a href="insights.html" class="hover:text-gold transition">${t(lang, 'navInsights')}</a></li>
          <li><a href="careers.html" class="hover:text-gold transition">${t(lang, 'navCareers')}</a></li>
          <li><a href="contact.html" class="hover:text-gold transition">${t(lang, 'navContact')}</a></li>
        </ul>
      </div>
      <div>
        <h2 class="text-white font-semibold text-sm mb-4 tracking-wide">${t(lang, 'footerContact')}</h2>
        <p class="text-sm flex items-center gap-2">${icon('phone', 'w-4 h-4 text-gold')}<a href="tel:${CONTACT_PHONE.replace(/\s/g, '')}" class="hover:text-gold transition">${CONTACT_PHONE}</a></p>
        <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" class="mt-4 flex items-center gap-2 bg-green-600/15 hover:bg-green-600/25 text-green-400 px-4 py-2.5 rounded-full text-sm transition w-fit">
          ${icon('whatsapp', 'w-4 h-4')} ${t(lang, 'footerWhatsapp')}
        </a>
        <form id="newsletter-form" class="mt-7">
          <label for="newsletter-email" class="text-white font-semibold text-sm block mb-1.5">${t(lang, 'footerNewsletterTitle')}</label>
          <p class="text-xs text-white/50 mb-3">${t(lang, 'footerNewsletterDesc')}</p>
          <div class="flex gap-2">
            <input id="newsletter-email" name="email" type="email" required placeholder="${t(lang, 'footerNewsletterPlaceholder')}" class="flex-1 min-w-0 bg-white/10 border border-white/15 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-gold/50" />
            <button type="submit" class="bg-gold text-navy text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-gold-light transition">${t(lang, 'ctaSubscribe')}</button>
          </div>
        </form>
        <p id="newsletter-success" role="status" hidden class="text-sm text-gold mt-3">${t(lang, 'footerNewsletterSuccess')}</p>
      </div>
    </div>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
      <p>© <span data-current-year></span> ENZ INTERNATIONAL. All rights reserved.</p>
      <p class="flex items-center gap-1.5">${icon('mapPin', 'w-3 h-3')} ${hubs.join(' · ')}</p>
      <div class="flex gap-5">
        <a href="privacy.html" class="hover:text-gold transition">${t(lang, 'footerPrivacy')}</a>
        <a href="terms.html" class="hover:text-gold transition">${t(lang, 'footerTerms')}</a>
      </div>
    </div>
  </footer>`;
}

function bookingModalHTML(lang) {
  const opts = [
    ['sourcing', 'bookingServiceOptSourcing'],
    ['factory', 'bookingServiceOptFactory'],
    ['market', 'bookingServiceOptMarket'],
    ['other', 'bookingServiceOptOther'],
  ]
    .map(([v, k]) => `<option value="${v}">${t(lang, k)}</option>`)
    .join('');
  return `
  <div id="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title" style="display:none" data-modal-backdrop class="fixed inset-0 z-[60] items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
    <div class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl p-7 relative">
      <button data-close-modal aria-label="Close dialog" class="absolute top-5 right-5 text-gray-400 hover:text-gray-700">${icon('close', 'w-6 h-6')}</button>
      <h2 id="booking-modal-title" class="text-2xl font-bold text-navy mb-6 pr-6 tracking-tight">${t(lang, 'bookingTitle')}</h2>
      <form id="booking-form" class="space-y-5">
        <p class="text-sm text-gray-500">${t(lang, 'bookingIntro')}</p>
        <div>
          <label for="booking-name" class="block text-sm font-medium text-navy/80">${t(lang, 'bookingName')}</label>
          <input id="booking-name" name="name" type="text" required class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50" />
        </div>
        <div>
          <label for="booking-email" class="block text-sm font-medium text-navy/80">${t(lang, 'bookingEmail')}</label>
          <input id="booking-email" name="email" type="email" required class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="booking-phone" class="block text-sm font-medium text-navy/80">${t(lang, 'bookingPhone')}</label>
            <input id="booking-phone" name="phone" type="tel" class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50" />
          </div>
          <div>
            <label for="booking-company" class="block text-sm font-medium text-navy/80">${t(lang, 'bookingCompany')}</label>
            <input id="booking-company" name="company" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50" />
          </div>
        </div>
        <div>
          <label for="booking-date" class="block text-sm font-medium text-navy/80">${t(lang, 'bookingDate')}</label>
          <input id="booking-date" name="date" type="date" required class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50" />
        </div>
        <div>
          <label for="booking-service" class="block text-sm font-medium text-navy/80">${t(lang, 'bookingService')}</label>
          <select id="booking-service" name="service" class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"><option value="">—</option>${opts}</select>
        </div>
        <div>
          <label for="booking-message" class="block text-sm font-medium text-navy/80">${t(lang, 'bookingMessage')}</label>
          <textarea id="booking-message" name="message" rows="3" class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"></textarea>
        </div>
        <p id="booking-error" role="alert" hidden class="text-sm text-red-600">${t(lang, 'bookingErrorTitle')} — ${t(lang, 'bookingErrorDesc')}</p>
        <button type="submit" data-submitting-label="${t(lang, 'bookingSubmitting')}" class="w-full ${BTN_PRIMARY} py-4">${t(lang, 'bookingSubmit')}</button>
        <p class="text-xs text-gray-400 text-center">${t(lang, 'bookingDisclaimer')}</p>
      </form>
      <div id="booking-success" role="status" hidden class="text-center py-6">
        <div class="text-4xl mb-4">✅</div>
        <p class="text-lg font-semibold text-navy">${t(lang, 'bookingSuccessTitle')}</p>
        <p class="text-sm text-gray-600 mt-2">${t(lang, 'bookingSuccessDesc', { name: '<span data-success-name></span>', email: '<span data-success-email></span>' })}</p>
      </div>
    </div>
  </div>`;
}

function portalModalHTML(lang) {
  return `
  <div id="portal-modal" role="dialog" aria-modal="true" aria-labelledby="portal-modal-title" style="display:none" data-modal-backdrop class="fixed inset-0 z-[60] items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
    <div class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl p-7 relative">
      <button data-close-modal aria-label="Close dialog" class="absolute top-5 right-5 text-gray-400 hover:text-gray-700">${icon('close', 'w-6 h-6')}</button>
      <h2 id="portal-modal-title" class="text-2xl font-bold text-navy mb-6 pr-6 tracking-tight">${t(lang, 'portalTitle')}</h2>
      <form id="portal-login-form" class="space-y-5">
        <p class="text-sm text-gray-500">${t(lang, 'portalIntro')}</p>
        <div>
          <label for="portal-email" class="block text-sm font-medium text-navy/80">${t(lang, 'portalEmailLabel')}</label>
          <input id="portal-email" name="email" type="email" required class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50" />
        </div>
        <div>
          <label for="portal-password" class="block text-sm font-medium text-navy/80">${t(lang, 'portalPassLabel')}</label>
          <input id="portal-password" name="password" type="password" required class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50" />
        </div>
        <button type="submit" class="w-full bg-navy hover:bg-slate-blue text-white font-semibold py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-[1.02]">${t(lang, 'portalLogin')}</button>
        <p class="text-xs text-gray-400 text-center">${t(lang, 'portalAccessHelp')} <a href="mailto:${CONTACT_EMAIL}" class="text-gold hover:underline">${CONTACT_EMAIL}</a></p>
      </form>
      <div id="portal-success" role="status" hidden class="text-center py-6">
        <div class="text-4xl mb-4">✅</div>
        <p class="text-lg font-semibold text-navy">${t(lang, 'portalMock')}</p>
        <p class="text-sm text-gray-500 mt-2">${t(lang, 'portalLoggedInDesc')}</p>
      </div>
    </div>
  </div>`;
}

function whatsappButtonHTML() {
  return `<a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" class="fixed bottom-6 right-6 z-40 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-105 flex items-center justify-center">${icon('whatsapp', 'w-7 h-7')}</a>`;
}

function breadcrumbsHTML(lang, items) {
  const parts = [`<a href="index.html" class="hover:text-gold transition">${t(lang, 'breadcrumbHome')}</a>`];
  items.forEach((item) => {
    parts.push('<span aria-hidden="true">/</span>');
    if (item.href) parts.push(`<a href="${item.href}" class="hover:text-gold transition">${item.label}</a>`);
    else parts.push(`<span class="text-navy font-medium" aria-current="page">${item.label}</span>`);
  });
  return `<nav aria-label="Breadcrumb" class="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-sm text-gray-500"><ol class="flex flex-wrap items-center gap-1.5">${parts
    .map((p) => `<li class="flex items-center gap-1.5">${p}</li>`)
    .join('')}</ol></nav>`;
}

function seoHead({ lang, title, description, page, jsonLd }) {
  const canonical = `${SITE_URL}/${lang}/${page}`;
  const alternates = SUPPORTED_LANGUAGES.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}/${page}" />`).join('\n    ');
  return `<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0A192F" />
    <title>${title} | ENZ INTERNATIONAL</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/png" href="../assets/images/enz-logo.png" />
    ${alternates}
    <link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/${page}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="ENZ INTERNATIONAL" />
    <meta property="og:title" content="${title} | ENZ INTERNATIONAL" />
    <meta property="og:description" content="${description}" />
    <meta property="og:locale" content="${LOCALE_MAP[lang]}" />
    <meta name="twitter:card" content="summary_large_image" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: { extend: {
          colors: { navy: '#0A192F', 'slate-blue': '#1E3A5F', gold: '#D4AF37', 'gold-light': '#E8C84A', 'gray-bg': '#F8F9FB' },
          fontFamily: { inter: ['Inter', 'sans-serif'] },
        } },
      };
    </script>
    <style>
      body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
      a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid #D4AF37; outline-offset: 2px; }
      .skip-link { position: absolute; left: -9999px; top: 0; background: #D4AF37; color: #0A192F; padding: .5rem 1rem; border-radius: .375rem; font-weight: 600; z-index: 100; }
      .skip-link:focus { left: 1rem; top: 1rem; }
      /* Initial hidden state for Motion-driven entrance animations (see motion-effects.js) */
      [data-reveal], [data-hero-stagger] > * { opacity: 0; }
      @media print { header, footer, .no-print { display: none !important; } }
    </style>
    <noscript><style>[data-reveal], [data-hero-stagger] > * { opacity: 1 !important; transform: none !important; }</style></noscript>
    ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}`;
}

function pageShell({ lang, page, title, description, jsonLd, crumbs, bodyHTML }) {
  return `<!DOCTYPE html>
<html lang="${lang}">
  <head>
    ${seoHead({ lang, title, description, page, jsonLd })}
  </head>
  <body class="bg-gray-bg text-navy antialiased">
    <a href="#main-content" class="skip-link">${t(lang, 'skipToContent')}</a>
    ${headerHTML(lang, page)}
    ${crumbs ? breadcrumbsHTML(lang, crumbs) : ''}
    <main id="main-content">
      ${bodyHTML}
    </main>
    ${footerHTML(lang)}
    ${whatsappButtonHTML()}
    ${bookingModalHTML(lang)}
    ${portalModalHTML(lang)}
    <script src="../assets/js/config.js"></script>
    <script src="../assets/js/i18n.js"></script>
    <script src="../assets/js/api.js"></script>
    <script type="module" src="../assets/js/motion-effects.js"></script>
    <script src="../assets/js/site.js" defer></script>
  </body>
</html>`;
}

// ============================================================================
// Page content builders
// ============================================================================

function homePage(lang) {
  const stats = [
    ['statYears', 10, '+'],
    ['statMarkets', 50, '+'],
    ['statProjects', 200, '+'],
    ['statSatisfaction', 98, '%'],
  ];
  const values = [
    ['value1', 'value1Desc', 'shield'],
    ['value2', 'value2Desc', 'award'],
    ['value3', 'value3Desc', 'globe'],
  ];
  const whyItems = [
    ['why1Title', 'why1Desc', 'shield'],
    ['why2Title', 'why2Desc', 'briefcase'],
    ['why3Title', 'why3Desc', 'mapPin'],
    ['why4Title', 'why4Desc', 'mail'],
    ['why5Title', 'why5Desc', 'award'],
    ['why6Title', 'why6Desc', 'check'],
  ];
  const regionServiceTags = { TZ: ['service1', 'service2'], KE: ['service1', 'service3'], CD: ['service1', 'service2'], US: ['service1', 'service3'], UK: ['service1', 'service3'] };

  const body = `
  <section class="relative bg-gradient-to-br from-navy via-slate-blue to-navy text-white py-24 md:py-36 overflow-hidden">
    <div aria-hidden="true" class="absolute inset-0 opacity-[0.08] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkNGFmMzciIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoNHY0aC00em0tMTAgMGgtNHYtNGg0djR6bTEwLTEwaC00di00aDR2NHptLTEwIDBINGwtNCA0aDE2eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
    <div aria-hidden="true" class="absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-gold/20 rounded-full blur-[100px]"></div>
    <div aria-hidden="true" class="absolute -bottom-40 -left-32 w-[28rem] h-[28rem] bg-slate-blue/50 rounded-full blur-[100px]"></div>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <div data-hero-stagger class="max-w-4xl mx-auto">
        <div class="flex flex-wrap justify-center gap-2 mb-8">
          <span class="bg-gold/15 text-gold text-xs font-semibold px-4 py-1.5 rounded-full border border-gold/30 tracking-wide">${t(lang, 'heroBadge1')}</span>
          <span class="bg-white/[0.07] text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/15 tracking-wide">${t(lang, 'heroBadge2')}</span>
          <span class="bg-white/[0.07] text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/15 tracking-wide">${t(lang, 'heroBadge3')}</span>
        </div>
        <h1 class="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">${t(lang, 'heroTitle')}</h1>
        <p class="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mt-8 leading-relaxed font-light">${t(lang, 'heroSub')}</p>
        <div class="flex flex-wrap justify-center gap-4 mt-12">
          <button data-open-booking class="${BTN_PRIMARY} px-9 py-4 flex items-center gap-2">${icon('calendar', 'w-5 h-5')} ${t(lang, 'ctaBooking')}</button>
          <button data-open-portal class="${BTN_GHOST_LIGHT} px-9 py-4 rounded-full flex items-center gap-2">${icon('user', 'w-5 h-5')} ${t(lang, 'ctaPortal')}</button>
        </div>
        <ul class="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 mt-14 text-white/50 text-sm list-none">
          <li class="flex items-center gap-1.5">${icon('check', 'w-4 h-4 text-gold')} ${t(lang, 'trustYears')}</li>
          <li class="flex items-center gap-1.5">${icon('check', 'w-4 h-4 text-gold')} ${t(lang, 'trustMarkets')}</li>
          <li class="flex items-center gap-1.5">${icon('check', 'w-4 h-4 text-gold')} ${t(lang, 'trustCert')}</li>
          <li class="flex items-center gap-1.5">${icon('check', 'w-4 h-4 text-gold')} ${t(lang, 'trustProjects')}</li>
        </ul>
      </div>
    </div>
  </section>

  <section class="py-24 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div data-reveal class="max-w-3xl mx-auto text-center mb-20">
        <h2 class="text-3xl md:text-5xl font-bold text-navy tracking-tight">${t(lang, 'aboutTitle')}</h2>
        <p class="text-gray-600 text-lg mt-6 leading-relaxed">${t(lang, 'aboutDesc')}</p>
        <a href="about.html" class="inline-block mt-5 text-gold font-medium hover:underline underline-offset-4">${t(lang, 'ctaLearnMore')} →</a>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-4xl mx-auto">
        ${stats
          .map(
            ([key, value, suffix]) =>
              `<div data-reveal class="${CARD_MUTED} text-center"><div class="text-4xl font-bold text-gold tracking-tight"><span data-counter="${value}" data-counter-suffix="${suffix}">0${suffix}</span></div><div class="text-sm text-gray-600 mt-2">${t(lang, key)}</div></div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="py-24 bg-navy text-white relative overflow-hidden">
    <div aria-hidden="true" class="absolute inset-0 opacity-[0.06] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNkNGFmMzciIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoNHY0aC00em0tMTAgMGgtNHYtNGg0djR6bTEwLTEwaC00di00aDR2NHptLTEwIDBINGwtNCA0aDE2eiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat"></div>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div data-reveal class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl md:text-5xl font-bold tracking-tight">${t(lang, 'whyTitle')}</h2>
        <p class="text-white/60 text-lg mt-5 font-light">${t(lang, 'whySubtitle')}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-16 max-w-6xl mx-auto">
        ${whyItems
          .map(
            ([tk, dk, ic]) =>
              `<div data-reveal class="${CARD_DARK}">${icon(ic, 'w-8 h-8 text-gold mb-4')}<h3 class="font-bold text-lg tracking-tight">${t(lang, tk)}</h3><p class="text-white/55 text-sm mt-2.5 leading-relaxed">${t(lang, dk)}</p></div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="py-24 bg-gray-bg">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div data-reveal class="text-center"><h2 class="text-3xl md:text-5xl font-bold text-navy tracking-tight">${t(lang, 'servicesTitle')}</h2><p class="text-gray-600 max-w-2xl mx-auto mt-5 text-lg">${t(lang, 'servicesSubtitle')}</p></div>
      <div data-tab-group>
        <div class="flex justify-center gap-3 mt-10" role="tablist" aria-label="${t(lang, 'servicesTitle')}">
          <button data-tab-btn="sourcing" role="tab" aria-selected="true" class="px-7 py-3 rounded-full font-medium text-sm transition-all bg-navy text-white shadow-lg">${t(lang, 'tabSourcing')}</button>
          <button data-tab-btn="factory" role="tab" aria-selected="false" class="px-7 py-3 rounded-full font-medium text-sm transition-all bg-white text-navy/70 hover:bg-gray-100 shadow-sm">${t(lang, 'tabFactory')}</button>
        </div>
        <div data-tab-panel="sourcing" class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="${CARD}">${icon('globe', 'w-10 h-10 text-gold mb-4')}<h3 class="text-xl font-bold text-navy tracking-tight">${t(lang, 'service1')}</h3><p class="text-gray-600 text-sm mt-2.5 leading-relaxed">${t(lang, 'service1Desc')}</p></div>
          <div class="${CARD}">${icon('user', 'w-10 h-10 text-gold mb-4')}<h3 class="text-xl font-bold text-navy tracking-tight">${t(lang, 'service3')}</h3><p class="text-gray-600 text-sm mt-2.5 leading-relaxed">${t(lang, 'service3Desc')}</p></div>
          <div class="${CARD}">${icon('trendingUp', 'w-10 h-10 text-gold mb-4')}<h3 class="font-bold text-navy tracking-tight">Commodity Trading</h3><p class="text-gray-600 text-sm mt-2.5 leading-relaxed">Copper, cobalt, agricultural, and more.</p></div>
        </div>
        <div data-tab-panel="factory" style="display:none" class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="${CARD}">${icon('calendar', 'w-10 h-10 text-gold mb-4')}<h3 class="text-xl font-bold text-navy tracking-tight">${t(lang, 'service2')}</h3><p class="text-gray-600 text-sm mt-2.5 leading-relaxed">${t(lang, 'service2Desc')}</p></div>
          <div class="${CARD}">${icon('briefcase', 'w-10 h-10 text-gold mb-4')}<h3 class="font-bold text-navy tracking-tight">Assembly Line Planning</h3><p class="text-gray-600 text-sm mt-2.5 leading-relaxed">Customized factory floor design.</p></div>
          <div class="${CARD}">${icon('globe', 'w-10 h-10 text-gold mb-4')}<h3 class="font-bold text-navy tracking-tight">Machinery Sourcing</h3><p class="text-gray-600 text-sm mt-2.5 leading-relaxed">Reliable equipment from vetted vendors.</p></div>
        </div>
      </div>
      <div class="text-center mt-12"><a href="services.html" class="inline-flex items-center gap-2 text-navy font-medium border border-navy/15 rounded-full px-7 py-3.5 hover:bg-white hover:shadow-md transition-all">${t(lang, 'ctaViewAll')} ${icon('chevronRight', 'w-4 h-4')}</a></div>
    </div>
  </section>

  <section class="py-24 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 data-reveal class="text-3xl md:text-5xl font-bold text-navy text-center tracking-tight">${t(lang, 'valueTitle')}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 max-w-5xl mx-auto">
        ${values
          .map(
            ([tk, dk, ic]) =>
              `<div data-reveal class="${CARD_MUTED} text-center"><div class="flex justify-center mb-5">${icon(ic, 'w-12 h-12 text-gold')}</div><h3 class="text-xl font-bold text-navy tracking-tight">${t(lang, tk)}</h3><p class="text-gray-600 text-sm mt-2.5 leading-relaxed">${t(lang, dk)}</p></div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="py-24 bg-gray-bg">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div data-reveal class="text-center"><h2 class="text-3xl md:text-5xl font-bold text-navy tracking-tight">${t(lang, 'footprintTitle')}</h2><p class="text-gray-600 max-w-2xl mx-auto mt-5 text-lg">${t(lang, 'footprintHubsLabel')}: ${hubs.join(' · ')}</p></div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-14 max-w-6xl mx-auto">
        ${regions
          .map(
            (r) => `
          <div data-reveal class="${CARD}">
            <div class="flex items-center gap-3"><span class="w-10 h-10 rounded-full bg-navy text-gold text-sm font-bold flex items-center justify-center shrink-0">${r.code}</span><span class="font-semibold text-navy">${r.name}</span></div>
            <ul class="mt-4 space-y-1.5">${(regionServiceTags[r.code] || []).map((sk) => `<li class="text-xs text-gray-500 flex items-center gap-1.5">${icon('check', 'w-3 h-3 text-gold shrink-0')} ${t(lang, sk)}</li>`).join('')}</ul>
            <a href="markets.html" class="text-gold text-xs font-medium mt-4 inline-flex items-center gap-1 hover:underline underline-offset-4">${t(lang, 'ctaLearnMore')} ${icon('chevronRight', 'w-3 h-3')}</a>
          </div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="py-24 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 data-reveal class="text-3xl md:text-5xl font-bold text-navy text-center tracking-tight">${t(lang, 'insightsTitle')}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 max-w-6xl mx-auto">
        ${insights
          .map(
            (p) =>
              `<div data-reveal class="${CARD_MUTED}">${icon(p.icon, 'w-8 h-8 text-gold mb-4')}<h3 class="text-lg font-bold text-navy tracking-tight">${p.title}</h3><p class="text-gray-600 text-sm mt-2.5 leading-relaxed">${p.excerpt}</p><a href="insight-${p.slug}.html" class="text-gold text-sm font-medium mt-4 inline-block hover:underline underline-offset-4">${t(lang, 'ctaReadMore')} →</a></div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="py-20 bg-navy text-white relative overflow-hidden">
    <div aria-hidden="true" class="absolute -top-20 left-1/2 -translate-x-1/2 w-[36rem] h-72 bg-gold/10 rounded-full blur-[100px]"></div>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
      <h2 class="text-3xl md:text-4xl font-bold tracking-tight">${t(lang, 'ctaBannerTitle')}</h2>
      <p class="text-white/60 text-lg mt-4 max-w-2xl mx-auto font-light">${t(lang, 'ctaBannerDesc')}</p>
      <button data-open-booking class="mt-8 ${BTN_PRIMARY} px-9 py-4 inline-flex items-center gap-2">${icon('calendar', 'w-5 h-5')} ${t(lang, 'ctaBooking')}</button>
    </div>
  </section>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ENZ INTERNATIONAL',
    telephone: '+86-1320-384-0456',
    address: { '@type': 'PostalAddress', addressLocality: 'Guangzhou', addressCountry: 'CN' },
    areaServed: regions.map((r) => r.name),
  };

  return pageShell({ lang, page: 'index.html', title: t(lang, 'heroTitle'), description: t(lang, 'heroSub'), jsonLd, bodyHTML: body });
}

function aboutPage(lang) {
  const methodology = [
    ['01', 'Understand', 'We start with your product, volume, and target market — not a generic pitch.', 'mail'],
    ['02', 'Vet', 'Every supplier or site is checked against our own diligence criteria before we recommend it.', 'shield'],
    ['03', 'Execute', 'A single point of contact manages sourcing, logistics, or construction through to delivery.', 'briefcase'],
    ['04', 'Support', 'Post-delivery support and ongoing sourcing relationships, not one-off transactions.', 'award'],
  ];
  const capabilities = [
    ['Supplier Sourcing & Vetting', 'Shortlisting, factory audits, and price benchmarking across Guangdong, Zhejiang, and Fujian manufacturing clusters.', 'globe'],
    ['Quality Control', 'Staged inspection — incoming materials, in-process, and pre-shipment — so defects are caught before they ship.', 'check'],
    ['Factory Setup', 'Site selection, machinery sourcing, assembly-line planning, and commissioning support from feasibility to first run.', 'calendar'],
    ['Freight & Customs', 'Consolidated freight forwarding and customs documentation, door-to-port.', 'mapPin'],
    ['Commodity Trading', 'Procurement of copper, cobalt, and select agricultural commodities with clear contract terms.', 'trendingUp'],
    ['Market Entry Support', 'Competitor landscape briefings and introductions to vetted local partners.', 'user'],
  ];
  const engagementSteps = [
    ['Book a Consultation', 'A 30-minute call to understand your product, volume, timeline, and budget — no cost, no obligation.'],
    ['Scoped Proposal', 'You get a written scope: what we’ll do, what it costs, and how long it takes, before anything is signed.'],
    ['Execution & Updates', 'Your single point of contact runs the project and sends regular, plain-language status updates.'],
    ['Delivery & Beyond', 'Goods delivered or factory commissioned — with an open line for the next order or the next phase.'],
  ];

  const body = `
  <section class="relative bg-gradient-to-br from-navy via-slate-blue to-navy text-white py-24 overflow-hidden">
    <div aria-hidden="true" class="absolute -top-24 -right-24 w-96 h-96 bg-gold/20 rounded-full blur-[100px]"></div>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative">
      <h1 class="text-4xl md:text-6xl font-bold tracking-tight">${t(lang, 'aboutTitle')}</h1>
      <p class="text-white/75 text-lg mt-7 leading-relaxed font-light">${t(lang, 'aboutDesc')}</p>
      <p class="text-white/65 text-lg mt-4 leading-relaxed font-light">We work as an extension of your team on the ground in China and East Africa — vetting suppliers, managing quality control, and coordinating the logistics that turn a purchase order or a factory blueprint into a delivered, working result. One point of contact owns your project from first call to final delivery, so nothing gets lost between departments or vendors.</p>
    </div>
  </section>

  <section class="py-24 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div data-reveal class="text-center max-w-2xl mx-auto"><h2 class="text-3xl md:text-4xl font-bold text-navy tracking-tight">What We Handle End-to-End</h2><p class="text-gray-600 mt-4 text-lg">Six capabilities that cover the full path from a first product brief to a shipped, working result.</p></div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 max-w-6xl mx-auto">
        ${capabilities.map(([ttl, desc, ic]) => `<div data-reveal class="${CARD_MUTED}">${icon(ic, 'w-8 h-8 text-gold mb-4')}<h3 class="font-bold text-navy tracking-tight">${ttl}</h3><p class="text-gray-600 text-sm mt-2.5 leading-relaxed">${desc}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="py-24 bg-gray-bg">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 data-reveal class="text-3xl md:text-4xl font-bold text-navy text-center tracking-tight">Our Methodology</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-14 max-w-5xl mx-auto">
        ${methodology.map(([n, ttl, desc, ic]) => `<div data-reveal class="${CARD} relative">${icon(ic, 'w-6 h-6 text-gold mb-3')}<span class="absolute top-7 right-7 text-gray-100 font-bold text-4xl">${n}</span><h3 class="text-lg font-bold text-navy mt-2 tracking-tight">${ttl}</h3><p class="text-gray-600 text-sm mt-2.5 leading-relaxed">${desc}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="py-24 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div data-reveal class="text-center max-w-2xl mx-auto"><h2 class="text-3xl md:text-4xl font-bold text-navy tracking-tight">What Working With Us Looks Like</h2><p class="text-gray-600 mt-4 text-lg">From the first call to ongoing delivery — what to expect at each stage.</p></div>
      <ol class="mt-16 max-w-3xl mx-auto space-y-10 relative">
        ${engagementSteps
          .map(
            ([ttl, desc], idx) =>
              `<li data-reveal class="relative pl-16"><span class="absolute left-0 top-0 w-11 h-11 rounded-full bg-navy text-gold font-bold flex items-center justify-center shadow-md">${idx + 1}</span><h3 class="font-bold text-navy tracking-tight text-lg">${ttl}</h3><p class="text-gray-600 text-sm mt-1.5 leading-relaxed">${desc}</p></li>`
          )
          .join('')}
      </ol>
      <div class="text-center mt-14"><a href="markets.html" class="inline-flex items-center gap-2 text-navy font-medium border border-navy/15 rounded-full px-7 py-3.5 hover:bg-gray-bg hover:shadow-md transition-all">See where we operate ${icon('chevronRight', 'w-4 h-4')}</a></div>
    </div>
  </section>

  <section class="py-24 bg-gray-bg">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold text-navy text-center tracking-tight">Meet the Team</h2>
      <div class="max-w-lg mx-auto mt-10 text-center bg-white border border-dashed border-gray-200 rounded-2xl p-10 shadow-sm">
        ${icon('user', 'w-8 h-8 text-gold mx-auto mb-4')}
        <p class="text-gray-600 text-sm leading-relaxed">Team profiles are coming soon. Reach out via the contact page if you&rsquo;d like to speak with a member of our team directly.</p>
      </div>
    </div>
  </section>`;

  return pageShell({ lang, page: 'about.html', title: t(lang, 'navAbout'), description: t(lang, 'aboutDesc'), crumbs: [{ label: t(lang, 'navAbout') }], bodyHTML: body });
}

function servicesPage(lang) {
  const engagementModels = [
    ['Single Sourcing Project', 'One product, one order. Ideal for testing a new supplier relationship or a one-off procurement need.', 'First-time buyers, sample orders, seasonal purchases', 'briefcase'],
    ['Ongoing Retainer', 'Continuous sourcing and quality control across multiple SKUs and repeat orders, with a dedicated point of contact.', 'Growing brands with recurring purchase cycles', 'calendar'],
    ['Full Factory Partnership', 'End-to-end factory establishment plus ongoing operational and sourcing support after commissioning.', 'Businesses localizing production in a new market', 'award'],
  ];

  const jumpNav = services.map((s) => `<a href="#${s.slug}" class="text-sm font-medium text-navy border border-navy/15 rounded-full px-5 py-2.5 hover:bg-gray-bg hover:border-gold/40 hover:shadow-sm transition-all">${t(lang, s.titleKey)}</a>`).join('');

  const sections = services
    .map(
      (service, idx) => `
    <section id="${service.slug}" class="py-24 scroll-mt-24 ${idx % 2 === 0 ? 'bg-gray-bg' : 'bg-white'}">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-start max-w-5xl">
        <div data-reveal>
          ${icon(service.icon, 'w-10 h-10 text-gold mb-5')}
          <h2 class="text-3xl md:text-4xl font-bold text-navy tracking-tight">${t(lang, service.titleKey)}</h2>
          <p class="text-gold font-medium mt-2">${service.tagline}</p>
          <p class="text-gray-600 mt-5 leading-relaxed">${t(lang, service.descKey)}</p>
          <ul class="mt-7 space-y-3.5">${service.features.map((f) => `<li class="flex items-start gap-2.5 text-sm text-gray-700"><span class="mt-0.5">${icon('check', 'w-4 h-4 text-gold shrink-0')}</span><span>${f}</span></li>`).join('')}</ul>
          <button data-open-booking class="mt-9 ${BTN_PRIMARY} px-7 py-3.5 inline-flex items-center gap-2">${icon('calendar', 'w-4 h-4')} ${t(lang, 'ctaBooking')}</button>
        </div>
        <ol data-reveal class="bg-white rounded-2xl border border-gray-100 shadow-md p-7 space-y-6">
          ${service.process.map((p, i) => `<li class="flex gap-4"><span class="shrink-0 w-9 h-9 rounded-full bg-navy text-gold text-sm font-bold flex items-center justify-center">${i + 1}</span><div><p class="font-semibold text-navy">${p.step}</p><p class="text-sm text-gray-600 mt-0.5">${p.desc}</p></div></li>`).join('')}
        </ol>
      </div>
    </section>`
    )
    .join('');

  const body = `
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
      <h1 class="text-4xl md:text-6xl font-bold text-navy tracking-tight">${t(lang, 'servicesTitle')}</h1>
      <p class="text-gray-600 text-lg mt-6">${t(lang, 'servicesSubtitle')}</p>
      <nav aria-label="Jump to service" class="flex flex-wrap justify-center gap-3 mt-10">${jumpNav}</nav>
    </div>
  </section>
  ${sections}
  <section class="py-24 bg-navy text-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div data-reveal class="text-center max-w-2xl mx-auto"><h2 class="text-3xl md:text-4xl font-bold tracking-tight">How We Can Work Together</h2><p class="text-white/60 mt-4 text-lg font-light">Three engagement models, scoped to how much of the process you want us to own.</p></div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 max-w-5xl mx-auto">
        ${engagementModels
          .map(
            ([ttl, desc, fits, ic]) =>
              `<div data-reveal class="${CARD_DARK}">${icon(ic, 'w-8 h-8 text-gold mb-4')}<h3 class="font-bold tracking-tight">${ttl}</h3><p class="text-white/55 text-sm mt-2.5 leading-relaxed">${desc}</p><p class="text-gold text-xs mt-5 font-semibold uppercase tracking-wider">Best for</p><p class="text-white/70 text-sm mt-1.5">${fits}</p></div>`
          )
          .join('')}
      </div>
      <div class="text-center mt-14">
        <button data-open-booking class="${BTN_PRIMARY} px-9 py-4 inline-flex items-center gap-2">${icon('calendar', 'w-5 h-5')} ${t(lang, 'ctaBooking')}</button>
        <p class="text-white/50 text-sm mt-5">Have questions first? <a href="contact.html" class="text-gold hover:underline underline-offset-4">See our FAQ</a></p>
      </div>
    </div>
  </section>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((s, idx) => ({ '@type': 'Service', position: idx + 1, name: t(lang, s.titleKey), description: t(lang, s.descKey), provider: { '@type': 'Organization', name: 'ENZ INTERNATIONAL' } })),
  };

  return pageShell({ lang, page: 'services.html', title: t(lang, 'servicesTitle'), description: t(lang, 'servicesSubtitle'), jsonLd, crumbs: [{ label: t(lang, 'navServices') }], bodyHTML: body });
}

function marketsPage(lang) {
  const cards = markets
    .map((m) => `<a href="#market-${m.slug}" class="${CARD_MUTED} flex items-start gap-4"><span class="text-xl font-bold text-gold shrink-0">${m.region}</span><div><h2 class="font-bold text-navy tracking-tight">${m.name}</h2><p class="text-sm text-gray-600 mt-1">${m.heroLine}</p></div>${icon('chevronRight', 'w-5 h-5 text-gray-300 ml-auto shrink-0 self-center')}</a>`)
    .join('');

  const detailSections = markets
    .map(
      (m, idx) => `
    <section id="market-${m.slug}" class="py-20 scroll-mt-24 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-bg'}">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
        <span class="bg-gold/10 text-gold text-xs font-semibold px-4 py-1.5 rounded-full tracking-wide">${m.region} · ${m.fullName || m.name}</span>
        <h2 class="text-3xl md:text-4xl font-bold text-navy mt-5 tracking-tight">${m.heroLine}</h2>
        <p class="text-gray-600 mt-5 leading-relaxed">${m.intro}</p>
        <button data-open-booking class="mt-7 ${BTN_PRIMARY} px-7 py-3.5 inline-flex items-center gap-2">${icon('calendar', 'w-4 h-4')} ${t(lang, 'ctaBooking')}</button>
      </div>
    </section>`
    )
    .join('');

  const body = `
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
      <h1 class="text-4xl md:text-6xl font-bold text-navy tracking-tight">${t(lang, 'marketsTitle')}</h1>
      <p class="text-gray-600 text-lg mt-6">${t(lang, 'marketsSubtitle')}</p>
    </div>
  </section>
  <section class="pb-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">${cards}</div>
  </section>
  ${detailSections}`;

  return pageShell({ lang, page: 'markets.html', title: t(lang, 'marketsTitle'), description: t(lang, 'marketsSubtitle'), crumbs: [{ label: t(lang, 'navMarkets') }], bodyHTML: body });
}

function insightsListPage(lang) {
  const cards = insights
    .map(
      (p) => `
    <article class="${CARD_MUTED} flex flex-col">
      <div class="mb-3 flex items-center justify-between">${icon(p.icon, 'w-8 h-8 text-gold')}<span class="text-xs font-medium text-gold bg-gold/10 px-2.5 py-1 rounded-full">${p.category}</span></div>
      <h2 class="text-lg font-bold text-navy tracking-tight">${p.title}</h2>
      <p class="text-gray-600 text-sm mt-2.5 flex-1 leading-relaxed">${p.excerpt}</p>
      <div class="text-xs text-gray-400 mt-5 flex items-center gap-2"><time datetime="${p.publishedDate}">${p.publishedDate}</time><span aria-hidden="true">·</span><span>${p.readTime} ${t(lang, 'insightsReadTime')}</span></div>
      <a href="insight-${p.slug}.html" class="text-gold text-sm font-medium mt-4 inline-block hover:underline underline-offset-4">${t(lang, 'ctaReadMore')} →</a>
    </article>`
    )
    .join('');

  const body = `
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
      <h1 class="text-4xl md:text-6xl font-bold text-navy tracking-tight">${t(lang, 'insightsTitle')}</h1>
      <p class="text-gray-600 text-lg mt-6">${t(lang, 'insightsSubtitle')}</p>
    </div>
  </section>
  <section class="pb-24 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">${cards}</div>
  </section>`;

  return pageShell({ lang, page: 'insights.html', title: t(lang, 'insightsTitle'), description: t(lang, 'insightsSubtitle'), crumbs: [{ label: t(lang, 'navInsights') }], bodyHTML: body });
}

function insightPostPage(lang, post) {
  const page = `insight-${post.slug}.html`;
  const body = `
  <article class="py-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
      <span class="text-xs font-medium text-gold bg-gold/10 px-2.5 py-1 rounded-full tracking-wide">${post.category}</span>
      <h1 class="text-4xl md:text-5xl font-bold text-navy mt-5 tracking-tight leading-tight">${post.title}</h1>
      <div class="text-sm text-gray-400 mt-5 flex items-center gap-2"><span>${t(lang, 'insightsPublished')}</span><time datetime="${post.publishedDate}">${post.publishedDate}</time><span aria-hidden="true">·</span><span>${post.readTime} ${t(lang, 'insightsReadTime')}</span></div>
      <div class="mt-12 space-y-7">${post.body.map((para) => `<p class="text-gray-700 leading-[1.85] text-lg">${para}</p>`).join('')}</div>
      <a href="insights.html" class="inline-flex items-center gap-2 mt-14 text-navy font-medium hover:text-gold transition">${icon('arrowLeft', 'w-4 h-4')} ${t(lang, 'insightsBackToList')}</a>
    </div>
  </article>`;

  const jsonLd = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.excerpt, datePublished: post.publishedDate, author: { '@type': 'Organization', name: 'ENZ INTERNATIONAL' } };

  return pageShell({ lang, page, title: post.title, description: post.excerpt, jsonLd, crumbs: [{ label: t(lang, 'navInsights'), href: 'insights.html' }, { label: post.title }], bodyHTML: body });
}

function contactPage(lang) {
  const faqItems = faqs
    .map(
      (f, idx) => `
    <div>
      <h3><button class="faq-question w-full flex items-center justify-between py-6 text-left font-medium text-navy hover:text-gold transition-colors" aria-expanded="false" aria-controls="faq-panel-${idx}" id="faq-btn-${idx}"><span>${f.question}</span>${icon('chevronDown', 'w-5 h-5 shrink-0 faq-chevron transition-transform')}</button></h3>
      <div id="faq-panel-${idx}" role="region" aria-labelledby="faq-btn-${idx}" hidden class="pb-6 text-sm text-gray-600 leading-relaxed">${f.answer}</div>
    </div>`
    )
    .join('');

  const body = `
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
      <h1 class="text-4xl md:text-6xl font-bold text-navy tracking-tight">${t(lang, 'contactTitle')}</h1>
      <p class="text-gray-600 text-lg mt-6">${t(lang, 'contactSubtitle')}</p>
    </div>
  </section>
  <section class="pb-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
      <div>
        <div class="bg-gray-bg rounded-2xl border border-gray-100 shadow-sm p-7">
          <h2 class="font-bold text-navy text-lg mb-5 tracking-tight">${t(lang, 'contactDetailsTitle')}</h2>
          <ul class="space-y-4 text-sm text-gray-700">
            <li class="flex items-start gap-3">${icon('mapPin', 'w-5 h-5 text-gold shrink-0 mt-0.5')}<span>${t(lang, 'contactAddress')}</span></li>
            <li class="flex items-start gap-3">${icon('phone', 'w-5 h-5 text-gold shrink-0 mt-0.5')}<a href="tel:${CONTACT_PHONE.replace(/\s/g, '')}" class="hover:text-gold transition">${CONTACT_PHONE}</a></li>
            <li class="flex items-start gap-3">${icon('mail', 'w-5 h-5 text-gold shrink-0 mt-0.5')}<a href="mailto:${CONTACT_EMAIL}" class="hover:text-gold transition">${CONTACT_EMAIL}</a></li>
          </ul>
          <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" class="mt-7 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3.5 rounded-full text-sm font-medium transition">${icon('whatsapp', 'w-4 h-4')} ${t(lang, 'footerWhatsapp')}</a>
        </div>
        <div class="mt-6 rounded-2xl overflow-hidden border border-gray-100 shadow-sm h-64">
          <iframe title="ENZ INTERNATIONAL — Guangzhou HQ location" src="https://www.google.com/maps?q=Guangzhou%2C+China&output=embed" width="100%" height="100%" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 shadow-md p-7">
        <form id="booking-form" class="space-y-5">
          <p class="text-sm text-gray-500">${t(lang, 'bookingIntro')}</p>
          <div><label for="cf-name" class="block text-sm font-medium text-navy/80">${t(lang, 'bookingName')}</label><input id="cf-name" name="name" type="text" required class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50" /></div>
          <div><label for="cf-email" class="block text-sm font-medium text-navy/80">${t(lang, 'bookingEmail')}</label><input id="cf-email" name="email" type="email" required class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50" /></div>
          <div><label for="cf-date" class="block text-sm font-medium text-navy/80">${t(lang, 'bookingDate')}</label><input id="cf-date" name="date" type="date" required class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50" /></div>
          <div><label for="cf-service" class="block text-sm font-medium text-navy/80">${t(lang, 'bookingService')}</label><select id="cf-service" name="service" class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"><option value="">—</option><option value="sourcing">${t(lang, 'bookingServiceOptSourcing')}</option><option value="factory">${t(lang, 'bookingServiceOptFactory')}</option><option value="market">${t(lang, 'bookingServiceOptMarket')}</option></select></div>
          <input type="hidden" name="phone" value="" /><input type="hidden" name="company" value="" /><input type="hidden" name="message" value="" />
          <p id="booking-error" role="alert" hidden class="text-sm text-red-600">${t(lang, 'bookingErrorTitle')}</p>
          <button type="submit" data-submitting-label="${t(lang, 'bookingSubmitting')}" class="w-full ${BTN_PRIMARY} py-4">${t(lang, 'bookingSubmit')}</button>
        </form>
        <div id="booking-success" role="status" hidden class="text-center py-6"><div class="text-4xl mb-4">✅</div><p class="text-lg font-semibold text-navy">${t(lang, 'bookingSuccessTitle')}</p></div>
      </div>
    </div>
  </section>
  <section class="py-24 bg-gray-bg">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold text-navy text-center tracking-tight mb-14">${t(lang, 'faqTitle')}</h2>
      <div class="max-w-3xl mx-auto divide-y divide-gray-200 border-t border-b border-gray-200">${faqItems}</div>
    </div>
  </section>`;

  return pageShell({ lang, page: 'contact.html', title: t(lang, 'contactTitle'), description: t(lang, 'contactSubtitle'), crumbs: [{ label: t(lang, 'navContact') }], bodyHTML: body });
}

function portalPage(lang) {
  const body = `
  <section class="py-24 bg-white min-h-[60vh]">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
      <div class="bg-gray-bg rounded-2xl border border-gray-100 shadow-sm p-9">
        <h1 class="text-2xl font-bold text-navy mb-3 tracking-tight">${t(lang, 'portalTitle')}</h1>
        <form id="portal-login-form" class="space-y-5">
          <p class="text-sm text-gray-500">${t(lang, 'portalIntro')}</p>
          <div><label for="pp-email" class="block text-sm font-medium text-navy/80">${t(lang, 'portalEmailLabel')}</label><input id="pp-email" name="email" type="email" required class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50" /></div>
          <div><label for="pp-password" class="block text-sm font-medium text-navy/80">${t(lang, 'portalPassLabel')}</label><input id="pp-password" name="password" type="password" required class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50" /></div>
          <button type="submit" class="w-full bg-navy hover:bg-slate-blue text-white font-semibold py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-[1.02]">${t(lang, 'portalLogin')}</button>
          <p class="text-xs text-gray-400 text-center">${t(lang, 'portalAccessHelp')} <a href="mailto:${CONTACT_EMAIL}" class="text-gold hover:underline">${CONTACT_EMAIL}</a></p>
        </form>
        <div id="portal-success" role="status" hidden class="text-center py-6"><div class="text-4xl mb-4">✅</div><p class="text-lg font-semibold text-navy">${t(lang, 'portalMock')}</p><p class="text-sm text-gray-500 mt-2">${t(lang, 'portalLoggedInDesc')}</p></div>
      </div>
    </div>
  </section>`;
  return pageShell({ lang, page: 'portal.html', title: t(lang, 'navPortal'), description: t(lang, 'portalIntro'), crumbs: [{ label: t(lang, 'navPortal') }], bodyHTML: body });
}

function careersPage(lang) {
  const body = `
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
      <h1 class="text-4xl md:text-6xl font-bold text-navy tracking-tight">${t(lang, 'careersTitle')}</h1>
      <p class="text-gray-600 text-lg mt-6">${t(lang, 'careersSubtitle')}</p>
    </div>
  </section>
  <section class="pb-24 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-xl">
      <div class="bg-gray-bg rounded-2xl border border-dashed border-gray-200 p-7 text-center mb-9">${icon('briefcase', 'w-8 h-8 text-gold mx-auto mb-3')}<p class="text-sm text-gray-600">${t(lang, 'careersNoOpenings')}</p></div>
      <form id="careers-form" enctype="multipart/form-data" class="bg-white border border-gray-100 shadow-md rounded-2xl p-7 space-y-5">
        <h2 class="font-bold text-navy tracking-tight">${t(lang, 'careersSendCv')}</h2>
        <div><label for="cv-name" class="block text-sm font-medium text-navy/80">${t(lang, 'bookingName')}</label><input id="cv-name" name="name" type="text" required class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50" /></div>
        <div><label for="cv-email" class="block text-sm font-medium text-navy/80">${t(lang, 'bookingEmail')}</label><input id="cv-email" name="email" type="email" required class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50" /></div>
        <div><label for="cv-message" class="block text-sm font-medium text-navy/80">${t(lang, 'bookingMessage')}</label><textarea id="cv-message" name="message" rows="3" class="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"></textarea></div>
        <div><label for="cv-file" class="block text-sm font-medium text-navy/80 mb-1.5">CV / Resume (PDF)</label><input id="cv-file" name="cv" type="file" accept="application/pdf" class="block w-full text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-xl px-4 py-7 cursor-pointer" /></div>
        <button type="submit" class="w-full ${BTN_PRIMARY} py-4">${t(lang, 'ctaSubmit')}</button>
      </form>
      <p id="careers-success" role="status" hidden class="text-center text-navy font-medium mt-6">${t(lang, 'bookingSuccessTitle')}</p>
    </div>
  </section>`;
  return pageShell({ lang, page: 'careers.html', title: t(lang, 'navCareers'), description: t(lang, 'careersSubtitle'), crumbs: [{ label: t(lang, 'navCareers') }], bodyHTML: body });
}

function legalPage(lang, type) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? t(lang, 'footerPrivacy') : t(lang, 'footerTerms');
  const content = isPrivacy
    ? `<p>ENZ INTERNATIONAL ("we", "us") collects information you provide directly — such as your name, email, and project details submitted through our consultation and newsletter forms — in order to respond to your enquiry and, where you've opted in, send occasional updates.</p>
       <h2 class="text-xl font-bold text-navy mt-6">What we collect</h2><p>Contact-form and booking submissions, newsletter sign-up emails, and — once analytics tooling is connected — standard usage data.</p>
       <h2 class="text-xl font-bold text-navy mt-6">Your rights</h2><p>You may have the right to access, correct, or delete your data, or withdraw consent for marketing emails at any time.</p>
       <h2 class="text-xl font-bold text-navy mt-6">Contact</h2><p>Questions can be sent to <a href="mailto:${CONTACT_EMAIL}" class="text-gold hover:underline">${CONTACT_EMAIL}</a>.</p>`
    : `<p>These terms govern your use of the ENZ INTERNATIONAL website. By using this site, you agree to use it only for lawful purposes.</p>
       <h2 class="text-xl font-bold text-navy mt-6">No binding offer</h2><p>Content on this site is informational and does not constitute a binding offer. Engagements are governed by separately signed contracts.</p>
       <h2 class="text-xl font-bold text-navy mt-6">Contact</h2><p>Questions can be sent to <a href="mailto:${CONTACT_EMAIL}" class="text-gold hover:underline">${CONTACT_EMAIL}</a>.</p>`;

  const body = `
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
      <h1 class="text-3xl font-bold text-navy mb-3 tracking-tight">${title}</h1>
      <p class="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-9">Placeholder text — not reviewed by counsel. Replace before launch.</p>
      <div class="space-y-6 text-gray-700 leading-relaxed">${content}</div>
    </div>
  </section>`;
  return pageShell({ lang, page: `${type}.html`, title, description: title, crumbs: [{ label: title }], bodyHTML: body });
}

// ============================================================================
// Write files
// ============================================================================

for (const lang of SUPPORTED_LANGUAGES) {
  const dir = path.join(OUT, lang);
  mkdirSync(dir, { recursive: true });

  const pages = [
    ['index.html', homePage],
    ['about.html', aboutPage],
    ['services.html', servicesPage],
    ['markets.html', marketsPage],
    ['insights.html', insightsListPage],
    ['contact.html', contactPage],
    ['portal.html', portalPage],
    ['careers.html', careersPage],
  ];

  for (const [file, builder] of pages) {
    writeFileSync(path.join(dir, file), builder(lang));
  }

  for (const post of insights) {
    writeFileSync(path.join(dir, `insight-${post.slug}.html`), insightPostPage(lang, post));
  }

  writeFileSync(path.join(dir, 'privacy.html'), legalPage(lang, 'privacy'));
  writeFileSync(path.join(dir, 'terms.html'), legalPage(lang, 'terms'));

  console.log(`Wrote ${lang}/ (${pages.length + insights.length + 2} pages)`);
}

writeFileSync(
  path.join(OUT, 'index.html'),
  `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta http-equiv="refresh" content="0; url=en/index.html" /><link rel="canonical" href="${SITE_URL}/en/index.html" /><title>ENZ INTERNATIONAL</title></head><body><script>location.replace('en/index.html');</script><p>Redirecting to <a href="en/index.html">ENZ INTERNATIONAL</a>…</p></body></html>`
);

writeFileSync(
  path.join(OUT, '404.html'),
  `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Page not found | ENZ INTERNATIONAL</title><script src="https://cdn.tailwindcss.com"></script><style>body{font-family:sans-serif}</style></head><body class="bg-gray-bg text-navy min-h-screen flex items-center justify-center text-center px-4"><div><p class="text-gold font-bold text-6xl">404</p><h1 class="text-2xl font-bold mt-4">Page not found</h1><p class="text-gray-600 mt-2">The page you're looking for doesn't exist or may have moved.</p><a href="en/index.html" class="inline-block mt-8 bg-gold text-navy font-semibold px-6 py-3 rounded-full">Back to homepage</a></div></body></html>`
);

writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /*/portal.html\nDisallow: /*/privacy.html\nDisallow: /*/terms.html\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

const sitemapPages = ALL_PAGES.filter((p) => !['portal.html', 'privacy.html', 'terms.html'].includes(p));
const urls = SUPPORTED_LANGUAGES.flatMap((lang) =>
  sitemapPages.map(
    (page) => `  <url>\n    <loc>${SITE_URL}/${lang}/${page}</loc>\n${SUPPORTED_LANGUAGES.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}/${page}" />`).join('\n')}\n  </url>`
  )
);
writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
);

console.log(`\nDone. ${SUPPORTED_LANGUAGES.length} languages × ${ALL_PAGES.length} pages + index/404/robots/sitemap written to repo root`);
