// The equipment page: a storefront-style product grid, organised by industry.
//
// The organising idea — group by industry, then show each product with a
// photo, a name and a short spec line — is a useful catalogue pattern and is
// what this borrows. What it deliberately does not borrow is the
// specific-listing framing: no named factory, no single verified unit, no
// price tag. "Request a Quote" instead of "Add to cart" is the whole point —
// it tells a visitor correctly that ENZ sources against their brief rather
// than shipping from stock, and it is also what makes the CTA useful to ENZ:
// the message it opens already says which product the enquiry is about. See
// the header of _content/equipment.js for the fuller reasoning.

import { t } from './i18n.js';
import { icon } from './icons.js';
import { CARD, SHELL } from './tokens.js';
import { media, escapeAttr } from './components.js';
import { pageShell } from './page-shell.js';
import { pageHero, closingCta } from './page-parts.js';
import { equipmentCategories } from '../_content/equipment.js';
import { SITE_URL } from './site-config.js';

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function specChip(label, value) {
  return `<div><p class="text-[0.625rem] font-semibold tracking-[0.08em] uppercase text-slate-light">${label}</p><p class="text-sm text-ink font-medium mt-0.5 leading-tight">${value}</p></div>`;
}

// One product tile: photo, name, one-line description, a compact spec row,
// and the quote CTA. `data-quote-for` is read by site.js to pre-write the
// booking modal's message field with the product name, so the enquiry that
// reaches ENZ already says what it is about.
function productCard(lang, item) {
  const photo = media(
    { src: item.image, file: item.image || `${slugify(item.name)}.webp`, alt: item.use },
    { ratio: '4-3', className: 'card-media' }
  );
  return `<article class="${CARD} flex flex-col">
    ${photo}
    <h3 class="font-semibold text-ink leading-snug">${item.name}</h3>
    <p class="text-slate text-sm mt-2 leading-relaxed flex-1">${item.use}</p>
    <div class="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-line">
      ${specChip(t(lang, 'equipmentSpecPower'), item.power)}
      ${specChip(t(lang, 'equipmentSpecCapacity'), item.capacity)}
      ${specChip(t(lang, 'equipmentSpecLeadTime'), item.leadTime)}
    </div>
    <button data-open-booking data-quote-for="${escapeAttr(item.name)}" class="mt-5 w-full btn btn-primary btn-sm justify-center">
      ${t(lang, 'equipmentRequestCta')} ${icon('chevronRight', 'w-4 h-4')}
    </button>
  </article>`;
}

export function equipmentPage(lang) {
  // A pill nav under the hero — "browse by category" — jumping to each
  // section anchor. The storefront-style equivalent of a shop's category
  // menu, and genuinely useful once the page holds 35 products: nobody should
  // have to scroll past six categories to reach the seventh.
  const categoryNav = equipmentCategories
    .map((cat) => `<a href="#${slugify(cat.industry)}" class="btn btn-secondary btn-sm">${cat.industry}</a>`)
    .join('');

  const sections = equipmentCategories
    .map((cat, idx) => {
      const cards = cat.items.map((item) => productCard(lang, item)).join('');
      return `
    <section id="${slugify(cat.industry)}" class="section scroll-mt-24 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-bg'}">
      <div class="${SHELL} max-w-6xl">
        <div class="flex items-end justify-between gap-6 flex-wrap mb-8">
          <div class="max-w-2xl">
            <h2 class="h2-section text-2xl">${cat.industry}</h2>
            <p class="text-slate mt-2.5 leading-relaxed">${cat.intro}</p>
          </div>
          <span class="pill mono-tag shrink-0">${cat.items.length} ${cat.items.length === 1 ? 'type' : 'types'}</span>
        </div>
        <div data-reveal-group class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>
      </div>
    </section>`;
    })
    .join('');

  const body = `
  ${pageHero(lang, { eyebrow: t(lang, 'navEquipment'), title: t(lang, 'equipmentTitle'), lead: t(lang, 'equipmentLead') })}
  <section class="section-sm bg-white pt-0">
    <div class="${SHELL} max-w-6xl space-y-6">
      <p class="text-sm text-slate bg-gray-bg border border-line rounded-lg px-4 py-3">${t(lang, 'equipmentDisclaimer')}</p>
      <nav aria-label="${t(lang, 'equipmentShopByCategory')}" class="flex flex-wrap gap-2.5">${categoryNav}</nav>
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
    '@id': `${SITE_URL}/${lang}/equipment/#${slugify(cat.industry)}`,
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
