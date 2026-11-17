// The pages a visitor actually arrives on.
//
// Home, about, services, markets, insights, contact, careers - the ones linked
// from the main navigation and the ones search traffic lands on. They are the
// pages most likely to be edited, so they are kept apart from the reference
// pages that rarely change.
import { SITE_URL, WHATSAPP_NUMBER, CONTACT_PHONE, CONTACT_EMAIL } from './site-config.js';
import { t } from './i18n.js';
import { icon } from './icons.js';
import { CARD, CARD_MUTED, CARD_FEATURE, BTN_PRIMARY, BTN_SECONDARY, EYEBROW, H2, LEAD, SHELL } from './tokens.js';
import { sectionHead, media, founderSection, proofSection, testimonialsSlot, onTheGroundSection } from './components.js';
import { bookingSuccessBlock } from './chrome.js';
import { pageShell } from './page-shell.js';
import { closingCta } from './page-parts.js';
import { regions, hubs } from '../_content/regions.js';
import { images } from '../_content/images.js';
import { testimonials, commitments } from '../_content/proof.js';
import { services } from '../_content/services.js';
import { insights } from '../_content/insights.js';
import { authorFor } from '../_content/authors.js';
import { homeStats } from '../_content/stats.js';
import { markets } from '../_content/markets.js';
import { faqs } from '../_content/faqs.js';
import { processSteps, qcStages, industries } from '../_content/pages.js';
import { equipmentCategories } from '../_content/equipment.js';
import { slugify, productCard } from './pages-equipment.js';
import { whyChina } from '../_content/pages2.js';

export function homePage(lang) {
  // Counted from the content that renders the site — see _content/stats.js
  // for why the old 10+/50+/200+/98% set was removed. The short version: it
  // claimed 50+ markets on a site that lists five.
  const stats = homeStats.map((st) => [st.labelKey, st.value, st.suffix]);
  const nextSteps = [t(lang, 'bookingNext1'), t(lang, 'bookingNext2'), t(lang, 'bookingNext3')];

  // The three service lines, stated plainly. This replaced a two-tab widget:
  // tabs hid half the offering behind a click, on the one section a first-time
  // visitor most needs to read in full.
  const coreServices = [
    { icon: 'globe', img: 'sourcing', title: t(lang, 'service1'), body: t(lang, 'service1Desc'), href: 'services.html#sourcing',
      points: ['Verified-supplier shortlisting', 'Price benchmarking and negotiation', 'Freight and customs documentation'] },
    { icon: 'check', img: 'qualityControl', title: t(lang, 'qcTitle'), body: t(lang, 'qcLead'), href: 'quality-control.html',
      points: ['Incoming materials check', 'During-production inspection', 'Pre-shipment and loading checks'] },
    { icon: 'calendar', img: 'factorySetup', title: t(lang, 'service2'), body: t(lang, 'service2Desc'), href: 'services.html#factory-setup',
      points: ['Site selection and feasibility', 'Machinery sourcing', 'Commissioning support'] },
  ];

  const body = `
  <!-- HERO. Headline and calls to action on the left, a real factory photo on
       the right. Search lives in the header on every page, as on the reference. -->
  <section class="rh">
    <div class="${SHELL}">
      <div class="rh-grid">
        <div>
          <h1 class="rh-title">The right factory.<br /><em>The right result.</em></h1>
          <p class="rh-lead">We help ambitious businesses buy from China with clarity: the right supplier, quality checked before shipment, and one accountable lead from first brief to final delivery.</p>
          <div class="rh-actions">
            <button data-open-booking class="${BTN_PRIMARY} btn-lg">Start a conversation ${icon('chevronRight', 'w-4 h-4 btn-arrow')}</button>
            <a href="equipment.html" class="${BTN_SECONDARY} btn-lg">Explore equipment ${icon('chevronRight', 'w-4 h-4 btn-arrow')}</a>
          </div>
        </div>
        <div class="rh-visual">
          ${media('hero', { ratio: '4-3', eager: true, sizes: '(min-width: 900px) 48vw, 100vw' })}
          <div class="rh-tag"><strong>On the ground in China</strong>Built for the details between the quote and the shipment.</div>
        </div>
      </div>
    </div>
  </section>

  <!-- STAT STRIP: gold icon, number, label — the same four derived/confirmed
       figures as before (see _content/stats.js), laid out as in the reference. -->
  <section class="rs">
    <div class="${SHELL}">
      <div class="rs-grid">
        ${stats
          .map(([key, value, suffix]) => {
            const ic = { statFactories: 'factory', statStages: 'shield', statServices: 'cog', statResponse: 'clock', statYears: 'award', statProjects: 'briefcase', statSatisfaction: 'users', statMarkets: 'globe' }[key] || 'check';
            return `<div class="rs-item">
          <span class="rs-icon">${icon(ic, 'w-7 h-7')}</span>
          <span><span class="rs-value"><span data-counter="${value}" data-counter-suffix="${suffix}">${value}${suffix}</span></span><span class="rs-label">${t(lang, key)}</span></span>
        </div>`;
          })
          .join('')}
      </div>
    </div>
  </section>

  <!-- THREE SERVICE PILLARS: colour-topped cards, one per service line. -->
  <section id="pillars" class="section bg-gray-bg">
    <div class="${SHELL}">
      <h2 class="r-title">What we do for you</h2>
      <p class="r-sub">${t(lang, 'servicesSubtitle')}</p>
      <div data-reveal-group class="rp-grid">
        ${coreServices
          .map((sv, i) => {
            const tone = ['', 'rp-blue', 'rp-green'][i];
            const ic = ['box', 'shield', 'cog'][i];
            const label = ['Sourcing', 'Quality control', 'Factory setup'][i];
            return `<a href="${sv.href}" class="rp ${tone}">
          <span class="rp-head">${icon(ic, '')}<span><span class="rp-label">${label}</span><span class="rp-title">${sv.title}</span></span></span>
          <p class="rp-body">${sv.body}</p>
          <ul class="rp-list">
            ${sv.points.map((pt) => `<li>${icon('check', '')}<span>${pt}</span></li>`).join('')}
          </ul>
          <span class="rp-link">${t(lang, 'ctaLearnMore')} →</span>
        </a>`;
          })
          .join('')}
      </div>
    </div>
  </section>

  <!-- EQUIPMENT TILES: one photographed example per category, coloured label
       band as in the reference. Every tile links to its category on the full
       catalogue, which carries every line. -->
  <section id="machines" class="section bg-white">
    <div class="${SHELL}">
      <h2 class="r-title">Machines we source</h2>
      <p class="r-sub">${t(lang, 'equipmentHomeLead')}</p>
      <div data-reveal-group class="rt-grid">
        ${equipmentCategories
          .map((cat) => [cat, cat.items.find((i) => i.image)])
          .filter(([, item]) => item)
          .slice(0, 8)
          .map(
            ([cat, item]) => `<a href="equipment.html#${slugify(cat.industry)}" class="rt">
          ${media({ src: item.image, file: item.image, alt: item.use }, { ratio: '4-3', sizes: '(min-width: 900px) 22vw, 46vw' })}
          <span class="rt-label">${icon('bolt', '')}<span>${item.name}</span></span>
        </a>`
          )
          .join('')}
      </div>
      <a href="equipment.html" class="${BTN_PRIMARY} r-more">${t(lang, 'equipmentViewAllCta')} ${icon('chevronRight', 'w-4 h-4 btn-arrow')}</a>
    </div>
  </section>

  <!-- 2. HOW IT WORKS. Anchor target for the hero's secondary CTA. -->
  <section id="how-it-works" class="section bg-white">
    <div class="${SHELL}">
      ${sectionHead(t(lang, 'navProcess'), t(lang, 'processTitle'), t(lang, 'processLead'), { align: 'start', index: '02' })}
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
      <div class="text-center mt-10"><a href="process.html" class="${BTN_SECONDARY}">${t(lang, 'ctaLearnMore')}<span class="sr-only"> — ${t(lang, 'navProcess')}</span> ${icon('chevronRight', 'w-4 h-4 btn-arrow')}</a></div>
    </div>
  </section>

  <!-- 3. COMMITMENTS. Stands in for testimonials until there are real ones:
       every line is a promise that can be checked, not a claim about quality. -->
  <section id="why" class="section bg-gray-bg">
    <div class="${SHELL}">
      <h2 class="r-title">${t(lang, 'commitTitle')}</h2>
      <p class="r-sub">${t(lang, 'commitLead')}</p>
      <div data-reveal-group class="rw-grid">
        ${commitments
          .map(
            (c) => `<div class="rw">
          ${icon(c.icon, '')}
          <h3>${c.title}</h3>
          <p>${c.body}</p>
        </div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  ${founderSection(lang, { compact: true })}

  ${onTheGroundSection(lang)}

  ${proofSection(lang)}

  ${testimonialsSlot(lang)}


  ${closingCta(lang)}`;

  // @graph so one script can carry several entity types.
  //
  // FAQPage used to live here too, built from the same faqs[] rendered as a
  // visible accordion further down the page. The homepage simplification
  // that cut that accordion (fewer sections, faster path to a quote) removed
  // the visible answers it was mirroring — keeping the schema after that
  // would be exactly the visible/markup mismatch this comment used to warn
  // against avoiding. The FAQPage entity still ships correctly on faq.html,
  // where the questions are still real, visible content.
  const jsonLd = {
    '@graph': [
      {
        '@type': 'LocalBusiness',
        name: 'ENZ INTERNATIONAL',
        url: `${SITE_URL}/${lang}/`,
        image: `${SITE_URL}/assets/images/og-cover.png`,
        telephone: '+86-1320-384-0456',
        email: CONTACT_EMAIL,
        address: { '@type': 'PostalAddress', streetAddress: 'Unit 409-1, No. 4-6 Chuangjia Road, Baiyun District', addressLocality: 'Guangzhou', addressRegion: 'Guangdong', addressCountry: 'CN' },
        areaServed: regions.map((r) => r.name),
      },
    ],
  };

  return pageShell({ lang, page: 'index.html', title: t(lang, 'homeSeoTitle'), description: t(lang, 'heroSub'), jsonLd, bodyHTML: body });
}

export function aboutPage(lang) {
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
  <section class="about-hero section section-feature">
    <div class="${SHELL} grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
      <div class="lg:col-span-7">
        <p class="eyebrow">${t(lang, 'navAbout')} · China to East Africa</p>
        <h1 class="h1-display mt-5">${t(lang, 'aboutTitle')}</h1>
        <p class="lead mt-7 max-w-2xl">${t(lang, 'aboutDesc')}</p>
        <p class="text-slate text-lg leading-relaxed mt-5 max-w-2xl">We work as an extension of your team on the ground in China and East Africa, turning a purchase order or a factory blueprint into a delivered, working result. One point of contact owns the details from first call to final delivery.</p>
        <div class="flex flex-col sm:flex-row gap-3 mt-9">
          <button data-open-booking class="${BTN_PRIMARY} btn-lg">${t(lang, 'ctaBooking')}${icon('chevronRight', 'w-4 h-4 btn-arrow')}</button>
          <a href="#how-we-work" class="${BTN_SECONDARY} btn-lg">See how we work</a>
        </div>
        <div class="about-signal-row mt-12" aria-label="ENZ operating model">
          <div><strong>China</strong><span>Supplier access</span></div>
          <div><strong>4 stages</strong><span>Quality control</span></div>
          <div><strong>1 lead</strong><span>Clear ownership</span></div>
        </div>
      </div>
      <div class="lg:col-span-5 about-hero-visual">
        ${media('about', { ratio: '4-5', className: 'about-hero-image', eager: true })}
        <div class="about-hero-note"><span class="status-dot status-done">${icon('check', 'w-3.5 h-3.5')}</span><span><strong>Built for the handover</strong><small>From factory floor to final mile</small></span></div>
      </div>
    </div>
  </section>

  <section class="section bg-white" id="how-we-work">
    <div class="${SHELL}">
      <div class="grid lg:grid-cols-12 gap-8 lg:gap-16 items-end">
        <div class="lg:col-span-5"><p class="eyebrow">The ENZ model</p><h2 class="h2-section mt-4">One operating layer between you and the complexity.</h2></div>
        <p class="lead lg:col-span-7">Buying across borders is not one task. It is a chain of decisions where a missed detail at the factory becomes a cost at the port. We keep that chain visible, owned, and moving.</p>
      </div>
      <div class="about-flow mt-14" data-reveal-group>
        ${[
          ['01', 'Brief', 'Your product, volume, target market, timeline, and tolerance become one shared scope.', 'mail'],
          ['02', 'Source', 'The right manufacturing cluster and a shortlist of suppliers are identified for the brief.', 'globe'],
          ['03', 'Control', 'Samples, production, packing, and loading are checked while corrections are still possible.', 'check'],
          ['04', 'Deliver', 'Freight, documents, customs, and the next order stay connected through one accountable lead.', 'mapPin'],
        ].map(([n, ttl, desc, ic]) => `<article class="about-flow-step"><span class="about-flow-number">${n}</span><span class="icon-chip">${icon(ic, 'w-5 h-5')}</span><h3 class="text-xl font-semibold text-ink mt-6">${ttl}</h3><p class="text-slate text-sm leading-relaxed mt-3">${desc}</p></article>`).join('')}
      </div>
    </div>
  </section>

  <section class="section bg-gray-bg">
    <div class="shell">
      <div class="grid lg:grid-cols-12 gap-8 items-end"><div class="lg:col-span-5"><p class="eyebrow">What we own</p><h2 class="h2-section mt-4">What We Handle End-to-End</h2></div><p class="lead lg:col-span-7">Six capabilities that cover the full path from a first product brief to a shipped, working result.</p></div>
      <div data-reveal-group class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 max-w-6xl mx-auto">
        ${capabilities.map(([ttl, desc, ic], idx) => `<div class="${CARD_MUTED} card-lg about-capability"><span class="about-capability-index">0${idx + 1}</span>${icon(ic, 'w-8 h-8 text-brand mb-5')}<h3 class="font-semibold text-ink">${ttl}</h3><p class="text-slate text-sm mt-2.5 leading-relaxed">${desc}</p><span class="link-arrow text-sm mt-6">Explore capability ${icon('chevronRight', 'w-4 h-4')}</span></div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section bg-gray-bg">
    <div class="shell">
      <h2 class="h2-section text-center">Our Methodology</h2>
      <div data-reveal-group class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-14 max-w-5xl mx-auto">
        ${methodology.map(([n, ttl, desc, ic]) => `<div class="${CARD} relative">${icon(ic, 'w-6 h-6 text-brand mb-3')}<span class="absolute top-6 right-6 deco-num font-semibold text-4xl tabular" aria-hidden="true">${n}</span><h3 class="text-lg font-semibold text-ink mt-4">${ttl}</h3><p class="text-slate text-sm mt-2.5 leading-relaxed">${desc}</p></div>`).join('')}
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
  <section class="section section-feature">
    <div class="${SHELL} max-w-4xl">
      ${sectionHead(t(lang, 'whyChinaEyebrow'), whyChina.title, whyChina.lead)}
      <div data-reveal-group class="grid gap-4 md:grid-cols-2 mt-14">
        <div class="${CARD_FEATURE} card-lg">
          <h3 class="font-medium text-ink">${t(lang, 'whyChinaPros')}</h3>
          <ul class="mt-5 space-y-3">
            ${whyChina.pros.map((x) => `<li class="check-item">${icon('check', 'w-4 h-4')}<span>${x}</span></li>`).join('')}
          </ul>
        </div>
        <div class="${CARD_FEATURE} card-lg">
          <h3 class="font-medium text-ink">${t(lang, 'whyChinaCons')}</h3>
          <ul class="mt-5 space-y-3">
            ${whyChina.cons.map((x) => `<li class="check-item">${icon('chevronRight', 'w-4 h-4 text-accent')}<span>${x}</span></li>`).join('')}
          </ul>
        </div>
      </div>
      <p class="note-accent mt-10">${whyChina.note}</p>
    </div>
  </section>

  ${founderSection(lang)}

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

export function servicesPage(lang) {
  const engagementModels = [
    ['Single Sourcing Project', 'One product, one order. Ideal for testing a new supplier relationship or a one-off procurement need.', 'First-time buyers, sample orders, seasonal purchases', 'briefcase'],
    ['Ongoing Retainer', 'Continuous sourcing and quality control across multiple SKUs and repeat orders, with a dedicated point of contact.', 'Growing brands with recurring purchase cycles', 'calendar'],
    ['Full Factory Partnership', 'End-to-end factory establishment plus ongoing operational and sourcing support after commissioning.', 'Businesses localizing production in a new market', 'award'],
  ];

  const jumpNav = services.map((s) => `<a href="${s.slug}.html" class="btn btn-secondary btn-sm">${t(lang, s.titleKey)}</a>`).join('');

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
          <div class="mt-9 flex flex-wrap gap-3">
            <a href="${service.slug}.html" class="${BTN_PRIMARY} px-7 py-3.5 inline-flex items-center gap-2">${t(lang, 'ctaLearnMore')}<span class="sr-only"> about ${t(lang, service.titleKey)}</span> ${icon('chevronRight', 'w-4 h-4')}</a>
            <button data-open-booking class="btn btn-secondary px-7 py-3.5 inline-flex items-center gap-2">${icon('calendar', 'w-4 h-4')} ${t(lang, 'ctaBooking')}</button>
          </div>
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
  <section class="section section-feature">
    <div class="shell">
      <div class="text-center max-w-2xl mx-auto"><h2 class="h2-section">How We Can Work Together</h2><p class="lead mt-4">Three engagement models, scoped to how much of the process you want us to own.</p></div>
      <div data-reveal-group class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 max-w-5xl mx-auto">
        ${engagementModels
          .map(
            ([ttl, desc, fits, ic]) =>
              `<div class="${CARD_FEATURE}">${icon(ic, 'w-8 h-8 text-brand mb-4')}<h3 class="font-semibold text-ink">${ttl}</h3><p class="text-slate text-sm mt-2.5 leading-relaxed">${desc}</p><p class="text-brand text-xs mt-5 font-semibold uppercase tracking-wider">Best for</p><p class="text-slate text-sm mt-1.5">${fits}</p></div>`
          )
          .join('')}
      </div>
      <div class="text-center mt-14">
        <button data-open-booking class="${BTN_PRIMARY} px-9 py-4 inline-flex items-center gap-2">${icon('calendar', 'w-5 h-5')} ${t(lang, 'ctaBooking')}</button>
        <p class="text-slate text-sm mt-5">Have questions first? <a href="contact.html" class="text-brand hover:underline underline-offset-4">See our FAQ</a></p>
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

export function marketsPage(lang) {
  const cards = markets
    .map((m) => `<a href="${m.slug}.html" class="${CARD_MUTED} flex items-start gap-4"><span class="step-badge step-badge-lg">${m.region}</span><div><h2 class="font-semibold text-ink">${m.name}</h2><p class="text-sm text-slate mt-1">${m.heroLine}</p></div>${icon('chevronRight', 'w-5 h-5 text-slate-light ml-auto shrink-0 self-center')}</a>`)
    .join('');

  const detailSections = markets
    .map(
      (m, idx) => `
    <section id="market-${m.slug}" class="section scroll-mt-24 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-bg'}">
      <div class="shell max-w-3xl text-center">
        <span class="pill">${m.region} · ${m.fullName || m.name}</span>
        <h2 class="h2-section mt-5">${m.heroLine}</h2>
        <p class="text-slate mt-5 leading-relaxed">${m.intro}</p>
        <div class="mt-7 flex flex-wrap gap-3 justify-center">
          <a href="${m.slug}.html" class="${BTN_PRIMARY} px-7 py-3.5 inline-flex items-center gap-2">${t(lang, 'ctaLearnMore')}<span class="sr-only"> about ${m.fullName || m.name}</span> ${icon('chevronRight', 'w-4 h-4')}</a>
          <button data-open-booking class="btn btn-secondary px-7 py-3.5 inline-flex items-center gap-2">${icon('calendar', 'w-4 h-4')} ${t(lang, 'ctaBooking')}</button>
        </div>
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

export function insightsListPage(lang) {
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

export function insightPostPage(lang, post) {
  const page = `insight-${post.slug}.html`;

  // ---- author ------------------------------------------------------------
  // Defaults to the organisation. Set `byline` in _content/authors.js to
  // 'founder' to credit a named person instead — see the warning in that file
  // about what a byline actually asserts.
  const author = authorFor(post);
  const authorEntity =
    author.kind === 'person'
      ? {
          '@type': 'Person',
          name: author.name,
          jobTitle: author.role,
          worksFor: { '@id': `${SITE_URL}/#organization` },
          knowsAbout: author.knowsAbout,
          ...(author.linkedin ? { sameAs: [author.linkedin] } : {}),
        }
      : { '@id': `${SITE_URL}/#organization` };

  const authorBox =
    author.kind === 'person'
      ? `
      <aside class="${CARD} mt-14 flex items-start gap-5">
        ${
          author.photo
            ? `<img src="../assets/images/${author.photo}" alt="${author.photoAlt || author.name}" width="64" height="64" loading="lazy" decoding="async" class="w-16 h-16 rounded-full object-cover shrink-0" />`
            : `<span aria-hidden="true" class="w-16 h-16 rounded-full bg-brand text-white grid place-items-center text-xl font-semibold shrink-0">${author.initials}</span>`
        }
        <div>
          <p class="text-xs uppercase tracking-wider text-slate font-semibold">${t(lang, 'insightsPublished')}</p>
          <p class="font-semibold text-ink mt-1">${author.name}${author.role ? ` — ${author.role}` : ''}</p>
          ${author.location ? `<p class="text-sm text-slate mt-0.5">${author.location}</p>` : ''}
          ${(author.bio || []).map((p) => `<p class="text-sm text-slate mt-3 leading-relaxed">${p}</p>`).join('')}
          <a href="about.html" class="text-brand text-sm font-medium mt-4 inline-flex items-center gap-1.5">${t(lang, 'navAbout')} ${icon('chevronRight', 'w-4 h-4')}</a>
        </div>
      </aside>`
      : '';

  // ---- related articles --------------------------------------------------
  // Each article previously ended at "back to list", so a reader who finished
  // one had exactly one place to go and the other articles had a single
  // inbound link each. Linking siblings spreads that and keeps a reader who is
  // already engaged on the site.
  const siblings = insights.filter((p) => p.slug !== post.slug).slice(0, 3);
  const relatedSection = siblings.length
    ? `
  <section class="section bg-gray-bg">
    <div class="shell max-w-4xl">
      <h2 class="h2-section text-center">${t(lang, 'insightsTitle')}</h2>
      <div class="grid grid-cols-1 md:grid-cols-${Math.min(siblings.length, 3)} gap-6 mt-10">
        ${siblings
          .map(
            (p) => `<a href="insight-${p.slug}.html" class="${CARD_FEATURE}">
              <span class="pill">${p.category}</span>
              <h3 class="font-semibold text-ink mt-4 leading-snug">${p.title}</h3>
              <p class="text-slate text-sm mt-2.5 leading-relaxed">${p.excerpt}</p>
              <span class="text-brand text-sm font-medium mt-5 inline-flex items-center gap-1.5">${t(lang, 'ctaLearnMore')} ${icon('chevronRight', 'w-4 h-4')}</span>
            </a>`
          )
          .join('')}
      </div>
    </div>
  </section>`
    : '';

  const body = `
  <article class="section bg-white">
    <div class="shell max-w-3xl">
      <span class="pill">${post.category}</span>
      <h1 class="h1-display text-ink mt-5">${post.title}</h1>
      <div class="text-sm text-slate mt-5 flex items-center gap-2"><span>${t(lang, 'insightsPublished')}</span><time datetime="${post.publishedDate}">${post.publishedDate}</time><span aria-hidden="true">·</span><span>${post.readTime} ${t(lang, 'insightsReadTime')}</span></div>
      <div class="mt-12 space-y-7">${post.body.map((para) => `<p >${para}</p>`).join('')}</div>
      ${authorBox}
      <a href="insights.html" class="inline-flex items-center gap-2 mt-14 text-ink font-medium hover:text-brand transition">${icon('arrowLeft', 'w-4 h-4')} ${t(lang, 'insightsBackToList')}</a>
    </div>
  </article>
  ${relatedSection}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedDate,
    // dateModified matters to Google and defaults to the publish date rather
    // than today's — claiming an article was updated when it was not is the
    // same class of untruth as a sitemap that stamps everything with the
    // current date.
    dateModified: post.updatedDate || post.publishedDate,
    inLanguage: lang,
    isAccessibleForFree: true,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/${lang}/insight-${post.slug}/` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    author: authorEntity,
  };

  return pageShell({ lang, page, title: post.title, description: post.excerpt, jsonLd, crumbs: [{ label: t(lang, 'navInsights'), href: 'insights.html' }, { label: post.title }], bodyHTML: body });
}

export function contactPage(lang) {
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
        <!-- Click to load: the Google map is heavy and sets Google cookies, so it
             only loads when a visitor asks for it. The link works without script. -->
        <div data-map class="mt-6 rounded-2xl overflow-hidden border border-line shadow-sm h-64 bg-gray-bg flex flex-col items-center justify-center text-center gap-3 p-6">
          ${icon('mapPin', 'w-7 h-7 text-brand')}
          <p class="text-sm text-slate max-w-xs">${t(lang, 'contactAddress')}</p>
          <div class="flex flex-wrap items-center justify-center gap-2">
            <button type="button" data-map-load class="btn btn-secondary btn-sm">Show map</button>
            <a href="https://www.google.com/maps/search/?api=1&query=%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%B9%BF%E5%B7%9E%E5%B8%82%E7%99%BD%E4%BA%91%E5%8C%BA%E5%88%9B%E4%BD%B3%E8%B7%AF4-6%E5%8F%B7" target="_blank" rel="noopener noreferrer" class="btn btn-sm text-brand">Open in Google Maps</a>
          </div>
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
        ${bookingSuccessBlock(lang)}
      </div>
    </div>
  </section>
  <section class="section bg-gray-bg">
    <div class="shell">
      <h2 class="h2-section text-center mb-14">${t(lang, 'faqTitle')}</h2>
      <div class="max-w-3xl mx-auto divide-y divide-gray-200 border-t border-b border-line">${faqItems}</div>
    </div>
  </section>`;

  // LocalBusiness belongs here as much as on the home page — this is the page
  // that carries the address, the phone number and the hours, and it is the
  // one a "China sourcing agent near me" style query should be able to resolve
  // to. The FAQPage entity mirrors the questions actually rendered above.
  const jsonLd = {
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/${lang}/contact/#localbusiness`,
        name: 'ENZ INTERNATIONAL',
        url: `${SITE_URL}/${lang}/contact/`,
        image: `${SITE_URL}/assets/images/og-cover.png`,
        logo: `${SITE_URL}/assets/images/enz-logo.png`,
        telephone: '+86-1320-384-0456',
        email: CONTACT_EMAIL,
        address: { '@type': 'PostalAddress', streetAddress: 'Unit 409-1, No. 4-6 Chuangjia Road, Baiyun District', addressLocality: 'Guangzhou', addressRegion: 'Guangdong', addressCountry: 'CN' },
        areaServed: regions.map((r) => ({ '@type': 'Country', name: r.name })),
        parentOrganization: { '@id': `${SITE_URL}/#organization` },
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          email: CONTACT_EMAIL,
          telephone: '+86-1320-384-0456',
          availableLanguage: ['en', 'sw', 'fr', 'zh'],
        },
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

  return pageShell({ lang, page: 'contact.html', title: t(lang, 'contactTitle'), description: t(lang, 'contactSubtitle'), jsonLd, crumbs: [{ label: t(lang, 'navContact') }], bodyHTML: body });
}

// A page for people ENZ has already worked with. Linked from messages we send
// to clients (see the "Ask a client" box in the admin), never from the site's
// own navigation, and noindex.
export function feedbackPage(lang) {
  const field = (id, name, labelKey, extra = '') =>
    `<div><label for="${id}" class="field-label">${t(lang, labelKey)}</label><input id="${id}" name="${name}" type="text" class="field" ${extra} /></div>`;

  const body = `
  <section class="section bg-white">
    <div class="shell max-w-3xl text-center">
      <h1 class="h1-display text-ink">${t(lang, 'feedbackTitle')}</h1>
      <p class="lead mt-6">${t(lang, 'feedbackSubtitle')}</p>
    </div>
  </section>
  <section class="section pt-0 bg-white">
    <div class="shell max-w-xl">
      <form data-feedback-form class="card card-lg space-y-5">
        <h2 class="font-semibold text-ink">${t(lang, 'feedbackFormTitle')}</h2>
        <div><label for="fb-name" class="field-label" data-required>${t(lang, 'bookingName')}</label><input id="fb-name" name="name" type="text" required autocomplete="name" class="field" /></div>
        <div>
          <label for="fb-email" class="field-label" data-required>${t(lang, 'bookingEmail')}</label>
          <input id="fb-email" name="email" type="email" required autocomplete="email" class="field" aria-describedby="fb-email-hint" />
          <p id="fb-email-hint" class="text-xs text-slate mt-1.5">${t(lang, 'feedbackEmailHint')}</p>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          ${field('fb-role', 'role', 'feedbackRole', 'autocomplete="organization-title"')}
          ${field('fb-company', 'company', 'feedbackCompany', 'autocomplete="organization"')}
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          ${field('fb-country', 'country', 'feedbackCountry', 'autocomplete="country-name"')}
          <div>
            <label for="fb-project" class="field-label">${t(lang, 'feedbackProject')}</label>
            <input id="fb-project" name="project" type="text" class="field" aria-describedby="fb-project-hint" />
          </div>
        </div>
        <p id="fb-project-hint" class="text-xs text-slate -mt-3">${t(lang, 'feedbackProjectHint')}</p>
        <div>
          <label for="fb-quote" class="field-label" data-required>${t(lang, 'feedbackQuote')}</label>
          <textarea id="fb-quote" name="quote" rows="6" required minlength="30" maxlength="1500" class="field" aria-describedby="fb-quote-hint"></textarea>
          <p id="fb-quote-hint" class="text-xs text-slate mt-1.5">${t(lang, 'feedbackQuoteHint')}</p>
        </div>
        <fieldset class="space-y-2.5">
          <legend class="sr-only">${t(lang, 'feedbackShowNamed')} / ${t(lang, 'feedbackShowAnon')}</legend>
          <label class="flex items-start gap-3 text-sm text-ink cursor-pointer"><input type="radio" name="display" value="named" checked class="mt-1" /><span>${t(lang, 'feedbackShowNamed')}</span></label>
          <label class="flex items-start gap-3 text-sm text-ink cursor-pointer"><input type="radio" name="display" value="anonymous" class="mt-1" /><span>${t(lang, 'feedbackShowAnon')}</span></label>
        </fieldset>
        <label class="flex items-start gap-3 text-sm text-slate cursor-pointer pt-1"><input type="checkbox" name="consent" required class="mt-1" /><span>${t(lang, 'feedbackConsent')}</span></label>
        <p data-error-slot role="alert" hidden class="text-sm text-red-600">${t(lang, 'bookingErrorTitle')} — ${t(lang, 'bookingErrorDesc')}</p>
        <button type="submit" data-submitting-label="${t(lang, 'bookingSubmitting')}" class="w-full ${BTN_PRIMARY} py-4">${t(lang, 'feedbackSubmit')}</button>
      </form>
      <div data-feedback-success role="status" hidden class="card card-lg text-center">
        <div class="icon-chip w-12 h-12 rounded-full mx-auto">${icon('check', 'w-6 h-6')}</div>
        <p class="text-lg font-semibold text-ink mt-4">${t(lang, 'feedbackThanksTitle')}</p>
        <p class="text-sm text-slate mt-2">${t(lang, 'feedbackThanksDesc')}</p>
        <div data-handoff-note hidden>
          <p class="text-sm text-slate mt-2">${t(lang, 'bookingHandoffDesc')}</p>
        </div>
      </div>
      <div class="mt-8">
        <p class="eyebrow text-slate">${t(lang, 'feedbackNoteTitle')}</p>
        <ol class="mt-3 space-y-2 text-sm text-slate list-decimal pl-5">
          <li>${t(lang, 'feedbackNote1')}</li><li>${t(lang, 'feedbackNote2')}</li><li>${t(lang, 'feedbackNote3')}</li>
        </ol>
      </div>
    </div>
  </section>`;
  return pageShell({
    lang,
    page: 'feedback.html',
    title: t(lang, 'feedbackNavTitle'),
    description: t(lang, 'feedbackSubtitle'),
    crumbs: [{ label: t(lang, 'feedbackNavTitle') }],
    bodyHTML: body,
    robots: 'noindex, follow',
  });
}

export function careersPage(lang) {
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
