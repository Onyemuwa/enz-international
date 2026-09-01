// Dedicated service and location landing pages.
//
// WHY THESE EXIST
// Both sets of content were previously anchor sections on a single page:
// five markets on markets.html, three services on services.html. That is the
// worst of both worlds for search — five countries competing for relevance on
// one URL, so nothing can rank for "China sourcing Kenya", and no page can
// carry a title, an H1, a canonical and its own schema aimed at one intent.
//
// The hub pages remain and now link here, which also turns a page of anchor
// jumps into real internal linking.
//
// A NOTE ON DOORWAY PAGES
// Templated location pages that differ only by a place name are treated as
// doorway pages and are actively penalised. These are not that: every market
// carries its own operational detail (the port, the hub office, the service
// mix that market actually asks for), and every service carries its own
// feature list and five-step process. All of it is content that already
// existed and was written for these pages — _content/markets.js is literally
// commented "Per-market landing pages".
//
// Nothing here invents a market-specific claim, statistic, client or
// certification. The scope rule from _content/pages.js applies: industry
// process and geography are fine, ENZ-specific facts that would need evidence
// are not.

import { t } from './i18n.js';
import { icon } from './icons.js';
import { BTN_PRIMARY, CARD, CARD_MUTED, CARD_FEATURE, LEAD } from './tokens.js';
import { pageShell } from './page-shell.js';
import { pageHero, closingCta } from './page-parts.js';
import { services } from '../_content/services.js';
import { markets } from '../_content/markets.js';
import { faqs } from '../_content/faqs.js';
import { SITE_URL } from './site-config.js';

/** Slug helpers, so the hub pages and the writer agree on one spelling. */
export const servicePageFor = (service) => `${service.slug}.html`;
export const marketPageFor = (market) => `${market.slug}.html`;

// Which hub serves which market. Drawn from _content/regions.js hubs; this is
// operational geography, not a claim about facilities.
const MARKET_HUB = {
  tanzania: { hub: 'Dar es Salaam', port: 'the Port of Dar es Salaam' },
  kenya: { hub: 'Nairobi', port: 'the Port of Mombasa' },
  drc: { hub: 'Kinshasa', port: 'Matadi and the Dar es Salaam corridor' },
  usa: { hub: 'New York', port: 'US west- and east-coast ports' },
  uk: { hub: 'London', port: 'UK container ports' },
};

/**
 * A FAQ block plus the matching FAQPage entity.
 *
 * Returned together on purpose: an FAQPage entity describing questions that
 * are not visible on the page is a structured-data violation, so the markup
 * and the schema are built from one array and cannot drift apart.
 */
function faqBlock(lang, subset, headingId) {
  const items = subset.filter(Boolean);
  if (!items.length) return { html: '', entity: null };

  const html = `
  <section class="section bg-white">
    <div class="shell max-w-3xl">
      <h2 id="${headingId}" class="h2-section text-center">${t(lang, 'faqTitle')}</h2>
      <div class="mt-10 space-y-4">
        ${items
          .map(
            (f) => `<details class="${CARD}">
              <summary class="font-semibold text-ink cursor-pointer list-none flex items-start justify-between gap-4">
                <span>${f.question}</span>
                ${icon('chevronDown', 'w-5 h-5 text-slate-light shrink-0 mt-0.5')}
              </summary>
              <p class="text-slate text-sm mt-3.5 leading-relaxed">${f.answer}</p>
            </details>`
          )
          .join('')}
      </div>
      <p class="text-center text-sm text-slate mt-8">
        <a href="faq.html" class="text-brand hover:underline underline-offset-4">${t(lang, 'faqSeeAll')}</a>
      </p>
    </div>
  </section>`;

  const entity = {
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
  return { html, entity };
}

// ---------------------------------------------------------------------------
// Service pages
// ---------------------------------------------------------------------------

export function servicePage(lang, service) {
  const name = t(lang, service.titleKey);
  const desc = t(lang, service.descKey);
  const page = servicePageFor(service);

  const features = service.features
    .map(
      (f) =>
        `<li class="flex items-start gap-3 text-slate"><span class="mt-0.5 shrink-0">${icon('check', 'w-4 h-4 text-brand')}</span><span>${f}</span></li>`
    )
    .join('');

  const steps = service.process
    .map(
      (p, i) =>
        `<li class="flex gap-4"><span class="step-badge step-badge-lg shrink-0">${i + 1}</span><div><p class="font-semibold text-ink">${p.step}</p><p class="text-sm text-slate mt-1">${p.desc}</p></div></li>`
    )
    .join('');

  // Every service page links to every market page and vice versa. This is the
  // internal linking that makes both sets discoverable rather than orphaned.
  const marketLinks = markets
    .map(
      (m) =>
        `<a href="${marketPageFor(m)}" class="${CARD_MUTED} flex items-center gap-3">
          <span class="step-badge shrink-0">${m.region}</span>
          <span class="font-medium text-ink">${m.fullName || m.name}</span>
          ${icon('chevronRight', 'w-4 h-4 text-slate-light ml-auto shrink-0')}
        </a>`
    )
    .join('');

  const otherServices = services
    .filter((s) => s.slug !== service.slug)
    .map(
      (s) =>
        `<a href="${servicePageFor(s)}" class="${CARD_FEATURE}">
          ${icon(s.icon, 'w-8 h-8 text-brand mb-4')}
          <h3 class="font-semibold text-ink">${t(lang, s.titleKey)}</h3>
          <p class="text-slate text-sm mt-2 leading-relaxed">${s.tagline}</p>
        </a>`
    )
    .join('');

  const faq = faqBlock(lang, faqs.slice(0, 4), `faq-${service.slug}`);

  const body = `
  ${pageHero(lang, { eyebrow: t(lang, 'navServices'), title: name, lead: service.tagline })}

  <section class="section bg-white">
    <div class="shell grid grid-cols-1 lg:grid-cols-2 gap-14 items-start max-w-5xl">
      <div>
        <p class="${LEAD}">${desc}</p>
        <h2 class="h2-section text-2xl mt-10">What is included</h2>
        <ul class="mt-6 space-y-3.5 text-sm">${features}</ul>
        <button data-open-booking class="mt-9 ${BTN_PRIMARY} px-7 py-3.5 inline-flex items-center gap-2">${icon('calendar', 'w-4 h-4')} ${t(lang, 'ctaBooking')}</button>
      </div>
      <div>
        <h2 class="h2-section text-2xl mb-6">How it works</h2>
        <ol class="card card-lg space-y-6">${steps}</ol>
      </div>
    </div>
  </section>

  <section class="section section-feature">
    <div class="shell max-w-5xl">
      <div class="text-center max-w-2xl mx-auto">
        <h2 class="h2-section">Where we deliver this</h2>
        <p class="${LEAD} mt-4">${name} is available to businesses in every market we operate in.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">${marketLinks}</div>
    </div>
  </section>

  <section class="section bg-white">
    <div class="shell max-w-4xl">
      <h2 class="h2-section text-center">Other services</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">${otherServices}</div>
    </div>
  </section>

  ${faq.html}
  ${closingCta(lang)}`;

  const graph = [
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/${lang}/${service.slug}/#service`,
      name,
      description: desc,
      serviceType: name,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: markets.map((m) => ({ '@type': 'Country', name: m.fullName || m.name })),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${name} — what is included`,
        itemListElement: service.features.map((f) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: f },
        })),
      },
    },
  ];
  if (faq.entity) graph.push(faq.entity);

  return pageShell({
    lang,
    page,
    title: `${name} — China Sourcing`,
    description: `${service.tagline} ${desc}`,
    jsonLd: { '@graph': graph },
    crumbs: [{ label: t(lang, 'navServices'), href: 'services.html' }, { label: name }],
    bodyHTML: body,
  });
}

// ---------------------------------------------------------------------------
// Location pages
// ---------------------------------------------------------------------------

export function marketPage(lang, market) {
  const full = market.fullName || market.name;
  const page = marketPageFor(market);
  const geo = MARKET_HUB[market.slug] || {};

  const serviceCards = services
    .map(
      (s) =>
        `<a href="${servicePageFor(s)}" class="${CARD_FEATURE}">
          ${icon(s.icon, 'w-8 h-8 text-brand mb-4')}
          <h3 class="font-semibold text-ink">${t(lang, s.titleKey)}</h3>
          <p class="text-slate text-sm mt-2.5 leading-relaxed">${t(lang, s.descKey)}</p>
          <span class="text-brand text-sm font-medium mt-5 inline-flex items-center gap-1.5">${t(lang, 'ctaLearnMore')} ${icon('chevronRight', 'w-4 h-4')}</span>
        </a>`
    )
    .join('');

  const otherMarkets = markets
    .filter((m) => m.slug !== market.slug)
    .map(
      (m) =>
        `<a href="${marketPageFor(m)}" class="${CARD_MUTED} flex items-center gap-3">
          <span class="step-badge shrink-0">${m.region}</span>
          <span class="font-medium text-ink">${m.fullName || m.name}</span>
          ${icon('chevronRight', 'w-4 h-4 text-slate-light ml-auto shrink-0')}
        </a>`
    )
    .join('');

  // Operational detail, not a claim: a hub city and the shipping route are
  // geography. Nothing here asserts an office, a headcount or a volume.
  const logistics = geo.hub
    ? `
  <section class="section bg-white">
    <div class="shell max-w-3xl">
      <h2 class="h2-section text-center">Getting goods to ${market.name}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
        <div class="${CARD}">
          ${icon('mapPin', 'w-7 h-7 text-brand mb-3')}
          <h3 class="font-semibold text-ink">Coordinated from ${geo.hub}</h3>
          <p class="text-slate text-sm mt-2 leading-relaxed">Sourcing runs from our Guangzhou hub, with ${market.name}-side coordination through ${geo.hub}.</p>
        </div>
        <div class="${CARD}">
          ${icon('shield', 'w-7 h-7 text-brand mb-3')}
          <h3 class="font-semibold text-ink">Inspected before it ships</h3>
          <p class="text-slate text-sm mt-2 leading-relaxed">Quality control happens at the factory, not on arrival — a defect found in China can still be fixed, one found at ${geo.port} cannot.</p>
        </div>
      </div>
      <p class="text-center text-sm text-slate mt-8">
        <a href="logistics.html" class="text-brand hover:underline underline-offset-4">${t(lang, 'logisticsTitle')}</a>
      </p>
    </div>
  </section>`
    : '';

  const faq = faqBlock(lang, faqs.slice(0, 4), `faq-${market.slug}`);

  const body = `
  ${pageHero(lang, {
    eyebrow: `${market.region} · ${full}`,
    title: market.heroLine,
    lead: market.intro,
  })}

  <section class="section section-feature">
    <div class="shell max-w-5xl">
      <div class="text-center max-w-2xl mx-auto">
        <h2 class="h2-section">What we do for ${market.name} businesses</h2>
      </div>
      <div data-reveal-group class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">${serviceCards}</div>
    </div>
  </section>

  ${logistics}

  <section class="section bg-gray-bg">
    <div class="shell max-w-4xl">
      <h2 class="h2-section text-center">Other markets we serve</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">${otherMarkets}</div>
      <p class="text-center text-sm text-slate mt-8">
        <a href="markets.html" class="text-brand hover:underline underline-offset-4">${t(lang, 'navMarkets')}</a>
      </p>
    </div>
  </section>

  ${faq.html}
  ${closingCta(lang)}`;

  const graph = [
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/${lang}/${market.slug}/#service`,
      name: `China sourcing and factory setup in ${full}`,
      description: market.intro,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: { '@type': 'Country', name: full },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `Services in ${full}`,
        itemListElement: services.map((s) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: t(lang, s.titleKey), description: t(lang, s.descKey) },
        })),
      },
    },
  ];
  if (faq.entity) graph.push(faq.entity);

  return pageShell({
    lang,
    page,
    title: `China Sourcing in ${market.name}`,
    description: market.intro,
    jsonLd: { '@graph': graph },
    crumbs: [{ label: t(lang, 'navMarkets'), href: 'markets.html' }, { label: full }],
    bodyHTML: body,
  });
}
