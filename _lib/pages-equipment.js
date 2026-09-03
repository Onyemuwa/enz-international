// The equipment page: one category grid per industry, each item a small spec
// card rather than a full listing page.
//
// The organising idea — group by industry, then list machine types, then show
// a short spec table per type — is a useful directory pattern and is what
// this borrows. What it deliberately does not borrow is the specific-listing
// framing: no named factory, no single verified unit, no price. See the
// header of _content/equipment.js for why that distinction matters here.
//
// Photography is reused from industries.html via the same `industryImages`
// keys, so this does not introduce a second taxonomy or a second set of stock
// photos that can drift from the one already published.

import { t } from './i18n.js';
import { icon } from './icons.js';
import { BTN_PRIMARY, CARD, SHELL } from './tokens.js';
import { media } from './components.js';
import { pageShell } from './page-shell.js';
import { pageHero, closingCta } from './page-parts.js';
import { equipmentCategories } from '../_content/equipment.js';
import { industryImages } from '../_content/images.js';
import { SITE_URL } from './site-config.js';

function specChip(label, value) {
  return `<div><p class="text-[0.6875rem] font-semibold tracking-[0.1em] uppercase text-slate-light">${label}</p><p class="text-sm text-ink font-medium mt-0.5">${value}</p></div>`;
}

function equipmentCard(lang, item) {
  return `<article class="${CARD}">
    <h3 class="font-semibold text-ink leading-snug">${item.name}</h3>
    <p class="text-slate text-sm mt-2 leading-relaxed">${item.use}</p>
    <div class="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-line">
      ${specChip(t(lang, 'equipmentSpecPower'), item.power)}
      ${specChip(t(lang, 'equipmentSpecCapacity'), item.capacity)}
      ${specChip(t(lang, 'equipmentSpecLeadTime'), item.leadTime)}
    </div>
    <button data-open-booking class="mt-6 w-full btn btn-secondary btn-sm justify-center">${t(lang, 'equipmentRequestCta')} ${icon('chevronRight', 'w-4 h-4')}</button>
  </article>`;
}

export function equipmentPage(lang) {
  const sections = equipmentCategories
    .map((cat, idx) => {
      const hasPhoto = !!industryImages[cat.industry];
      const cards = cat.items.map((item) => equipmentCard(lang, item)).join('');
      return `
    <section class="section scroll-mt-24 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-bg'}">
      <div class="${SHELL} max-w-5xl">
        <div class="grid grid-cols-1 ${hasPhoto ? 'lg:grid-cols-[minmax(0,1fr)_2fr]' : ''} gap-10 items-start">
          ${hasPhoto ? `<div>${media(cat.industry, { ratio: '4-3' })}</div>` : ''}
          <div>
            <h2 class="h2-section text-2xl">${cat.industry}</h2>
            <p class="text-slate mt-3 leading-relaxed max-w-2xl">${cat.intro}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">${cards}</div>
          </div>
        </div>
      </div>
    </section>`;
    })
    .join('');

  const body = `
  ${pageHero(lang, { eyebrow: t(lang, 'navEquipment'), title: t(lang, 'equipmentTitle'), lead: t(lang, 'equipmentLead') })}
  <section class="section-sm bg-white pt-0">
    <div class="${SHELL} max-w-5xl">
      <p class="text-sm text-slate bg-gray-bg border border-line rounded-lg px-4 py-3">${t(lang, 'equipmentDisclaimer')}</p>
    </div>
  </section>
  ${sections}
  ${closingCta(lang)}`;

  // One Service entity per category, each carrying its illustrative items as
  // an OfferCatalog — the same shape used on the service and market landing
  // pages. Deliberately Service, not Product: ENZ sources equipment against a
  // brief rather than holding or selling stock, and a Product entity with no
  // price would either omit a required field or invite one that does not
  // exist.
  const graph = equipmentCategories.map((cat) => ({
    '@type': 'Service',
    '@id': `${SITE_URL}/${lang}/equipment/#${cat.industry.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: `Equipment sourcing — ${cat.industry}`,
    description: cat.intro,
    provider: { '@id': `${SITE_URL}/#organization` },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${cat.industry} — equipment types`,
      itemListElement: cat.items.map((item) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: item.name, description: item.use },
      })),
    },
  }));

  return pageShell({
    lang,
    page: 'equipment.html',
    title: t(lang, 'equipmentTitle'),
    description: t(lang, 'equipmentLead'),
    jsonLd: { '@graph': graph },
    crumbs: [{ label: t(lang, 'navEquipment') }],
    bodyHTML: body,
  });
}
