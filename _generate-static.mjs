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
import { processSteps, qcStages, aqlExplainer, incoterms, shippingDocs, industries, comparison, resources, trustSignals } from './_content/pages.js';
import { landedCost, commonMistakes, paymentTerms, timelines, glossary, whyChina } from './_content/pages2.js';
import { problems, engagementModels, pricingFactors, gettingStarted } from './_content/narrative.js';
import { testimonials, caseStudies, commitments } from './_content/proof.js';

const OUT = path.resolve('.'); // repo root — this IS the site
const SITE_URL = 'https://enzinternational.co';
const WHATSAPP_NUMBER = '8613203840456';
const CONTACT_PHONE = '+86 132 0384 0456';
const CONTACT_EMAIL = 'info@enzinternational.co';

// Cache-buster appended to every JS URL. Browsers cache these aggressively by
// filename, so a fixed script can keep losing to a stale copy already sitting
// in someone's cache — which is exactly how a since-fixed bug keeps "coming
// back" for a viewer. BUMP THIS whenever a file in assets/js/ changes.
const ASSET_VERSION = '14';

// One weight range, one request. `display=swap` means text paints immediately
// in the fallback and re-renders in Inter — never an invisible headline.
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&display=swap';

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

// ---------- Design system ----------
// Tech-premium (Stripe/Linear/Ramp): white canvas, hairline borders, one blue
// accent, near-black type — plus depth: gradient dark bands, glow, an
// engineering grid texture, and hover states that lift.
//
// These constants are now thin aliases over real component classes compiled
// into assets/css/site.css (source: _build/tailwind.src.css). Anything with a
// gradient, a pseudo-element, or a state lives in CSS, because none of that
// can be expressed as utility classes in markup — and because a single class
// name here restyles all 76 pages at once.
//
// Hover states animate COLOR / SHADOW / TRANSFORM only — never opacity — so a
// stalled transition can never hide content.
const CARD = 'card';
const CARD_MUTED = 'card card-muted';
const CARD_DARK = 'card-dark';
const BTN_PRIMARY = 'btn btn-primary';
const BTN_SECONDARY = 'btn btn-secondary';
const BTN_GHOST_LIGHT = 'btn btn-ghost-light';
const EYEBROW = 'eyebrow';
const EYEBROW_LIGHT = 'eyebrow eyebrow-light';
const H2 = 'h2-section';
const H2_LIGHT = 'h2-section on-dark';
const LEAD = 'lead';
const LEAD_LIGHT = 'lead-light';
const SHELL = 'shell';

// Centred section header — eyebrow, heading, lead. Repeated ~30 times across
// the site; having it in one function is what keeps the vertical rhythm
// identical everywhere instead of drifting a few pixels per section.
// Centred is the default because it suits a hero-adjacent statement, but it is
// NOT the default for every band. Ten of fourteen homepage sections opening
// with the identical eyebrow -> heading -> centred lead was the single loudest
// "assembled from a template" signal on the page: real sites vary their
// alignment because different content wants different emphasis.
//
// `align: 'start'` puts the heading hard left with the lead beside it, which
// reads as an editor's decision rather than a component default.
function sectionHead(eyebrow, title, lead, { dark = false, align = 'center' } = {}) {
  if (align === 'start') {
    return `
      <div class="grid lg:grid-cols-12 gap-6 lg:gap-12 items-end">
        <div class="lg:col-span-6">
          ${eyebrow ? `<p class="${dark ? EYEBROW_LIGHT : EYEBROW}">${eyebrow}</p>` : ''}
          <h2 class="${dark ? H2_LIGHT : H2} mt-4">${title}</h2>
        </div>
        ${lead ? `<div class="lg:col-span-6"><p class="${dark ? LEAD_LIGHT : LEAD}">${lead}</p></div>` : ''}
      </div>`;
  }
  const wrap = align === 'center' ? 'max-w-3xl mx-auto text-center' : 'max-w-3xl';
  return `
      <div class="${wrap}">
        ${eyebrow ? `<p class="${dark ? EYEBROW_LIGHT : EYEBROW}">${eyebrow}</p>` : ''}
        <h2 class="${dark ? H2_LIGHT : H2} mt-4">${title}</h2>
        ${lead ? `<p class="${dark ? LEAD_LIGHT : LEAD} mt-5">${lead}</p>` : ''}
      </div>`;
}

// One engagement model, as a card. Shared by the homepage summary and the
// dedicated pricing page so the two can never drift apart.
function engagementCard(lang, m, { detailed = false } = {}) {
  const featured = m.featured
    ? 'border-brand-200 shadow-lift ring-1 ring-brand-100'
    : '';
  return `
        <div class="${CARD} card-lg flex flex-col h-full ${featured}">
          ${m.featured ? `<span class="pill absolute -top-3 left-6">${t(lang, 'engagePopular')}</span>` : ''}
          <span class="icon-chip">${icon(m.icon, 'w-5 h-5')}</span>
          <h3 class="text-lg font-medium text-ink mt-5">${m.name}</h3>
          <p class="text-brand text-sm font-medium mt-1">${m.tagline}</p>
          <p class="text-slate text-sm mt-3 leading-relaxed">${m.body}</p>

          <p class="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-slate mt-6">${t(lang, 'engageIncludes')}</p>
          <ul class="mt-3 space-y-2 flex-1">
            ${(detailed ? m.includes : m.includes.slice(0, 3))
              .map((f) => `<li class="check-item text-[0.8125rem]">${icon('check', 'w-3.5 h-3.5')}<span>${f}</span></li>`)
              .join('')}
          </ul>

          <div class="mt-6 pt-5 border-t border-line">
            <p class="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase text-slate">${t(lang, 'engageBestFor')}</p>
            <p class="text-sm text-ink mt-1.5">${m.bestFor}</p>
          </div>
          ${detailed ? `<button data-open-booking class="${m.featured ? BTN_PRIMARY : BTN_SECONDARY} w-full mt-6">${t(lang, 'ctaBooking')}</button>` : ''}
        </div>`;
}

// Testimonials and case studies render ONLY when there is real content in
// _content/proof.js. Both arrays ship empty, so this returns an empty string
// and the page simply doesn't have the section — rather than shipping invented
// quotes to real visitors. Add entries and it appears, no markup to touch.
function proofSection(lang) {
  if (!testimonials.length && !caseStudies.length) return '';

  const studyCards = caseStudies
    .map(
      (cs) => `
        <article class="${CARD} card-lg flex flex-col">
          <div class="flex flex-wrap items-center gap-2">
            <span class="pill">${cs.sector}</span><span class="pill pill-neutral">${cs.market}</span>
          </div>
          <h3 class="text-lg font-medium text-ink mt-5">${cs.challenge}</h3>
          <p class="text-slate text-sm mt-3 leading-relaxed flex-1">${cs.approach}</p>
          <p class="text-ink text-sm mt-3 leading-relaxed">${cs.outcome}</p>
          ${
            cs.metrics && cs.metrics.length
              ? `<div class="grid grid-cols-${Math.min(cs.metrics.length, 3)} gap-4 mt-6 pt-5 border-t border-line">
              ${cs.metrics.map((mt) => `<div><div class="text-xl font-semibold text-ink tabular">${mt.value}</div><div class="text-xs text-slate mt-1">${mt.label}</div></div>`).join('')}
            </div>`
              : ''
          }
        </article>`
    )
    .join('');

  const quoteCards = testimonials
    .map(
      (q) => `
        <figure class="${CARD} card-lg flex flex-col">
          <blockquote class="text-ink text-[1.0625rem] leading-relaxed flex-1">&ldquo;${q.quote}&rdquo;</blockquote>
          <figcaption class="flex items-center gap-3 mt-6 pt-5 border-t border-line">
            <span class="icon-chip rounded-full text-sm font-semibold">${q.initials}</span>
            <span class="text-sm">
              <span class="block font-medium text-ink">${q.name}</span>
              <span class="block text-slate">${q.role}${q.company ? `, ${q.company}` : ''}</span>
            </span>
          </figcaption>
        </figure>`
    )
    .join('');

  return `
  <section class="section bg-white">
    <div class="${SHELL}">
      ${sectionHead(t(lang, 'proofEyebrow'), t(lang, 'proofTitle'), null)}
      ${studyCards ? `<div data-reveal-group class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">${studyCards}</div>` : ''}
      ${quoteCards ? `<div data-reveal-group class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-${studyCards ? '5' : '14'}">${quoteCards}</div>` : ''}
    </div>
  </section>`;
}

// The two decorative light sources behind every dark band. Sizes differ per
// section so the bands don't look copy-pasted.
function glows(variant = 'a') {
  const presets = {
    a: `<div aria-hidden="true" class="glow glow-brand w-[34rem] h-[34rem] -top-40 -left-32"></div>
        <div aria-hidden="true" class="glow glow-accent w-[26rem] h-[26rem] -bottom-32 -right-24"></div>`,
    b: `<div aria-hidden="true" class="glow glow-brand w-[30rem] h-[30rem] -top-32 right-[-6rem]"></div>
        <div aria-hidden="true" class="glow glow-accent w-[22rem] h-[22rem] bottom-[-8rem] left-[-4rem]"></div>`,
  };
  return presets[variant] || presets.a;
}

// The word "Language", in each language — the mobile menu labels the switcher
// in the language the reader is already in, not in English.
const LANG_LABEL = { en: 'Language', sw: 'Lugha', fr: 'Langue', zh: '语言' };

const NAV_ITEMS = [
  { page: 'index.html', key: 'navHome' },
  { page: 'services.html', key: 'navServices' },
  { page: 'process.html', key: 'navProcess' },
  { page: 'pricing.html', key: 'navPricing' },
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
  'process.html',
  'pricing.html',
  'industries.html',
  'quality-control.html',
  'logistics.html',
  'faq.html',
  'resources.html',
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
  return `<select aria-label="Language" data-lang-select data-target-template="${template}" class="lang-select">${options}</select>`;
}

function headerHTML(lang, currentPage) {
  const links = NAV_ITEMS.map(
    (item) =>
      `<a href="${item.page}" class="nav-link"${item.page === currentPage ? ' aria-current="page"' : ''}>${t(lang, item.key)}</a>`
  ).join('\n');
  const mobileLinks = NAV_ITEMS.map(
    (item) =>
      `<a href="${item.page}" class="nav-link-mobile"${item.page === currentPage ? ' aria-current="page"' : ''}>${t(lang, item.key)}${icon('chevronRight', 'w-4 h-4 opacity-40')}</a>`
  ).join('\n');

  return `
  <header class="site-header" data-site-header>
    <div class="${SHELL} flex items-center justify-between gap-6 h-[4.25rem]">
      <a href="index.html" class="flex items-center shrink-0" aria-label="ENZ INTERNATIONAL — home">
        <img src="../assets/images/enz-logo.png" alt="ENZ INTERNATIONAL" width="132" height="36" class="h-9 w-auto object-contain" />
      </a>
      <nav class="hidden xl:flex items-center gap-5 2xl:gap-7 min-w-0 text-[0.875rem] 2xl:text-[0.9375rem] font-medium" aria-label="Primary">
        ${links}
      </nav>
      <div class="hidden xl:flex items-center gap-2 2xl:gap-2.5 shrink-0">
        ${langSwitcher(lang, currentPage)}
        <button data-open-portal class="${BTN_SECONDARY} btn-sm">
          ${icon('user', 'w-4 h-4')}<span>${t(lang, 'navPortal')}</span>
        </button>
        <button data-open-booking class="${BTN_PRIMARY} btn-sm">${t(lang, 'ctaBookingShort')}${icon('chevronRight', 'w-3.5 h-3.5 btn-arrow')}</button>
      </div>
      <div class="flex xl:hidden items-center gap-2">
        <button data-open-booking class="${BTN_PRIMARY} btn-sm hidden sm:inline-flex">${t(lang, 'ctaBookingShort')}</button>
        <button id="mobile-menu-toggle" aria-expanded="false" aria-controls="mobile-nav" class="inline-flex items-center justify-center w-10 h-10 -mr-2 rounded-lg text-ink hover:bg-gray-bg transition-colors" aria-label="Toggle menu">
          ${icon('menu', 'w-6 h-6')}
        </button>
      </div>
    </div>
    <nav id="mobile-nav" hidden aria-label="Primary" class="xl:hidden bg-white border-t border-line shadow-lg max-h-[calc(100vh-4.25rem)] overflow-y-auto">
      <div class="${SHELL} py-5 text-[0.9375rem]">
        ${mobileLinks}
        <div class="pt-5 space-y-3">
          <button data-open-booking class="${BTN_PRIMARY} w-full">${t(lang, 'ctaBooking')}${icon('chevronRight', 'w-4 h-4 btn-arrow')}</button>
          <button data-open-portal class="${BTN_SECONDARY} w-full">
            ${icon('user', 'w-4 h-4')}<span>${t(lang, 'navPortal')}</span>
          </button>
          <div class="flex items-center justify-between pt-2">
            <span class="text-xs font-medium text-slate">${LANG_LABEL[lang] || 'Language'}</span>
            ${langSwitcher(lang, currentPage)}
          </div>
        </div>
      </div>
    </nav>
  </header>`;
}

function footerHTML(lang) {
  const fLink = (href, label) =>
    `<li><a href="${href}" class="inline-block text-white/60 hover:text-white transition-colors">${label}</a></li>`;

  return `
  <footer class="section-dark text-white/70 pt-16 pb-8 md:pt-20">
    <div aria-hidden="true" class="glow glow-brand w-[30rem] h-[30rem] -top-48 left-1/4"></div>
    <div class="${SHELL} grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12">
      <div class="col-span-2 lg:col-span-4">
        <img src="../assets/images/enz-logo.png" alt="ENZ INTERNATIONAL" width="140" height="40" class="h-10 w-auto object-contain" />
        <p class="text-sm max-w-xs leading-relaxed mt-5 text-white/60">${t(lang, 'footerAbout')}</p>
        <ul class="mt-6 space-y-2.5 text-sm">
          <li class="flex items-center gap-2.5">${icon('phone', 'w-4 h-4 text-brand-bright shrink-0')}<a href="tel:${CONTACT_PHONE.replace(/\s/g, '')}" class="text-white/70 hover:text-white transition-colors">${CONTACT_PHONE}</a></li>
          <li class="flex items-center gap-2.5">${icon('mail', 'w-4 h-4 text-brand-bright shrink-0')}<a href="mailto:${CONTACT_EMAIL}" class="text-white/70 hover:text-white transition-colors">${CONTACT_EMAIL}</a></li>
          <li class="flex items-start gap-2.5">${icon('mapPin', 'w-4 h-4 text-brand-bright shrink-0 mt-0.5')}<span class="text-white/60">${hubs.join(' · ')}</span></li>
        </ul>
        <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" class="${BTN_GHOST_LIGHT} btn-sm mt-6">
          ${icon('whatsapp', 'w-4 h-4')} ${t(lang, 'footerWhatsapp')}
        </a>
      </div>

      <div class="lg:col-span-2">
        <h2 class="text-white font-semibold text-xs uppercase tracking-[0.14em] mb-4">${t(lang, 'footerServices')}</h2>
        <ul class="text-sm space-y-2.5">
          ${fLink('services.html', t(lang, 'tabSourcing'))}
          ${fLink('services.html', t(lang, 'tabFactory'))}
          ${fLink('services.html', t(lang, 'service3'))}
          ${fLink('quality-control.html', t(lang, 'qcEyebrow'))}
          ${fLink('logistics.html', t(lang, 'logisticsEyebrow'))}
        </ul>
      </div>

      <div class="lg:col-span-2">
        <h2 class="text-white font-semibold text-xs uppercase tracking-[0.14em] mb-4">${t(lang, 'footerCompany')}</h2>
        <ul class="text-sm space-y-2.5">
          ${fLink('about.html', t(lang, 'navAbout'))}
          ${fLink('markets.html', t(lang, 'navMarkets'))}
          ${fLink('process.html', t(lang, 'navProcess'))}
          ${fLink('pricing.html', t(lang, 'navPricing'))}
          ${fLink('industries.html', t(lang, 'navIndustries'))}
          ${fLink('careers.html', t(lang, 'navCareers'))}
          ${fLink('contact.html', t(lang, 'navContact'))}
        </ul>
      </div>

      <div class="lg:col-span-4">
        <h2 class="text-white font-semibold text-xs uppercase tracking-[0.14em] mb-4">${t(lang, 'navResources')}</h2>
        <ul class="text-sm space-y-2.5">
          ${fLink('resources.html', t(lang, 'resourcesTitle'))}
          ${fLink('insights.html', t(lang, 'navInsights'))}
          ${fLink('faq.html', 'FAQ')}
        </ul>
        <form data-newsletter-form class="mt-8">
          <label for="newsletter-email" class="text-white font-semibold text-sm block">${t(lang, 'footerNewsletterTitle')}</label>
          <p class="text-xs text-white/60 mt-1.5 mb-3 leading-relaxed">${t(lang, 'footerNewsletterDesc')}</p>
          <div class="flex gap-2">
            <input id="newsletter-email" name="email" type="email" required autocomplete="email" placeholder="${t(lang, 'footerNewsletterPlaceholder')}" class="field field-dark flex-1 min-w-0" />
            <button type="submit" class="${BTN_PRIMARY} btn-sm shrink-0">${t(lang, 'ctaSubscribe')}</button>
          </div>
        </form>
        <p data-error-slot role="alert" hidden class="text-sm text-red-300 mt-3"></p>
        <p data-newsletter-success role="status" hidden class="text-sm text-brand-bright mt-3 flex items-center gap-2">${icon('check', 'w-4 h-4')}${t(lang, 'footerNewsletterSuccess')}</p>
      </div>
    </div>

    <div class="${SHELL} mt-14 pt-7 border-t border-white/10 flex flex-col-reverse md:flex-row items-center justify-between gap-4 text-xs text-white/60">
      <p>© <span data-current-year>${new Date().getFullYear()}</span> ENZ INTERNATIONAL. All rights reserved.</p>
      <div class="flex flex-wrap justify-center gap-x-6 gap-y-2">
        <a href="privacy.html" class="hover:text-white transition-colors">${t(lang, 'footerPrivacy')}</a>
        <a href="terms.html" class="hover:text-white transition-colors">${t(lang, 'footerTerms')}</a>
        <a href="../sitemap.xml" class="hover:text-white transition-colors">Sitemap</a>
      </div>
    </div>
  </footer>`;
}

// Shown after a successful enquiry. Answering "what now?" at the moment of
// submission is the cheapest way to stop a lead going cold — it replaces an
// ambiguous silence with a stated turnaround the sender can hold us to.
function nextStepsHTML(lang) {
  const steps = [t(lang, 'bookingNext1'), t(lang, 'bookingNext2'), t(lang, 'bookingNext3')];
  return `
        <div class="mt-7 pt-6 border-t border-line text-left">
          <p class="eyebrow text-slate">${t(lang, 'bookingNextTitle')}</p>
          <ol class="mt-4 space-y-3">
            ${steps
              .map(
                (s, i) =>
                  `<li class="flex gap-3 text-sm text-slate"><span class="step-badge w-6 h-6">${i + 1}</span><span>${s}</span></li>`
              )
              .join('')}
          </ol>
        </div>`;
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
  <div id="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title" style="display:none" data-modal-backdrop class="modal-backdrop">
    <div class="modal-panel">
      <button data-close-modal aria-label="Close dialog" class="modal-close">${icon('close', 'w-6 h-6')}</button>
      <h2 id="booking-modal-title" class="text-[1.375rem] font-semibold text-ink pr-8">${t(lang, 'bookingTitle')}</h2>
      <form data-booking-form class="space-y-5">
        <p class="text-sm text-slate">${t(lang, 'bookingIntro')}</p>
        <div>
          <label for="booking-name" class="field-label">${t(lang, 'bookingName')}</label>
          <input id="booking-name" name="name" type="text" required class="field" />
        </div>
        <div>
          <label for="booking-email" class="field-label">${t(lang, 'bookingEmail')}</label>
          <input id="booking-email" name="email" type="email" required class="field" />
        </div>
        <div data-reveal-group class="grid grid-cols-2 gap-4">
          <div>
            <label for="booking-phone" class="field-label">${t(lang, 'bookingPhone')}</label>
            <input id="booking-phone" name="phone" type="tel" class="field" />
          </div>
          <div>
            <label for="booking-company" class="field-label">${t(lang, 'bookingCompany')}</label>
            <input id="booking-company" name="company" type="text" class="field" />
          </div>
        </div>
        <div>
          <label for="booking-date" class="field-label">${t(lang, 'bookingDate')}</label>
          <input id="booking-date" name="date" type="date" class="field" />
        </div>
        <div>
          <label for="booking-service" class="field-label">${t(lang, 'bookingService')}</label>
          <select id="booking-service" name="service" class="field"><option value="">—</option>${opts}</select>
        </div>
        <div>
          <label for="booking-message" class="field-label">${t(lang, 'bookingMessage')}</label>
          <textarea id="booking-message" name="message" rows="3" class="field"></textarea>
        </div>
        <p data-booking-error data-error-slot role="alert" hidden class="text-sm text-red-600">${t(lang, 'bookingErrorTitle')} — ${t(lang, 'bookingErrorDesc')}</p>
        <button type="submit" data-submitting-label="${t(lang, 'bookingSubmitting')}" class="w-full ${BTN_PRIMARY} py-4">${t(lang, 'bookingSubmit')}</button>
        <p class="text-xs text-slate text-center">${t(lang, 'bookingDisclaimer')}</p>
      </form>
      <div data-booking-success role="status" hidden class="py-6">
        <div class="text-center">
          <div class="icon-chip w-12 h-12 rounded-full mx-auto">${icon('check', 'w-6 h-6')}</div>
          <p class="text-lg font-semibold text-ink mt-4">${t(lang, 'bookingSuccessTitle')}</p>
          <p class="text-sm text-slate mt-2">${t(lang, 'bookingSuccessDesc', { name: '<span data-success-name></span>', email: '<span data-success-email></span>' })}</p>
        </div>
        ${nextStepsHTML(lang)}
      </div>
    </div>
  </div>`;
}

function portalModalHTML(lang) {
  return `
  <div id="portal-modal" role="dialog" aria-modal="true" aria-labelledby="portal-modal-title" style="display:none" data-modal-backdrop class="modal-backdrop">
    <div class="modal-panel">
      <button data-close-modal aria-label="Close dialog" class="modal-close">${icon('close', 'w-6 h-6')}</button>
      <h2 id="portal-modal-title" class="text-[1.375rem] font-semibold text-ink pr-8">${t(lang, 'portalTitle')}</h2>
      <form data-portal-form class="space-y-5">
        <p class="text-sm text-slate">${t(lang, 'portalIntro')}</p>
        <div>
          <label for="portal-email" class="field-label">${t(lang, 'portalEmailLabel')}</label>
          <input id="portal-email" name="email" type="email" required class="field" />
        </div>
        <div>
          <label for="portal-password" class="field-label">${t(lang, 'portalPassLabel')}</label>
          <input id="portal-password" name="password" type="password" required class="field" />
        </div>
        <button type="submit" class="btn btn-dark w-full">${t(lang, 'portalLogin')}</button>
        <p class="text-xs text-slate text-center">${t(lang, 'portalAccessHelp')} <a href="mailto:${CONTACT_EMAIL}" class="text-brand hover:underline">${CONTACT_EMAIL}</a></p>
      </form>
      <p data-error-slot role="alert" hidden class="text-sm text-red-600 mb-4"></p><div data-portal-success role="status" hidden class="text-center py-6">
        <div class="text-4xl mb-4">✅</div>
        <p class="text-lg font-semibold text-ink">${t(lang, 'portalMock')}</p>
        <p class="text-sm text-slate mt-2">${t(lang, 'portalLoggedInDesc')}</p>
      </div>
    </div>
  </div>`;
}

function whatsappButtonHTML(lang) {
  return `
  <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" class="fab-whatsapp no-print" aria-label="${t(lang, 'footerWhatsapp')}">
    ${icon('whatsapp', 'w-6 h-6')}<span class="fab-label" aria-hidden="true">${t(lang, 'footerWhatsapp')}</span>
  </a>
  <button type="button" data-to-top hidden class="to-top no-print" aria-label="${t(lang, 'backToTop')}">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
  </button>`;
}

function breadcrumbsHTML(lang, items) {
  const sep = `<span aria-hidden="true" class="text-line-strong">${icon('chevronRight', 'w-3.5 h-3.5')}</span>`;
  const parts = [`<a href="index.html" class="hover:text-brand transition-colors">${t(lang, 'breadcrumbHome')}</a>`];
  items.forEach((item) => {
    parts.push(sep);
    if (item.href) parts.push(`<a href="${item.href}" class="hover:text-brand transition-colors">${item.label}</a>`);
    else parts.push(`<span class="text-ink font-medium" aria-current="page">${item.label}</span>`);
  });
  return `<nav aria-label="Breadcrumb" class="${SHELL} pt-5 text-[0.8125rem] text-slate"><ol class="flex flex-wrap items-center gap-2">${parts
    .map((p) => `<li class="flex items-center gap-2">${p}</li>`)
    .join('')}</ol></nav>`;
}

// BreadcrumbList markup so Google renders the trail under the result instead
// of a bare URL. Built from the same items rendered above.
function breadcrumbJsonLd(lang, page, items) {
  const list = [{ name: t(lang, 'breadcrumbHome'), url: `${SITE_URL}/${lang}/index.html` }];
  items.forEach((item, i) => {
    list.push({ name: item.label, url: `${SITE_URL}/${lang}/${item.href || page}` });
    void i;
  });
  return {
    '@type': 'BreadcrumbList',
    itemListElement: list.map((entry, i) => ({ '@type': 'ListItem', position: i + 1, name: entry.name, item: entry.url })),
  };
}

function seoHead({ lang, title, description, page, jsonLd, robots }) {
  const canonical = `${SITE_URL}/${lang}/${page}`;
  const alternates = SUPPORTED_LANGUAGES.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}/${page}" />`).join('\n    ');
  const fullTitle = `${title} | ENZ INTERNATIONAL`;
  return `<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0B1A24" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
    <meta name="color-scheme" content="light" />
    <title>${fullTitle}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="${robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}" />
    <meta name="author" content="ENZ INTERNATIONAL" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/png" sizes="512x512" href="../assets/images/favicon-512.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="../assets/images/apple-touch-icon.png" />
    <link rel="manifest" href="../site.webmanifest" />
    ${alternates}
    <link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/${page}" />

    <!-- The stylesheet is a single plain file, committed to the repo. It is
         compiled from _build/tailwind.src.css only when markup changes; the
         site itself still needs no build step to deploy. (The Tailwind Play
         CDN that used to sit here is explicitly not for production: it ships a
         compiler to every visitor and repaints the page after first paint.) -->
    <link rel="stylesheet" href="../assets/css/site.css?v=${ASSET_VERSION}" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preload" as="style" href="${FONT_HREF}" />
    <link rel="stylesheet" href="${FONT_HREF}" media="print" onload="this.media='all'" />
    <noscript><link rel="stylesheet" href="${FONT_HREF}" /></noscript>

    <meta property="og:type" content="${page.startsWith('insight-') ? 'article' : 'website'}" />
    <meta property="og:site_name" content="ENZ INTERNATIONAL" />
    <meta property="og:title" content="${fullTitle}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE_URL}/assets/images/og-cover.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="ENZ INTERNATIONAL — global sourcing and industrial excellence" />
    <meta property="og:locale" content="${LOCALE_MAP[lang]}" />
    ${SUPPORTED_LANGUAGES.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${LOCALE_MAP[l]}" />`).join('\n    ')}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${fullTitle}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${SITE_URL}/assets/images/og-cover.png" />
    ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}`;
}

function pageShell({ lang, page, title, description, jsonLd, crumbs, bodyHTML, robots }) {
  // Merge whatever structured data the page supplies with the sitewide
  // Organization/WebSite entities and the breadcrumb trail, so every page ships
  // one @graph rather than three competing scripts.
  const graph = [];
  if (jsonLd) graph.push(...(jsonLd['@graph'] || [jsonLd]));
  graph.push({
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'ENZ INTERNATIONAL',
    url: `${SITE_URL}/${lang}/index.html`,
    logo: `${SITE_URL}/assets/images/enz-logo.png`,
    email: CONTACT_EMAIL,
    telephone: '+86-132-0384-0456',
    areaServed: regions.map((r) => r.name),
  });
  graph.push({
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/${lang}/`,
    name: 'ENZ INTERNATIONAL',
    inLanguage: lang,
    publisher: { '@id': `${SITE_URL}/#organization` },
  });
  if (crumbs) graph.push(breadcrumbJsonLd(lang, page, crumbs));
  const merged = { '@context': 'https://schema.org', '@graph': graph };

  return `<!DOCTYPE html>
<html lang="${lang}">
  <head>
    ${seoHead({ lang, title, description, page, jsonLd: merged, robots })}
  </head>
  <body class="bg-white text-ink">
    <a href="#main-content" class="skip-link">${t(lang, 'skipToContent')}</a>
    ${headerHTML(lang, page)}
    ${crumbs ? breadcrumbsHTML(lang, crumbs) : ''}
    <main id="main-content">
      ${bodyHTML}
    </main>
    ${footerHTML(lang)}
    ${whatsappButtonHTML(lang)}
    ${bookingModalHTML(lang)}
    ${portalModalHTML(lang)}
    <script src="../assets/js/config.js?v=${ASSET_VERSION}"></script>
    <script src="../assets/js/i18n.js?v=${ASSET_VERSION}"></script>
    <script src="../assets/js/api.js?v=${ASSET_VERSION}"></script>
    <script src="../assets/js/site.js?v=${ASSET_VERSION}" defer></script>
    <script type="module" src="../assets/js/motion-effects.js?v=${ASSET_VERSION}"></script>
  </body>
</html>`;
}

// ============================================================================
// Page content builders
// ============================================================================

// ============================================================================
// Homepage
// ============================================================================
// The page answers one question in order: what goes wrong → what we do about
// it → what that costs → how to start. It used to carry eight reference
// sections as well (Incoterms, landed cost, payment terms, timelines, common
// mistakes, why-China, glossary); those are now on the pages built for them,
// linked from here. They were good content in the wrong place — a buyer looks
// them up after deciding to talk to you, not while deciding whether to.
function homePage(lang) {
  const stats = [
    ['statYears', 10, '+'],
    ['statMarkets', 50, '+'],
    ['statProjects', 200, '+'],
    ['statSatisfaction', 98, '%'],
  ];
  const nextSteps = [t(lang, 'bookingNext1'), t(lang, 'bookingNext2'), t(lang, 'bookingNext3')];

  // The three service lines, stated plainly. This replaced a two-tab widget:
  // tabs hid half the offering behind a click, on the one section a first-time
  // visitor most needs to read in full.
  const coreServices = [
    { icon: 'globe', title: t(lang, 'service1'), body: t(lang, 'service1Desc'), href: 'services.html#sourcing',
      points: ['Verified-supplier shortlisting', 'Price benchmarking and negotiation', 'Freight and customs documentation'] },
    { icon: 'check', title: t(lang, 'qcTitle'), body: t(lang, 'qcLead'), href: 'quality-control.html',
      points: ['Incoming materials check', 'During-production inspection', 'Pre-shipment and loading checks'] },
    { icon: 'calendar', title: t(lang, 'service2'), body: t(lang, 'service2Desc'), href: 'services.html#factory-setup',
      points: ['Site selection and feasibility', 'Machinery sourcing', 'Commissioning support'] },
  ];

  const body = `
  <section class="section-dark hero">
    ${glows('a')}
    <div class="${SHELL} grid lg:grid-cols-12 gap-14 lg:gap-12 items-center">

      <div class="lg:col-span-6">
        <a href="markets.html" class="pill pill-dark hover:border-brand-bright/50 transition-colors">
          <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulseDot"></span>
          ${hubs.slice(0, 3).join(' · ')} +${hubs.length - 3}
        </a>

        <!-- Two short sentences, the second in the brand gradient. The old
             headline was "Global Sourcing & Industrial Excellence", which told
             a first-time visitor nothing about what actually gets done. -->
        <h1 class="h1-display text-white mt-7">
          <span class="line">${t(lang, 'heroTitleA')}</span>
          <span class="line text-gradient">${t(lang, 'heroTitleB')}</span>
        </h1>

        <p class="lead-light mt-7 max-w-xl">${t(lang, 'heroSub')}</p>

        <!-- The three service lines, legible without scrolling. -->
        <div class="chip-row mt-8">
          <span class="chip">${icon('globe', 'w-4 h-4')}${t(lang, 'heroBadge1')}</span>
          <span class="chip">${icon('check', 'w-4 h-4')}${t(lang, 'heroBadge2')}</span>
          <span class="chip">${icon('calendar', 'w-4 h-4')}${t(lang, 'heroBadge3')}</span>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 mt-9">
          <button data-open-booking class="${BTN_PRIMARY} btn-lg">${t(lang, 'ctaBooking')}${icon('chevronRight', 'w-4 h-4 btn-arrow')}</button>
          <a href="#how-it-works" class="${BTN_GHOST_LIGHT} btn-lg">${t(lang, 'navProcess')}</a>
        </div>

        <p class="text-sm text-white/60 mt-7">${t(lang, 'bookingDisclaimer')}</p>
      </div>

      <!-- An ILLUSTRATION of the four-stage inspection process documented on
           quality-control.html — not a screenshot of a product, because there
           is no product to screenshot. The stage codes and timings are the
           real ones from _content/pages.js. -->
      <div class="lg:col-span-6">
        <div class="gradient-border shadow-2xl">
          <div class="bg-navy-deep/95 p-6 md:p-7">
            <div class="flex items-center justify-between gap-4 pb-5 border-b border-white/10">
              <div>
                <p class="text-white font-medium">${t(lang, 'qcTitle')}</p>
                <p class="text-xs text-white/60 mt-1">${t(lang, 'qcEyebrow')}</p>
              </div>
              <span class="pill pill-dark mono-tag">${qcStages.length} ${t(lang, 'qcStagesLabel')}</span>
            </div>

            <div class="mt-5">
              ${qcStages
                .map((st, i) => {
                  const state = i < 2 ? 'done' : i === 2 ? 'active' : 'idle';
                  const mark =
                    state === 'done'
                      ? icon('check', 'w-3.5 h-3.5')
                      : state === 'active'
                        ? '<span class="status-pulse w-2 h-2 rounded-full bg-current"></span>'
                        : '<span class="w-2 h-2 rounded-full border border-current"></span>';
                  return `<div class="status-row">
                <span class="status-dot status-${state}">${mark}</span>
                <span class="min-w-0 flex-1">
                  <span class="flex flex-wrap items-baseline gap-x-2.5">
                    <span class="mono-tag text-brand-bright">${st.code}</span>
                    <span class="text-sm font-medium text-white">${st.title}</span>
                  </span>
                  <span class="status-when block text-xs text-white/60 mt-1">${st.when}</span>
                </span>
              </div>`;
                })
                .join('')}
            </div>

            <p class="text-xs text-white/60 leading-relaxed mt-5 pt-5 border-t border-white/10">${t(lang, 'qcLead')}</p>
            <a href="quality-control.html" class="link-arrow link-arrow-light text-sm mt-4">${t(lang, 'ctaLearnMore')} ${icon('chevronRight', 'w-4 h-4')}</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stat strip, lifted over the seam between the dark hero and the page. -->
  <section class="bg-white">
    <div class="${SHELL}">
      <div class="-mt-16 md:-mt-20 relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-px bg-line rounded-2xl border border-line shadow-lift overflow-hidden">
        ${stats
          .map(
            ([key, value, suffix]) => `<div class="bg-white p-6 md:p-8 text-center">
          <div class="stat-value text-ink"><span data-counter="${value}" data-counter-suffix="${suffix}">${value}${suffix}</span></div>
          <div class="text-sm text-slate mt-2.5">${t(lang, key)}</div>
        </div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- 1. THE PROBLEM. A visitor who doesn't recognise their own situation in
       the first screen has no reason to read the second. -->
  <section class="section section-wash hairline-top">
    <div class="${SHELL}">
      ${sectionHead(t(lang, 'problemEyebrow'), t(lang, 'problemTitle'), t(lang, 'problemLead'))}
      <div data-reveal-group class="grid sm:grid-cols-2 gap-4 mt-14 max-w-5xl mx-auto">
        ${problems
          .map(
            (pr) => `<div class="${CARD}">
          <span class="icon-chip icon-chip-accent">${icon(pr.icon, 'w-5 h-5')}</span>
          <h3 class="text-[1.0625rem] font-medium text-ink mt-4">${pr.title}</h3>
          <p class="text-slate text-sm mt-2 leading-relaxed">${pr.body}</p>
        </div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- 2. WHAT WE DO. Three lines, all visible at once. -->
  <section class="section bg-gray-bg border-y border-line">
    <div class="${SHELL}">
      ${sectionHead(t(lang, 'navServices'), t(lang, 'servicesTitle'), t(lang, 'servicesSubtitle'), { align: 'start' })}
      <!-- Bento rather than a fourth identical three-up grid: the first
           service gets a tall feature tile, the other two stack beside it. The
           asymmetry is what stops the page reading as a list of equivalent
           tiles, which is exactly how it read before. -->
      <div data-reveal-group class="bento mt-14">
        ${coreServices
          .map((sv, i) => {
            const feature = i === 0;
            return `<a href="${sv.href}" class="${CARD} card-lg flex flex-col group ${feature ? 'bento-feature' : ''}">
          <span class="icon-chip">${icon(sv.icon, feature ? 'w-6 h-6' : 'w-5 h-5')}</span>
          <h3 class="${feature ? 'text-2xl' : 'text-lg'} font-medium text-ink mt-5">${sv.title}</h3>
          <p class="text-slate ${feature ? 'text-[0.9375rem]' : 'text-sm'} mt-3 leading-relaxed">${sv.body}</p>
          <ul class="mt-6 space-y-2.5 flex-1">
            ${sv.points.map((pt) => `<li class="check-item text-[0.8125rem]">${icon('check', 'w-3.5 h-3.5')}<span>${pt}</span></li>`).join('')}
          </ul>
          <span class="link-arrow text-sm mt-6">${t(lang, 'ctaLearnMore')} ${icon('chevronRight', 'w-4 h-4')}</span>
        </a>`;
          })
          .join('')}
      </div>
      <div class="text-center mt-10"><a href="services.html" class="${BTN_SECONDARY}">${t(lang, 'ctaViewAll')} ${icon('chevronRight', 'w-4 h-4 btn-arrow')}</a></div>
    </div>
  </section>

  <!-- 3. HOW IT WORKS. Anchor target for the hero's secondary CTA. -->
  <section id="how-it-works" class="section bg-white">
    <div class="${SHELL}">
      ${sectionHead(t(lang, 'navProcess'), t(lang, 'processTitle'), t(lang, 'processLead'), { align: 'start' })}
      <ol data-reveal-group class="rail grid gap-4 md:grid-cols-2 lg:grid-cols-5 mt-14">
        ${processSteps
          .map(
            (st) => `<li class="${CARD} bg-white">
          <div class="flex items-center justify-between gap-2">
            <span class="step-badge">${st.n}</span>
            <span class="pill pill-neutral mono-tag">${st.duration}</span>
          </div>
          <h3 class="font-medium text-ink mt-4">${st.title}</h3>
          <p class="text-slate text-sm mt-2 leading-relaxed">${st.summary}</p>
        </li>`
          )
          .join('')}
      </ol>
      <div class="text-center mt-10"><a href="process.html" class="${BTN_SECONDARY}">${t(lang, 'ctaLearnMore')} ${icon('chevronRight', 'w-4 h-4 btn-arrow')}</a></div>
    </div>
  </section>

  <!-- 4. THE HONEST COMPARISON. Naming when you are NOT the right answer is
       the single most persuasive thing a services page can do. -->
  <section class="section bg-gray-bg border-y border-line">
    <div class="${SHELL} max-w-5xl">
      ${sectionHead(t(lang, 'compareEyebrow'), comparison.title, comparison.subtitle, { align: 'start' })}
      <div class="table-wrap mt-12">
        <table class="table-pro">
          <thead>
            <tr>
              <th scope="col" class="w-1/4">${t(lang, 'compareFactor')}</th>
              <th scope="col">${t(lang, 'compareDiy')}</th>
              <th scope="col" class="text-brand">${t(lang, 'compareEnz')}</th>
            </tr>
          </thead>
          <tbody>
            ${comparison.rows
              .map(
                (r) =>
                  `<tr><th scope="row">${r.factor}</th><td>${r.diy}</td><td class="text-ink">${r.enz}</td></tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- 5. COMMITMENTS. Stands in for testimonials until there are real ones:
       every line is a promise that can be checked, not a claim about quality. -->
  <section class="section section-dark">
    ${glows('b')}
    <div class="${SHELL}">
      ${sectionHead(t(lang, 'commitEyebrow'), t(lang, 'commitTitle'), t(lang, 'commitLead'), { dark: true })}
      <div data-reveal-group class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
        ${commitments
          .map(
            (c) => `<div class="${CARD_DARK}">
          <span class="icon-chip icon-chip-dark">${icon(c.icon, 'w-5 h-5')}</span>
          <h3 class="font-medium text-[1.0625rem] mt-4">${c.title}</h3>
          <p class="text-white/60 text-sm mt-2 leading-relaxed">${c.body}</p>
        </div>`
          )
          .join('')}
      </div>
      <div class="text-center mt-10"><a href="about.html" class="${BTN_GHOST_LIGHT}">${t(lang, 'ctaLearnMore')} ${icon('chevronRight', 'w-4 h-4 btn-arrow')}</a></div>
    </div>
  </section>

  ${proofSection(lang)}

  <!-- 6. ENGAGEMENT. The question every serious buyer asks second. -->
  <section class="section bg-white">
    <div class="${SHELL}">
      ${sectionHead(t(lang, 'engageEyebrow'), t(lang, 'engageTitle'), t(lang, 'engageLead'), { align: 'start' })}
      <div data-reveal-group class="grid lg:grid-cols-3 gap-5 mt-14 items-start">
        ${engagementModels.map((m) => engagementCard(lang, m)).join('')}
      </div>
      <div class="text-center mt-10">
        <a href="pricing.html" class="${BTN_SECONDARY}">${t(lang, 'ctaSeeEngagement')} ${icon('chevronRight', 'w-4 h-4 btn-arrow')}</a>
      </div>
    </div>
  </section>

  <!-- 7. WHO AND WHERE. Industries and markets were two near-identical card
       grids in sequence; one section answers both questions. -->
  <section class="section bg-gray-bg border-y border-line">
    <div class="${SHELL}">
      ${sectionHead(t(lang, 'whoEyebrow'), t(lang, 'whoTitle'), t(lang, 'whoLead'), { align: 'start' })}
      <div data-reveal-group class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
        ${industries
          .map(
            (ind) => `<a href="industries.html" class="${CARD} block group">
          <span class="icon-chip">${icon(ind.icon, 'w-5 h-5')}</span>
          <h3 class="text-[1.0625rem] font-medium text-ink mt-4">${ind.name}</h3>
          <p class="text-slate text-sm mt-2 leading-relaxed">${ind.body}</p>
        </a>`
          )
          .join('')}
      </div>

      <div class="mt-10 rounded-2xl border border-line bg-white p-6 md:p-8">
        <div class="flex flex-wrap items-baseline justify-between gap-4">
          <h3 class="text-lg font-medium text-ink">${t(lang, 'footprintTitle')}</h3>
          <a href="markets.html" class="link-arrow text-sm">${t(lang, 'ctaLearnMore')} ${icon('chevronRight', 'w-4 h-4')}</a>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
          ${regions
            .map(
              (r) => `<a href="markets.html" class="flex items-center gap-2.5 rounded-lg border border-line bg-gray-bg px-3.5 py-3 hover:border-brand-200 hover:bg-white transition-colors">
            <span class="step-badge">${r.code}</span><span class="text-sm font-medium text-ink">${r.name}</span>
          </a>`
            )
            .join('')}
        </div>
        <p class="text-sm text-slate mt-5">${t(lang, 'footprintHubsLabel')}: ${hubs.join(' · ')}</p>
      </div>
    </div>
  </section>

  <!-- 8. GETTING STARTED. The last objection is procedural, not commercial. -->
  <section class="section bg-white">
    <div class="${SHELL} max-w-4xl">
      ${sectionHead(t(lang, 'startEyebrow'), t(lang, 'startTitle'), t(lang, 'startLead'))}
      <ol data-reveal-group class="mt-14 space-y-4">
        ${gettingStarted
          .map(
            (st) => `<li class="${CARD} flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          <span class="step-badge step-badge-lg">${st.n}</span>
          <div class="flex-1">
            <div class="flex flex-wrap items-baseline gap-3">
              <h3 class="text-lg font-medium text-ink">${st.title}</h3>
              <span class="pill pill-neutral mono-tag">${st.meta}</span>
            </div>
            <p class="text-slate text-sm mt-2 leading-relaxed">${st.body}</p>
          </div>
        </li>`
          )
          .join('')}
      </ol>
      <div class="text-center mt-10">
        <button data-open-booking class="${BTN_PRIMARY} btn-lg">${t(lang, 'ctaBooking')}${icon('chevronRight', 'w-4 h-4 btn-arrow')}</button>
      </div>
    </div>
  </section>

  <!-- 9. Recent writing. This band used to carry four "read about landed
       cost / timelines / Incoterms / mistakes" link cards on top of these
       three posts — seven cards, 2.8 phone screens, and every one of those
       four destinations is already in the nav and the footer. A homepage
       should not contain a directory of itself, so the link cards went and
       the actual writing stayed. The guide is one line away, below. -->
  <section class="section bg-gray-bg border-y border-line">
    <div class="${SHELL}">
      ${sectionHead(t(lang, 'navInsights'), t(lang, 'insightsTitle'), null, { align: 'start' })}
      <div data-reveal-group class="grid md:grid-cols-3 gap-4 mt-12">
        ${insights
          .map(
            (pst) =>
              `<a href="insight-${pst.slug}.html" class="${CARD} block group flex flex-col"><span class="pill self-start">${pst.category}</span><h3 class="text-[1.0625rem] font-medium text-ink mt-4">${pst.title}</h3><p class="text-slate text-sm mt-2 leading-relaxed flex-1">${pst.excerpt}</p><span class="link-arrow text-sm mt-4">${t(lang, 'ctaReadMore')} ${icon('chevronRight', 'w-4 h-4')}</span></a>`
          )
          .join('')}
      </div>
      <p class="text-sm text-slate mt-8">
        ${t(lang, 'resourcesGuideLead')} <a href="resources.html" class="link-arrow">${t(lang, 'ctaSeeGuide')} ${icon('chevronRight', 'w-4 h-4')}</a>
      </p>
    </div>
  </section>

  <!-- 10. FAQ. -->
  <section class="section bg-white">
    <div class="${SHELL}">
      ${sectionHead('FAQ', t(lang, 'faqHomeTitle'), t(lang, 'faqHomeSubtitle'))}
      <div class="max-w-3xl mx-auto mt-12 border-t border-line">
        ${faqs
          .map(
            (f, idx) => `
        <div class="faq-item">
          <h3><button class="faq-question" aria-expanded="false" aria-controls="home-faq-${idx}" id="home-faq-btn-${idx}"><span>${f.question}</span>${icon('chevronDown', 'w-5 h-5 faq-chevron')}</button></h3>
          <div id="home-faq-${idx}" role="region" aria-labelledby="home-faq-btn-${idx}" hidden class="faq-answer">${f.answer}</div>
        </div>`
          )
          .join('')}
      </div>
      <div class="text-center mt-10"><a href="faq.html" class="${BTN_SECONDARY}">${t(lang, 'faqSeeAll')} ${icon('chevronRight', 'w-4 h-4 btn-arrow')}</a></div>
    </div>
  </section>

  ${closingCta(lang)}`;

  // @graph so one script can carry several entity types. FAQPage makes the
  // homepage eligible for expandable FAQ rich results in search — built from
  // the same real answers rendered above, never a schema-only copy (Google
  // treats visible/markup mismatch as a violation).
  const jsonLd = {
    '@graph': [
      {
        '@type': 'LocalBusiness',
        name: 'ENZ INTERNATIONAL',
        url: `${SITE_URL}/${lang}/index.html`,
        image: `${SITE_URL}/assets/images/og-cover.png`,
        telephone: '+86-1320-384-0456',
        email: CONTACT_EMAIL,
        address: { '@type': 'PostalAddress', addressLocality: 'Guangzhou', addressCountry: 'CN' },
        areaServed: regions.map((r) => r.name),
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
    ],
  };

  return pageShell({ lang, page: 'index.html', title: t(lang, 'homeSeoTitle'), description: t(lang, 'heroSub'), jsonLd, bodyHTML: body });
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
  <section class="section section-dark">
    ${glows('b')}
    <div class="shell max-w-4xl relative">
      <h1 class="h1-display">${t(lang, 'aboutTitle')}</h1>
      <p class="text-white/75 text-lg mt-7 leading-relaxed font-light">${t(lang, 'aboutDesc')}</p>
      <p class="text-white/65 text-lg mt-4 leading-relaxed font-light">We work as an extension of your team on the ground in China and East Africa — vetting suppliers, managing quality control, and coordinating the logistics that turn a purchase order or a factory blueprint into a delivered, working result. One point of contact owns your project from first call to final delivery, so nothing gets lost between departments or vendors.</p>
    </div>
  </section>

  <section class="section bg-white">
    <div class="shell">
      <div class="text-center max-w-2xl mx-auto"><h2 class="h2-section">What We Handle End-to-End</h2><p class="lead mt-4">Six capabilities that cover the full path from a first product brief to a shipped, working result.</p></div>
      <div data-reveal-group class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 max-w-6xl mx-auto">
        ${capabilities.map(([ttl, desc, ic]) => `<div class="${CARD_MUTED}">${icon(ic, 'w-8 h-8 text-brand mb-4')}<h3 class="font-semibold text-ink">${ttl}</h3><p class="text-slate text-sm mt-2.5 leading-relaxed">${desc}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section bg-gray-bg">
    <div class="shell">
      <h2 class="h2-section text-center">Our Methodology</h2>
      <div data-reveal-group class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-14 max-w-5xl mx-auto">
        ${methodology.map(([n, ttl, desc, ic]) => `<div class="${CARD} relative">${icon(ic, 'w-6 h-6 text-brand mb-3')}<span class="absolute top-6 right-6 text-line font-semibold text-4xl tabular" aria-hidden="true">${n}</span><h3 class="text-lg font-semibold text-ink mt-4">${ttl}</h3><p class="text-slate text-sm mt-2.5 leading-relaxed">${desc}</p></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section bg-white">
    <div class="shell">
      <div class="text-center max-w-2xl mx-auto"><h2 class="h2-section">What Working With Us Looks Like</h2><p class="lead mt-4">From the first call to ongoing delivery — what to expect at each stage.</p></div>
      <ol class="mt-16 max-w-3xl mx-auto space-y-10 relative">
        ${engagementSteps
          .map(
            ([ttl, desc], idx) =>
              `<li class="relative pl-16"><span class="step-badge step-badge-lg absolute left-0 top-0">${idx + 1}</span><h3 class="font-semibold text-ink text-lg">${ttl}</h3><p class="text-slate text-sm mt-1.5 leading-relaxed">${desc}</p></li>`
          )
          .join('')}
      </ol>
      <div class="text-center mt-14"><a href="markets.html" class="btn btn-secondary">See where we operate ${icon('chevronRight', 'w-4 h-4')}</a></div>
    </div>
  </section>

  <!-- Moved off the homepage, where three of these six sat beside the
       commitments band making the same argument twice. Here the full set has
       room, and it is the page a visitor opens when they are specifically
       asking "why you?". -->
  <section class="section bg-white hairline-top">
    <div class="${SHELL}">
      ${sectionHead(t(lang, 'whyEyebrow'), t(lang, 'whyTitle'), t(lang, 'whySubtitle'), { align: 'start' })}
      <div data-reveal-group class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
        ${[
          ['why1Title', 'why1Desc', 'shield'],
          ['why2Title', 'why2Desc', 'briefcase'],
          ['why3Title', 'why3Desc', 'mapPin'],
          ['why4Title', 'why4Desc', 'mail'],
          ['why5Title', 'why5Desc', 'award'],
          ['why6Title', 'why6Desc', 'check'],
        ]
          .map(
            ([tk, dk, ic]) =>
              `<div class="${CARD}"><span class="icon-chip">${icon(ic, 'w-5 h-5')}</span><h3 class="text-[1.0625rem] font-medium text-ink mt-4">${t(lang, tk)}</h3><p class="text-slate text-sm mt-2 leading-relaxed">${t(lang, dk)}</p></div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <!-- Moved here from the homepage. "Should I be buying from China at all?"
       is a question about who we are and how we advise — it belongs on the
       page about us, not in the middle of a first-time visitor's scroll. -->
  <section class="section section-dark">
    ${glows('a')}
    <div class="${SHELL} max-w-4xl">
      ${sectionHead(t(lang, 'whyChinaEyebrow'), whyChina.title, whyChina.lead, { dark: true })}
      <div data-reveal-group class="grid gap-4 md:grid-cols-2 mt-14">
        <div class="${CARD_DARK} card-lg">
          <h3 class="font-medium text-white">${t(lang, 'whyChinaPros')}</h3>
          <ul class="mt-5 space-y-3">
            ${whyChina.pros.map((x) => `<li class="check-item">${icon('check', 'w-4 h-4')}<span>${x}</span></li>`).join('')}
          </ul>
        </div>
        <div class="${CARD_DARK} card-lg">
          <h3 class="font-medium text-white">${t(lang, 'whyChinaCons')}</h3>
          <ul class="mt-5 space-y-3">
            ${whyChina.cons.map((x) => `<li class="check-item">${icon('chevronRight', 'w-4 h-4 text-accent')}<span>${x}</span></li>`).join('')}
          </ul>
        </div>
      </div>
      <p class="note-accent mt-10">${whyChina.note}</p>
    </div>
  </section>

  <section class="section bg-gray-bg border-t border-line">
    <div class="${SHELL} max-w-3xl text-center">
      <h2 class="h2-section">Speak to someone directly</h2>
      <p class="${LEAD} mt-5">Individual team profiles are still being written. In the meantime, an enquiry reaches a named person — not a shared inbox — and they stay with your project from the first call onward.</p>
      <div class="flex flex-col sm:flex-row justify-center gap-3 mt-9">
        <button data-open-booking class="${BTN_PRIMARY}">${t(lang, 'ctaBooking')}${icon('chevronRight', 'w-4 h-4 btn-arrow')}</button>
        <a href="contact.html" class="${BTN_SECONDARY}">${t(lang, 'navContact')}</a>
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

  const jumpNav = services.map((s) => `<a href="#${s.slug}" class="btn btn-secondary btn-sm">${t(lang, s.titleKey)}</a>`).join('');

  const sections = services
    .map(
      (service, idx) => `
    <section id="${service.slug}" class="section scroll-mt-24 ${idx % 2 === 0 ? 'bg-gray-bg' : 'bg-white'}">
      <div class="shell grid grid-cols-1 lg:grid-cols-2 gap-14 items-start max-w-5xl">
        <div>
          ${icon(service.icon, 'w-10 h-10 text-brand mb-5')}
          <h2 class="h2-section">${t(lang, service.titleKey)}</h2>
          <p class="text-brand font-medium mt-2">${service.tagline}</p>
          <p class="text-slate mt-5 leading-relaxed">${t(lang, service.descKey)}</p>
          <ul class="mt-7 space-y-3.5">${service.features.map((f) => `<li class="flex items-start gap-2.5 text-sm text-slate"><span class="mt-0.5">${icon('check', 'w-4 h-4')}</span><span>${f}</span></li>`).join('')}</ul>
          <button data-open-booking class="mt-9 ${BTN_PRIMARY} px-7 py-3.5 inline-flex items-center gap-2">${icon('calendar', 'w-4 h-4')} ${t(lang, 'ctaBooking')}</button>
        </div>
        <ol class="card card-lg space-y-6">
          ${service.process.map((p, i) => `<li class="flex gap-4"><span class="step-badge step-badge-lg">${i + 1}</span><div><p class="font-semibold text-ink">${p.step}</p><p class="text-sm text-slate mt-0.5">${p.desc}</p></div></li>`).join('')}
        </ol>
      </div>
    </section>`
    )
    .join('');

  const body = `
  <section class="section bg-white">
    <div class="shell max-w-3xl text-center">
      <h1 class="h1-display text-ink">${t(lang, 'servicesTitle')}</h1>
      <p class="lead mt-6">${t(lang, 'servicesSubtitle')}</p>
      <nav aria-label="Jump to service" class="flex flex-wrap justify-center gap-3 mt-10">${jumpNav}</nav>
    </div>
  </section>
  ${sections}
  <section class="section section-dark">
    <div class="shell">
      <div class="text-center max-w-2xl mx-auto"><h2 class="h2-section on-dark">How We Can Work Together</h2><p class="lead-light mt-4">Three engagement models, scoped to how much of the process you want us to own.</p></div>
      <div data-reveal-group class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 max-w-5xl mx-auto">
        ${engagementModels
          .map(
            ([ttl, desc, fits, ic]) =>
              `<div class="${CARD_DARK}">${icon(ic, 'w-8 h-8 text-brand mb-4')}<h3 class="font-semibold text-white">${ttl}</h3><p class="text-white/55 text-sm mt-2.5 leading-relaxed">${desc}</p><p class="text-brand text-xs mt-5 font-semibold uppercase tracking-wider">Best for</p><p class="text-white/70 text-sm mt-1.5">${fits}</p></div>`
          )
          .join('')}
      </div>
      <div class="text-center mt-14">
        <button data-open-booking class="${BTN_PRIMARY} px-9 py-4 inline-flex items-center gap-2">${icon('calendar', 'w-5 h-5')} ${t(lang, 'ctaBooking')}</button>
        <p class="text-white/60 text-sm mt-5">Have questions first? <a href="contact.html" class="text-brand hover:underline underline-offset-4">See our FAQ</a></p>
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
    .map((m) => `<a href="#market-${m.slug}" class="${CARD_MUTED} flex items-start gap-4"><span class="step-badge step-badge-lg">${m.region}</span><div><h2 class="font-semibold text-ink">${m.name}</h2><p class="text-sm text-slate mt-1">${m.heroLine}</p></div>${icon('chevronRight', 'w-5 h-5 text-slate-light ml-auto shrink-0 self-center')}</a>`)
    .join('');

  const detailSections = markets
    .map(
      (m, idx) => `
    <section id="market-${m.slug}" class="section scroll-mt-24 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-bg'}">
      <div class="shell max-w-3xl text-center">
        <span class="pill">${m.region} · ${m.fullName || m.name}</span>
        <h2 class="h2-section mt-5">${m.heroLine}</h2>
        <p class="text-slate mt-5 leading-relaxed">${m.intro}</p>
        <button data-open-booking class="mt-7 ${BTN_PRIMARY} px-7 py-3.5 inline-flex items-center gap-2">${icon('calendar', 'w-4 h-4')} ${t(lang, 'ctaBooking')}</button>
      </div>
    </section>`
    )
    .join('');

  const body = `
  <section class="section bg-white">
    <div class="shell max-w-3xl text-center">
      <h1 class="h1-display text-ink">${t(lang, 'marketsTitle')}</h1>
      <p class="lead mt-6">${t(lang, 'marketsSubtitle')}</p>
    </div>
  </section>
  <section class="section pt-0 bg-white">
    <div class="shell grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">${cards}</div>
  </section>
  ${detailSections}`;

  return pageShell({ lang, page: 'markets.html', title: t(lang, 'marketsTitle'), description: t(lang, 'marketsSubtitle'), crumbs: [{ label: t(lang, 'navMarkets') }], bodyHTML: body });
}

function insightsListPage(lang) {
  const cards = insights
    .map(
      (p) => `
    <article class="${CARD_MUTED} flex flex-col">
      <div class="mb-3 flex items-center justify-between">${icon(p.icon, 'w-8 h-8 text-brand')}<span class="pill">${p.category}</span></div>
      <h2 class="text-lg font-semibold text-ink">${p.title}</h2>
      <p class="text-slate text-sm mt-2.5 flex-1 leading-relaxed">${p.excerpt}</p>
      <div class="text-xs text-slate mt-5 flex items-center gap-2"><time datetime="${p.publishedDate}">${p.publishedDate}</time><span aria-hidden="true">·</span><span>${p.readTime} ${t(lang, 'insightsReadTime')}</span></div>
      <a href="insight-${p.slug}.html" class="text-brand text-sm font-medium mt-4 inline-block hover:underline underline-offset-4">${t(lang, 'ctaReadMore')} →</a>
    </article>`
    )
    .join('');

  const body = `
  <section class="section bg-white">
    <div class="shell max-w-3xl text-center">
      <h1 class="h1-display text-ink">${t(lang, 'insightsTitle')}</h1>
      <p class="lead mt-6">${t(lang, 'insightsSubtitle')}</p>
    </div>
  </section>
  <section class="section pt-0 bg-white">
    <div class="shell grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl">${cards}</div>
  </section>`;

  return pageShell({ lang, page: 'insights.html', title: t(lang, 'insightsTitle'), description: t(lang, 'insightsSubtitle'), crumbs: [{ label: t(lang, 'navInsights') }], bodyHTML: body });
}

function insightPostPage(lang, post) {
  const page = `insight-${post.slug}.html`;
  const body = `
  <article class="section bg-white">
    <div class="shell max-w-3xl">
      <span class="pill">${post.category}</span>
      <h1 class="h1-display text-ink mt-5">${post.title}</h1>
      <div class="text-sm text-slate mt-5 flex items-center gap-2"><span>${t(lang, 'insightsPublished')}</span><time datetime="${post.publishedDate}">${post.publishedDate}</time><span aria-hidden="true">·</span><span>${post.readTime} ${t(lang, 'insightsReadTime')}</span></div>
      <div class="mt-12 space-y-7">${post.body.map((para) => `<p >${para}</p>`).join('')}</div>
      <a href="insights.html" class="inline-flex items-center gap-2 mt-14 text-ink font-medium hover:text-brand transition">${icon('arrowLeft', 'w-4 h-4')} ${t(lang, 'insightsBackToList')}</a>
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
      <h3><button class="faq-question" aria-expanded="false" aria-controls="faq-panel-${idx}" id="faq-btn-${idx}"><span>${f.question}</span>${icon('chevronDown', 'w-5 h-5 faq-chevron')}</button></h3>
      <div id="faq-panel-${idx}" role="region" aria-labelledby="faq-btn-${idx}" hidden class="faq-answer">${f.answer}</div>
    </div>`
    )
    .join('');

  const body = `
  <section class="section bg-white">
    <div class="shell max-w-3xl text-center">
      <h1 class="h1-display text-ink">${t(lang, 'contactTitle')}</h1>
      <p class="lead mt-6">${t(lang, 'contactSubtitle')}</p>
    </div>
  </section>
  <section class="section pt-0 bg-white">
    <div class="shell grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
      <div>
        <div class="card card-muted card-lg">
          <h2 class="text-lg font-semibold text-ink mb-5">${t(lang, 'contactDetailsTitle')}</h2>
          <ul class="space-y-4 text-sm text-slate">
            <li class="flex items-start gap-3">${icon('mapPin', 'w-5 h-5 text-brand shrink-0 mt-0.5')}<span>${t(lang, 'contactAddress')}</span></li>
            <li class="flex items-start gap-3">${icon('phone', 'w-5 h-5 text-brand shrink-0 mt-0.5')}<a href="tel:${CONTACT_PHONE.replace(/\s/g, '')}" class="hover:text-brand transition">${CONTACT_PHONE}</a></li>
            <li class="flex items-start gap-3">${icon('mail', 'w-5 h-5 text-brand shrink-0 mt-0.5')}<a href="mailto:${CONTACT_EMAIL}" class="hover:text-brand transition">${CONTACT_EMAIL}</a></li>
          </ul>
          <a href="https://wa.me/${WHATSAPP_NUMBER}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp w-full mt-7">${icon('whatsapp', 'w-4 h-4')} ${t(lang, 'footerWhatsapp')}</a>
        </div>
        <div class="mt-6 rounded-2xl overflow-hidden border border-line shadow-sm h-64">
          <iframe title="ENZ INTERNATIONAL — Guangzhou HQ location" src="https://www.google.com/maps?q=Guangzhou%2C+China&output=embed" width="100%" height="100%" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
      <div class="card card-lg">
        <form data-booking-form class="space-y-5">
          <p class="text-sm text-slate">${t(lang, 'bookingIntro')}</p>
          <div><label for="cf-name" class="field-label">${t(lang, 'bookingName')}</label><input id="cf-name" name="name" type="text" required class="field" /></div>
          <div><label for="cf-email" class="field-label">${t(lang, 'bookingEmail')}</label><input id="cf-email" name="email" type="email" required class="field" /></div>
          <div><label for="cf-date" class="field-label">${t(lang, 'bookingDate')}</label><input id="cf-date" name="date" type="date" class="field" /></div>
          <div><label for="cf-service" class="field-label">${t(lang, 'bookingService')}</label><select id="cf-service" name="service" class="field"><option value="">—</option><option value="sourcing">${t(lang, 'bookingServiceOptSourcing')}</option><option value="factory">${t(lang, 'bookingServiceOptFactory')}</option><option value="market">${t(lang, 'bookingServiceOptMarket')}</option></select></div>
          <input type="hidden" name="phone" value="" /><input type="hidden" name="company" value="" /><input type="hidden" name="message" value="" />
          <p data-booking-error data-error-slot role="alert" hidden class="text-sm text-red-600">${t(lang, 'bookingErrorTitle')}</p>
          <button type="submit" data-submitting-label="${t(lang, 'bookingSubmitting')}" class="w-full ${BTN_PRIMARY} py-4">${t(lang, 'bookingSubmit')}</button>
        </form>
        <div data-booking-success role="status" hidden class="py-6"><div class="text-center"><div class="icon-chip w-12 h-12 rounded-full mx-auto">${icon("check", "w-6 h-6")}</div><p class="text-lg font-semibold text-ink mt-4">${t(lang, "bookingSuccessTitle")}</p></div>${nextStepsHTML(lang)}</div>
      </div>
    </div>
  </section>
  <section class="section bg-gray-bg">
    <div class="shell">
      <h2 class="h2-section text-center mb-14">${t(lang, 'faqTitle')}</h2>
      <div class="max-w-3xl mx-auto divide-y divide-gray-200 border-t border-b border-line">${faqItems}</div>
    </div>
  </section>`;

  return pageShell({ lang, page: 'contact.html', title: t(lang, 'contactTitle'), description: t(lang, 'contactSubtitle'), crumbs: [{ label: t(lang, 'navContact') }], bodyHTML: body });
}

function portalPage(lang) {
  const body = `
  <section class="section bg-white min-h-[60vh]">
    <div class="shell max-w-2xl">
      <div class="card card-muted card-lg">
        <h1 class="text-[1.375rem] font-semibold text-ink">${t(lang, 'portalTitle')}</h1>
        <form data-portal-form class="space-y-5">
          <p class="text-sm text-slate">${t(lang, 'portalIntro')}</p>
          <div><label for="pp-email" class="field-label">${t(lang, 'portalEmailLabel')}</label><input id="pp-email" name="email" type="email" required class="field" /></div>
          <div><label for="pp-password" class="field-label">${t(lang, 'portalPassLabel')}</label><input id="pp-password" name="password" type="password" required class="field" /></div>
          <button type="submit" class="btn btn-dark w-full">${t(lang, 'portalLogin')}</button>
          <p class="text-xs text-slate text-center">${t(lang, 'portalAccessHelp')} <a href="mailto:${CONTACT_EMAIL}" class="text-brand hover:underline">${CONTACT_EMAIL}</a></p>
        </form>
        <p data-error-slot role="alert" hidden class="text-sm text-red-600 mb-4"></p><div data-portal-success role="status" hidden class="text-center py-6"><div class="text-4xl mb-4">✅</div><p class="text-lg font-semibold text-ink">${t(lang, 'portalMock')}</p><p class="text-sm text-slate mt-2">${t(lang, 'portalLoggedInDesc')}</p></div>
      </div>
    </div>
  </section>`;
  return pageShell({ lang, page: 'portal.html', title: t(lang, 'navPortal'), description: t(lang, 'portalIntro'), crumbs: [{ label: t(lang, 'navPortal') }], bodyHTML: body });
}

function careersPage(lang) {
  const body = `
  <section class="section bg-white">
    <div class="shell max-w-3xl text-center">
      <h1 class="h1-display text-ink">${t(lang, 'careersTitle')}</h1>
      <p class="lead mt-6">${t(lang, 'careersSubtitle')}</p>
    </div>
  </section>
  <section class="section pt-0 bg-white">
    <div class="shell max-w-xl">
      <div class="card card-muted text-center mb-9">${icon('briefcase', 'w-8 h-8 text-brand mx-auto mb-3')}<p class="text-sm text-slate">${t(lang, 'careersNoOpenings')}</p></div>
      <form data-careers-form enctype="multipart/form-data" class="card card-lg space-y-5">
        <h2 class="font-semibold text-ink">${t(lang, 'careersSendCv')}</h2>
        <div><label for="cv-name" class="field-label">${t(lang, 'bookingName')}</label><input id="cv-name" name="name" type="text" required class="field" /></div>
        <div><label for="cv-email" class="field-label">${t(lang, 'bookingEmail')}</label><input id="cv-email" name="email" type="email" required class="field" /></div>
        <div><label for="cv-message" class="field-label">${t(lang, 'bookingMessage')}</label><textarea id="cv-message" name="message" rows="3" class="field"></textarea></div>
        <div><label for="cv-file" class="field-label">CV / Resume (PDF)</label><input id="cv-file" name="cv" type="file" accept="application/pdf" class="block w-full text-sm text-slate border-2 border-dashed border-line rounded-xl px-4 py-7 cursor-pointer" /></div>
        <button type="submit" class="w-full ${BTN_PRIMARY} py-4">${t(lang, 'ctaSubmit')}</button>
      </form>
      <p data-error-slot role="alert" hidden class="text-sm text-red-600 text-center mt-6"></p>
      <p data-careers-success role="status" hidden class="text-center text-ink font-medium mt-6">${t(lang, 'bookingSuccessTitle')}</p>
    </div>
  </section>`;
  return pageShell({ lang, page: 'careers.html', title: t(lang, 'navCareers'), description: t(lang, 'careersSubtitle'), crumbs: [{ label: t(lang, 'navCareers') }], bodyHTML: body });
}

// ============================================================================
// Detail pages
// ============================================================================

function pageHero(lang, { eyebrow, title, lead }) {
  return `
  <section class="bg-white border-b border-line">
    <div class="shell max-w-3xl text-center pt-16 pb-14 md:pt-20 md:pb-16">
      <p class="${EYEBROW}">${eyebrow}</p>
      <h1 class="text-[2.25rem] leading-[1.1] md:text-[3.25rem] md:leading-[1.06] font-semibold text-ink mt-3">${title}</h1>
      <p class="${LEAD} mt-5">${lead}</p>
      <div class="flex flex-col sm:flex-row justify-center gap-3 mt-8">
        <button data-open-booking class="${BTN_PRIMARY} px-6 py-3 text-[0.9375rem]">${t(lang, 'ctaBooking')}${icon('chevronRight', 'w-4 h-4')}</button>
        <a href="contact.html" class="${BTN_SECONDARY} px-6 py-3 text-[0.9375rem]">${t(lang, 'navContact')}</a>
      </div>
    </div>
  </section>`;
}

// The last thing a visitor sees on every page. It gets the gradient-border
// treatment and repeats the three reassurances that remove the reasons not to
// send the form — free, no obligation, answered by a person within a day.
function closingCta(lang) {
  return `
  <section class="section section-dark">
    ${glows('b')}
    <div class="${SHELL}">
      <div class="gradient-border max-w-5xl mx-auto shadow-2xl">
        <div class="bg-navy-deep/95 px-6 py-14 md:px-16 md:py-20 text-center">
          <h2 class="h2-section on-dark">${t(lang, 'ctaBannerTitle')}</h2>
          <p class="lead-light mt-5 max-w-2xl mx-auto">${t(lang, 'ctaBannerDesc')}</p>
          <div class="flex flex-col sm:flex-row justify-center gap-3 mt-10">
            <button data-open-booking class="${BTN_PRIMARY} btn-lg">${t(lang, 'ctaBooking')}${icon('chevronRight', 'w-4 h-4 btn-arrow')}</button>
            <a href="contact.html" class="${BTN_GHOST_LIGHT} btn-lg">${t(lang, 'ctaTalkToUs')}</a>
          </div>
          <ul class="flex flex-wrap justify-center gap-x-7 gap-y-3 mt-10 text-sm list-none">
            ${[t(lang, 'bookingNext2'), t(lang, 'bookingDisclaimer')]
              .map((r) => `<li class="check-item">${icon('check', 'w-4 h-4')}<span>${r}</span></li>`)
              .join('')}
          </ul>
        </div>
      </div>
    </div>
  </section>`;
}

function processPage(lang) {
  const steps = processSteps
    .map(
      (st) => `
        <li class="card card-lg">
          <div class="flex flex-wrap items-baseline gap-3">
            <span class="text-brand font-semibold text-sm">${st.n}</span>
            <h2 class="text-xl md:text-2xl font-semibold text-ink">${st.title}</h2>
            <span class="pill pill-neutral ml-auto">${st.duration}</span>
          </div>
          <p class="text-slate mt-3 leading-relaxed">${st.summary}</p>
          <ul class="mt-5 space-y-2.5">
            ${st.detail.map((d) => `<li class="flex items-start gap-2.5 text-[0.9375rem] text-slate"><span class="mt-1.5">${icon('check', 'w-3.5 h-3.5')}</span><span>${d}</span></li>`).join('')}
          </ul>
          <p class="mt-5 pt-4 border-t border-line text-sm"><span class="font-medium text-ink">${t(lang, 'processOutput')}:</span> <span class="text-slate">${st.output}</span></p>
        </li>`
    )
    .join('');

  const rows = comparison.rows
    .map(
      (r, i) =>
        `<tr class="${i % 2 ? 'bg-gray-bg/50' : ''} border-b border-line last:border-0"><th scope="row" class="p-4 text-sm font-medium text-ink align-top text-left">${r.factor}</th><td class="p-4 text-sm text-slate align-top">${r.diy}</td><td class="p-4 text-sm text-ink align-top">${r.enz}</td></tr>`
    )
    .join('');

  const body = `
  ${pageHero(lang, { eyebrow: t(lang, 'navProcess'), title: t(lang, 'processTitle'), lead: t(lang, 'processLead') })}

  <section class="section bg-white">
    <div class="shell max-w-4xl">
      <ol class="space-y-5">${steps}</ol>
    </div>
  </section>

  <section class="section bg-gray-bg border-y border-line">
    <div class="shell max-w-5xl">
      ${sectionHead(`${t(lang, 'compareEyebrow')}`, `${comparison.title}`, `${comparison.subtitle}`)}
      <div class="mt-12 overflow-x-auto">
        <table class="w-full min-w-[640px] bg-white border border-line rounded-xl overflow-hidden text-left">
          <thead>
            <tr class="bg-gray-bg border-b border-line">
              <th scope="col" class="p-4 text-sm font-semibold text-ink w-1/4">${t(lang, 'compareFactor')}</th>
              <th scope="col" class="p-4 text-sm font-semibold text-slate">${t(lang, 'compareDiy')}</th>
              <th scope="col" class="p-4 text-sm font-semibold text-brand">${t(lang, 'compareEnz')}</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  </section>

  ${closingCta(lang)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t(lang, 'processTitle'),
    description: t(lang, 'processLead'),
    step: processSteps.map((st, i) => ({ '@type': 'HowToStep', position: i + 1, name: st.title, text: st.summary })),
  };

  return pageShell({ lang, page: 'process.html', title: t(lang, 'processTitle'), description: t(lang, 'processLead'), jsonLd, crumbs: [{ label: t(lang, 'navProcess') }], bodyHTML: body });
}

function industriesPage(lang) {
  const cards = industries
    .map(
      (ind) => `
      <article class="card card-lg">
        ${icon(ind.icon, 'w-5 h-5 text-brand mb-4')}
        <h2 class="text-xl md:text-2xl font-semibold text-ink">${ind.name}</h2>
        <p class="text-slate mt-3 leading-relaxed">${ind.body}</p>
        <p class="text-xs font-semibold tracking-[0.14em] uppercase text-slate mt-6">${t(lang, 'industriesWatch')}</p>
        <ul data-reveal-group class="mt-3 grid gap-2.5 md:grid-cols-3">
          ${ind.considerations.map((c) => `<li class="flex items-start gap-2.5 text-sm text-slate bg-gray-bg border border-line rounded-lg p-3"><span class="mt-0.5">${icon('check', 'w-3.5 h-3.5')}</span><span>${c}</span></li>`).join('')}
        </ul>
      </article>`
    )
    .join('');

  const body = `
  ${pageHero(lang, { eyebrow: t(lang, 'navIndustries'), title: t(lang, 'industriesTitle'), lead: t(lang, 'industriesLead') })}
  <section class="section bg-white">
    <div class="shell max-w-5xl space-y-5">${cards}</div>
  </section>
  ${closingCta(lang)}`;

  return pageShell({ lang, page: 'industries.html', title: t(lang, 'industriesTitle'), description: t(lang, 'industriesLead'), crumbs: [{ label: t(lang, 'navIndustries') }], bodyHTML: body });
}

function qualityControlPage(lang) {
  const stages = qcStages
    .map(
      (st) => `
        <article class="card">
          <div class="flex items-center gap-2.5">
            <span class="pill mono-tag">${st.code}</span>
            <span class="text-xs text-slate">${st.when}</span>
          </div>
          <h2 class="text-lg font-semibold text-ink mt-4">${st.title}</h2>
          <p class="text-slate text-[0.9375rem] mt-2.5 leading-relaxed">${st.body}</p>
        </article>`
    )
    .join('');

  const levels = aqlExplainer.levels
    .map(
      (l) => `<div class="card"><h3 class="font-semibold text-ink">${l.label}</h3><p class="text-slate text-[0.9375rem] mt-1.5 leading-relaxed">${l.desc}</p></div>`
    )
    .join('');

  const body = `
  ${pageHero(lang, { eyebrow: t(lang, 'qcEyebrow'), title: t(lang, 'qcTitle'), lead: t(lang, 'qcLead') })}
  <section class="section bg-white">
    <div class="shell max-w-4xl">
      <div data-reveal-group class="grid gap-5 md:grid-cols-2">${stages}</div>
    </div>
  </section>
  <section class="section bg-gray-bg border-y border-line">
    <div class="shell max-w-3xl">
      <h2 class="${H2}">${aqlExplainer.title}</h2>
      <p class="${LEAD} mt-5">${aqlExplainer.body}</p>
      <div class="mt-8 space-y-3">${levels}</div>
      <p class="note-accent mt-8">${aqlExplainer.note}</p>
    </div>
  </section>
  ${closingCta(lang)}`;

  return pageShell({ lang, page: 'quality-control.html', title: t(lang, 'qcTitle'), description: t(lang, 'qcLead'), crumbs: [{ label: t(lang, 'qcTitle') }], bodyHTML: body });
}

function logisticsPage(lang) {
  const terms = incoterms
    .map(
      (it) => `
        <div class="card">
          <div class="flex flex-wrap items-baseline gap-3">
            <span class="text-brand font-semibold">${it.code}</span>
            <h3 class="text-lg font-semibold text-ink">${it.name}</h3>
            <span class="pill pill-neutral ml-auto">${t(lang, 'incotermsRisk')}: ${it.risk}</span>
          </div>
          <p class="text-slate text-[0.9375rem] mt-3 leading-relaxed">${it.body}</p>
        </div>`
    )
    .join('');

  const docs = shippingDocs
    .map(
      (d) => `<div class="card">${icon('briefcase', 'w-5 h-5 text-brand mb-3')}<h3 class="font-semibold text-ink">${d.name}</h3><p class="text-slate text-[0.9375rem] mt-2 leading-relaxed">${d.body}</p></div>`
    )
    .join('');

  const body = `
  ${pageHero(lang, { eyebrow: t(lang, 'logisticsEyebrow'), title: t(lang, 'logisticsTitle'), lead: t(lang, 'logisticsLead') })}
  <section class="section bg-white">
    <div class="shell max-w-4xl">
      <h2 class="${H2}">${t(lang, 'incotermsTitle')}</h2>
      <p class="${LEAD} mt-5">${t(lang, 'incotermsLead')}</p>
      <div class="mt-10 space-y-4">${terms}</div>
    </div>
  </section>
  <section class="section bg-gray-bg border-y border-line">
    <div class="shell max-w-4xl">
      <h2 class="${H2}">${t(lang, 'docsTitle')}</h2>
      <p class="${LEAD} mt-5">${t(lang, 'docsLead')}</p>
      <div data-reveal-group class="mt-10 grid gap-4 md:grid-cols-2">${docs}</div>
    </div>
  </section>
  ${closingCta(lang)}`;

  return pageShell({ lang, page: 'logistics.html', title: t(lang, 'logisticsTitle'), description: t(lang, 'logisticsLead'), crumbs: [{ label: t(lang, 'logisticsTitle') }], bodyHTML: body });
}

function faqPage(lang) {
  const items = faqs
    .map(
      (f, idx) => `
      <div>
        <h2><button class="faq-question" aria-expanded="false" aria-controls="fp-${idx}" id="fp-btn-${idx}"><span>${f.question}</span>${icon('chevronDown', 'w-5 h-5 faq-chevron')}</button></h2>
        <div id="fp-${idx}" role="region" aria-labelledby="fp-btn-${idx}" hidden class="faq-answer">${f.answer}</div>
      </div>`
    )
    .join('');

  const body = `
  ${pageHero(lang, { eyebrow: 'FAQ', title: t(lang, 'faqPageTitle'), lead: t(lang, 'faqPageLead') })}
  <section class="section bg-white">
    <div class="shell max-w-3xl">
      <div class="divide-y divide-line border-y border-line">${items}</div>
    </div>
  </section>
  ${closingCta(lang)}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };

  return pageShell({ lang, page: 'faq.html', title: t(lang, 'faqPageTitle'), description: t(lang, 'faqPageLead'), jsonLd, crumbs: [{ label: 'FAQ' }], bodyHTML: body });
}

// The buyer's guide. This page absorbed the reference material that used to
// sit inline on the homepage — landed cost, payment terms, timelines, common
// mistakes, and the glossary. Same content, on the page a buyer reaches when
// they actually want it, with a jump nav and real anchors so the homepage can
// link straight to a section.
function resourcesPage(lang) {
  const jumpNav = [
    ['landed-cost', landedCost.title],
    ['payment', t(lang, 'paymentTitle')],
    ['timelines', timelines.title],
    ['mistakes', t(lang, 'mistakesTitle')],
    ['glossary', t(lang, 'glossaryTitle')],
    ['templates', t(lang, 'resourcesTitle')],
  ]
    .map(([id, label]) => `<a href="#${id}" class="${BTN_SECONDARY} btn-sm">${label}</a>`)
    .join('');

  const body = `
  ${pageHero(lang, { eyebrow: t(lang, 'navResources'), title: t(lang, 'resourcesGuideTitle'), lead: t(lang, 'resourcesGuideLead') })}

  <section class="bg-white pt-10">
    <nav aria-label="${t(lang, 'resourcesGuideTitle')}" class="${SHELL} max-w-5xl flex flex-wrap justify-center gap-2.5">${jumpNav}</nav>
  </section>

  <section id="landed-cost" class="section bg-white">
    <div class="${SHELL} max-w-5xl">
      ${sectionHead(t(lang, 'costEyebrow'), landedCost.title, landedCost.lead)}
      <div data-reveal-group class="grid gap-4 md:grid-cols-2 mt-14">
        ${landedCost.items
          .map(
            (it, i) => `<div class="${CARD}"><div class="flex items-start gap-4">
          <span class="step-badge">${i + 1}</span>
          <div><h3 class="font-medium text-ink">${it.label}</h3><p class="text-slate text-sm mt-1.5 leading-relaxed">${it.body}</p></div>
        </div></div>`
          )
          .join('')}
      </div>
      <p class="note-accent mt-10">${landedCost.note}</p>
    </div>
  </section>

  <section id="payment" class="section bg-gray-bg border-y border-line">
    <div class="${SHELL} max-w-5xl">
      ${sectionHead(t(lang, 'paymentEyebrow'), t(lang, 'paymentTitle'), t(lang, 'paymentLead'))}
      <div data-reveal-group class="grid gap-4 sm:grid-cols-2 mt-14">
        ${paymentTerms
          .map(
            (pt) => `<div class="${CARD}">
          <div class="flex items-baseline gap-3"><span class="pill mono-tag">${pt.code}</span><h3 class="font-medium text-ink">${pt.name}</h3></div>
          <p class="text-slate text-sm mt-3 leading-relaxed">${pt.body}</p>
        </div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section id="timelines" class="section bg-white">
    <div class="${SHELL} max-w-4xl">
      ${sectionHead(t(lang, 'timelineEyebrow'), timelines.title, timelines.lead)}
      <div class="table-wrap mt-14">
        <table class="table-pro">
          <thead>
            <tr>
              <th scope="col">${t(lang, 'timelinePhase')}</th>
              <th scope="col" class="text-brand">${t(lang, 'timelineTypical')}</th>
              <th scope="col">${t(lang, 'timelineNote')}</th>
            </tr>
          </thead>
          <tbody>
            ${timelines.rows
              .map(
                (r) =>
                  `<tr><th scope="row">${r.phase}</th><td class="text-brand whitespace-nowrap">${r.typical}</td><td>${r.note}</td></tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section id="mistakes" class="section bg-gray-bg border-y border-line">
    <div class="${SHELL}">
      ${sectionHead(t(lang, 'mistakesEyebrow'), t(lang, 'mistakesTitle'), t(lang, 'mistakesLead'))}
      <div data-reveal-group class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-14">
        ${commonMistakes
          .map(
            (m, i) => `<div class="${CARD}">
          <span class="step-badge">${String(i + 1).padStart(2, '0')}</span>
          <h3 class="font-medium text-ink mt-4">${m.title}</h3>
          <p class="text-slate text-sm mt-2 leading-relaxed">${m.body}</p>
        </div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section id="glossary" class="section bg-white">
    <div class="${SHELL}">
      ${sectionHead(t(lang, 'glossaryEyebrow'), t(lang, 'glossaryTitle'), t(lang, 'glossaryLead'))}
      <dl data-reveal-group class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-14">
        ${glossary
          .map(
            (g) =>
              `<div class="${CARD} card-muted"><dt class="font-medium text-ink">${g.term}</dt><dd class="text-slate text-sm mt-1.5 leading-relaxed">${g.def}</dd></div>`
          )
          .join('')}
      </dl>
      <p class="text-center mt-10"><a href="logistics.html" class="${BTN_SECONDARY}">${t(lang, 'incotermsTitle')} ${icon('chevronRight', 'w-4 h-4 btn-arrow')}</a></p>
    </div>
  </section>

  <section id="templates" class="section bg-gray-bg border-y border-line">
    <div class="${SHELL} max-w-5xl">
      ${sectionHead(t(lang, 'navResources'), t(lang, 'resourcesTitle'), t(lang, 'resourcesLead'))}
      <div data-reveal-group class="grid gap-4 md:grid-cols-2 mt-14">
        ${resources
          .map(
            (r) => `<article class="${CARD} flex flex-col">
          <span class="icon-chip">${icon(r.icon, 'w-5 h-5')}</span>
          <h3 class="text-lg font-medium text-ink mt-4">${r.title}</h3>
          <p class="text-slate text-sm mt-2.5 leading-relaxed flex-1">${r.body}</p>
          <button data-open-booking class="${BTN_SECONDARY} btn-sm mt-5 self-start">${r.cta}${icon('chevronRight', 'w-3.5 h-3.5 btn-arrow')}</button>
        </article>`
          )
          .join('')}
      </div>
      <p class="text-sm text-slate mt-8 text-center">${t(lang, 'resourcesNote')}</p>
    </div>
  </section>

  ${closingCta(lang)}`;

  return pageShell({
    lang,
    page: 'resources.html',
    title: t(lang, 'resourcesGuideTitle'),
    description: t(lang, 'resourcesGuideLead'),
    crumbs: [{ label: t(lang, 'navResources') }],
    bodyHTML: body,
  });
}

// Engagement models and the honest answer on pricing. A B2B services site
// without this page loses the buyer who has decided you can do the work and
// now needs to know how being your client actually works — previously that
// was three cards at the bottom of services.html.
function pricingPage(lang) {
  const body = `
  ${pageHero(lang, { eyebrow: t(lang, 'engageEyebrow'), title: t(lang, 'pricingTitle'), lead: t(lang, 'pricingLead') })}

  <section class="section bg-white">
    <div class="${SHELL}">
      <div data-reveal-group class="grid lg:grid-cols-3 gap-5 items-start">
        ${engagementModels.map((m) => engagementCard(lang, m, { detailed: true })).join('')}
      </div>
    </div>
  </section>

  <section class="section bg-gray-bg border-y border-line">
    <div class="${SHELL} max-w-5xl">
      ${sectionHead(t(lang, 'costEyebrow'), t(lang, 'pricingFactorsTitle'), t(lang, 'pricingFactorsLead'))}
      <div data-reveal-group class="grid gap-4 sm:grid-cols-2 mt-14">
        ${pricingFactors
          .map(
            (f, i) => `<div class="${CARD}"><div class="flex items-start gap-4">
          <span class="step-badge">${i + 1}</span>
          <div><h3 class="font-medium text-ink">${f.label}</h3><p class="text-slate text-sm mt-1.5 leading-relaxed">${f.body}</p></div>
        </div></div>`
          )
          .join('')}
      </div>

      <div class="card card-lg mt-10 max-w-3xl mx-auto">
        <h3 class="text-lg font-medium text-ink">${t(lang, 'pricingNoteTitle')}</h3>
        <p class="note-accent mt-4">${t(lang, 'pricingNote')}</p>
      </div>
    </div>
  </section>

  <section class="section bg-white">
    <div class="${SHELL} max-w-4xl">
      ${sectionHead(t(lang, 'startEyebrow'), t(lang, 'startTitle'), t(lang, 'startLead'))}
      <ol data-reveal-group class="mt-14 space-y-4">
        ${gettingStarted
          .map(
            (st) => `<li class="${CARD} flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          <span class="step-badge step-badge-lg">${st.n}</span>
          <div class="flex-1">
            <div class="flex flex-wrap items-baseline gap-3">
              <h3 class="text-lg font-medium text-ink">${st.title}</h3>
              <span class="pill pill-neutral mono-tag">${st.meta}</span>
            </div>
            <p class="text-slate text-sm mt-2 leading-relaxed">${st.body}</p>
          </div>
        </li>`
          )
          .join('')}
      </ol>
    </div>
  </section>

  ${closingCta(lang)}`;

  const jsonLd = {
    '@type': 'ItemList',
    name: t(lang, 'engageTitle'),
    itemListElement: engagementModels.map((m, i) => ({
      '@type': 'Service',
      position: i + 1,
      name: m.name,
      description: m.body,
      provider: { '@type': 'Organization', name: 'ENZ INTERNATIONAL' },
    })),
  };

  return pageShell({
    lang,
    page: 'pricing.html',
    title: t(lang, 'pricingTitle'),
    description: t(lang, 'pricingLead'),
    jsonLd,
    crumbs: [{ label: t(lang, 'navPricing') }],
    bodyHTML: body,
  });
}

function legalPage(lang, type) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? t(lang, 'footerPrivacy') : t(lang, 'footerTerms');
  const content = isPrivacy
    ? `<p>ENZ INTERNATIONAL ("we", "us") collects information you provide directly — such as your name, email, and project details submitted through our consultation and newsletter forms — in order to respond to your enquiry and, where you've opted in, send occasional updates.</p>
       <h2 >What we collect</h2><p>Contact-form and booking submissions, newsletter sign-up emails, and — once analytics tooling is connected — standard usage data.</p>
       <h2 >Your rights</h2><p>You may have the right to access, correct, or delete your data, or withdraw consent for marketing emails at any time.</p>
       <h2 >Contact</h2><p>Questions can be sent to <a href="mailto:${CONTACT_EMAIL}" class="text-brand hover:underline">${CONTACT_EMAIL}</a>.</p>`
    : `<p>These terms govern your use of the ENZ INTERNATIONAL website. By using this site, you agree to use it only for lawful purposes.</p>
       <h2 >No binding offer</h2><p>Content on this site is informational and does not constitute a binding offer. Engagements are governed by separately signed contracts.</p>
       <h2 >Contact</h2><p>Questions can be sent to <a href="mailto:${CONTACT_EMAIL}" class="text-brand hover:underline">${CONTACT_EMAIL}</a>.</p>`;

  const body = `
  <section class="section bg-white">
    <div class="shell max-w-3xl">
      <h1 class="h2-section">${title}</h1>
      <p class="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-9">Placeholder text — not reviewed by counsel. Replace before launch.</p>
      <div class="prose-enz">${content}</div>
    </div>
  </section>`;
  // A two-word description ("Privacy Policy") gives a search engine nothing to
  // render, so it writes its own snippet from the page body instead.
  const description = isPrivacy
    ? 'How ENZ INTERNATIONAL collects, uses, and protects the information you submit through our consultation, contact, and newsletter forms — and the rights you have over it.'
    : 'The terms governing use of the ENZ INTERNATIONAL website, including the status of published content and how engagements are actually contracted.';

  return pageShell({ lang, page: `${type}.html`, title, description, crumbs: [{ label: title }], bodyHTML: body });
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
    ['process.html', processPage],
    ['industries.html', industriesPage],
    ['quality-control.html', qualityControlPage],
    ['logistics.html', logisticsPage],
    ['faq.html', faqPage],
    ['resources.html', resourcesPage],
    ['pricing.html', pricingPage],
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

// ---------------------------------------------------------------------------
// Root files: language redirect, 404, manifest, host config, robots, sitemap
// ---------------------------------------------------------------------------

// Root visitors land on English. A <meta refresh> is the fallback for the rare
// client that runs no script; the script path is instant and, unlike the meta
// tag, uses replace() so Back doesn't bounce the visitor straight back here.
// Note the paths are one level shallower than in a language folder.
writeFileSync(
  path.join(OUT, 'index.html'),
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="0; url=en/index.html" />
    <link rel="canonical" href="${SITE_URL}/en/index.html" />
    <link rel="icon" type="image/png" sizes="512x512" href="assets/images/favicon-512.png" />
    <title>ENZ INTERNATIONAL — Global Sourcing &amp; Industrial Excellence</title>
    <meta name="description" content="${t('en', 'heroSub')}" />
    <link rel="stylesheet" href="assets/css/site.css?v=${ASSET_VERSION}" />
  </head>
  <body class="bg-white text-ink">
    <script>location.replace('en/index.html');</script>
    <main class="min-h-screen flex items-center justify-center px-4 text-center">
      <p class="lead">Redirecting to <a href="en/index.html" class="link-arrow">ENZ INTERNATIONAL</a>…</p>
    </main>
  </body>
</html>`
);

// Static hosts serve this for any unmatched path, so it is a real page with
// real navigation — a dead end here is a lost visitor, not just a 404.
writeFileSync(
  path.join(OUT, '404.html'),
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, follow" />
    <title>Page not found | ENZ INTERNATIONAL</title>
    <meta name="theme-color" content="#0B1A24" />
    <link rel="icon" type="image/png" sizes="512x512" href="/assets/images/favicon-512.png" />
    <link rel="stylesheet" href="/assets/css/site.css?v=${ASSET_VERSION}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${FONT_HREF}" />
  </head>
  <body class="bg-white text-ink">
    <main class="section-dark min-h-screen flex items-center justify-center px-4 py-20">
      ${glows('a')}
      <div class="text-center max-w-lg">
        <p class="mono-tag text-brand-bright text-sm">Error 404</p>
        <h1 class="h1-display text-white mt-4">This page <span class="text-gradient">isn't here</span></h1>
        <p class="lead-light mt-5">The page you're looking for doesn't exist, or it may have moved. The links below will get you back on track.</p>
        <div class="flex flex-col sm:flex-row justify-center gap-3 mt-9">
          <a href="/en/index.html" class="btn btn-primary btn-lg">Back to homepage</a>
          <a href="/en/contact.html" class="btn btn-ghost-light btn-lg">Contact us</a>
        </div>
        <div class="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-10 text-sm">
          ${['services', 'process', 'markets', 'insights', 'faq']
            .map((slug) => `<a href="/en/${slug}.html" class="text-white/55 hover:text-white transition-colors capitalize">${slug}</a>`)
            .join('')}
        </div>
      </div>
    </main>
  </body>
</html>`
);

// Installable-app metadata. Also what Android uses for the home-screen icon
// and the address-bar colour, so it is worth having even with no PWA ambition.
writeFileSync(
  path.join(OUT, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'ENZ INTERNATIONAL',
      short_name: 'ENZ',
      description: t('en', 'heroSub'),
      start_url: '/en/index.html',
      scope: '/',
      display: 'standalone',
      background_color: '#FFFFFF',
      theme_color: '#0B1A24',
      icons: [
        { src: '/assets/images/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/assets/images/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    null,
    2
  ) + '\n'
);

// Caching and security headers, in each host's own dialect. Both files are
// inert on a host that doesn't read them, so shipping both costs nothing and
// means the site is correctly configured wherever it lands.
//
// The split that matters: HTML must stay revalidated (so a content fix goes
// live immediately), while /assets/ is immutable for a year — safe because
// every asset URL carries ?v=ASSET_VERSION and changes when the file does.
const CACHE_LONG = 'public, max-age=31536000, immutable';
const CACHE_HTML = 'public, max-age=0, must-revalidate';
const SECURITY_HEADERS = [
  ['X-Content-Type-Options', 'nosniff'],
  ['X-Frame-Options', 'SAMEORIGIN'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()'],
  ['Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload'],
];

writeFileSync(
  path.join(OUT, '_headers'),
  `# Netlify / Cloudflare Pages. Generated by _generate-static.mjs.
/*
${SECURITY_HEADERS.map(([k, v]) => `  ${k}: ${v}`).join('\n')}
  Cache-Control: ${CACHE_HTML}

/assets/*
  Cache-Control: ${CACHE_LONG}
`
);

writeFileSync(
  path.join(OUT, 'vercel.json'),
  JSON.stringify(
    {
      $schema: 'https://openapi.vercel.sh/vercel.json',
      // No framework, no build step: Vercel serves this folder as-is.
      framework: null,
      buildCommand: null,
      outputDirectory: '.',
      cleanUrls: false,
      trailingSlash: false,
      headers: [
        { source: '/(.*)', headers: SECURITY_HEADERS.map(([key, value]) => ({ key, value })) },
        { source: '/assets/(.*)', headers: [{ key: 'Cache-Control', value: CACHE_LONG }] },
        { source: '/(.*).html', headers: [{ key: 'Cache-Control', value: CACHE_HTML }] },
      ],
    },
    null,
    2
  ) + '\n'
);

// Privacy and terms were previously disallowed. Search engines treat a
// reachable, indexable privacy policy as a trust signal for a business site,
// and hiding it gains nothing — only the client portal is worth excluding.
writeFileSync(
  path.join(OUT, 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /*/portal.html

Sitemap: ${SITE_URL}/sitemap.xml
`
);

// Portal is the only page kept out of the sitemap, matching robots.txt above.
const sitemapPages = ALL_PAGES.filter((p) => p !== 'portal.html');
const LASTMOD = new Date().toISOString().slice(0, 10);
// Home outranks a legal page; a hub outranks a leaf.
const priorityFor = (page) => {
  if (page === 'index.html') return '1.0';
  if (['privacy.html', 'terms.html'].includes(page)) return '0.3';
  if (page.startsWith('insight-')) return '0.6';
  return '0.8';
};
const urls = SUPPORTED_LANGUAGES.flatMap((lang) =>
  sitemapPages.map(
    (page) =>
      `  <url>\n    <loc>${SITE_URL}/${lang}/${page}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n    <priority>${priorityFor(page)}</priority>\n${SUPPORTED_LANGUAGES.map(
        (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}/${page}" />`
      ).join('\n')}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/${page}" />\n  </url>`
  )
);
writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
);

console.log(
  `\nDone. ${SUPPORTED_LANGUAGES.length} languages x ${ALL_PAGES.length} pages, plus index / 404 / manifest / robots / sitemap / host headers.`
);
