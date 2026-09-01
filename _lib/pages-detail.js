// Reference and detail pages.
//
// Process, industries, quality control, logistics, FAQ, resources, pricing and
// the legal pages. These are the depth behind the main navigation: the pages
// that answer a specific question a buyer has before they will enquire.
//
// They change far less often than the primary pages, which is the reason for
// the split - it keeps the file you are most likely to edit small.
import { CONTACT_EMAIL } from './site-config.js';
import { t } from './i18n.js';
import { icon } from './icons.js';
import { CARD, BTN_SECONDARY, H2, LEAD, SHELL } from './tokens.js';
import { sectionHead, handoverDiagram, engagementCard } from './components.js';
import { pageShell } from './page-shell.js';
import { pageHero, closingCta } from './page-parts.js';
import { services } from '../_content/services.js';
import { faqs } from '../_content/faqs.js';
import { engagementModels, pricingFactors, gettingStarted } from '../_content/narrative.js';
import { processSteps, qcStages, aqlExplainer, incoterms, shippingDocs, industries, comparison, resources } from '../_content/pages.js';
import { landedCost, commonMistakes, paymentTerms, timelines, glossary } from '../_content/pages2.js';

export function processPage(lang) {
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

export function industriesPage(lang) {
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

export function qualityControlPage(lang) {
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

export function logisticsPage(lang) {
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
      ${handoverDiagram(lang)}
      <div class="mt-14 space-y-4">${terms}</div>
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

export function faqPage(lang) {
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
export function resourcesPage(lang) {
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
export function pricingPage(lang) {
  const body = `
  ${pageHero(lang, { eyebrow: t(lang, 'engageEyebrow'), title: t(lang, 'pricingTitle'), lead: t(lang, 'pricingLead') })}

  <section class="section bg-white">
    <div class="${SHELL}">
      <!-- The cards below are h3s, so this h2 is what stops the page jumping
           straight from h1 to h3 — a heading level a screen-reader user hears
           as a missing section. -->
      ${sectionHead(null, t(lang, 'engageTitle'), t(lang, 'engageLead'), { align: 'start' })}
      <div data-reveal-group class="grid lg:grid-cols-3 gap-5 items-start mt-12">
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

export function legalPage(lang, type) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? t(lang, 'footerPrivacy') : t(lang, 'footerTerms');
  const content = isPrivacy
    ? `<p>ENZ INTERNATIONAL ("we", "us") collects information you provide directly — such as your name, email, and project details submitted through our consultation and newsletter forms — in order to respond to your enquiry and, where you've opted in, send occasional updates.</p>
       <h2 >What we collect</h2><p>Contact-form and booking submissions, newsletter sign-up emails, and — once analytics tooling is connected — standard usage data.</p>
       <h2 >How your submission reaches us</h2><p>This website has no server of its own. When you submit a form, the details you typed are passed to a third-party form-delivery service, which relays them to our inbox as an email. That provider processes your submission only to deliver it, and may retain it briefly so a message is not lost in transit. We do not sell what you send us, and we do not use it for anything other than responding to your enquiry.</p>
       <h2 >Your rights</h2><p>You may have the right to access, correct, or delete your data, or withdraw consent for marketing emails at any time.</p>
       <h2 >Contact</h2><p>Questions can be sent to <a href="mailto:${CONTACT_EMAIL}" class="text-brand hover:underline">${CONTACT_EMAIL}</a>.</p>`
    : `<p>These terms govern your use of the ENZ INTERNATIONAL website. By using this site, you agree to use it only for lawful purposes.</p>
       <h2 >No binding offer</h2><p>Content on this site is informational and does not constitute a binding offer. Engagements are governed by separately signed contracts.</p>
       <h2 >Contact</h2><p>Questions can be sent to <a href="mailto:${CONTACT_EMAIL}" class="text-brand hover:underline">${CONTACT_EMAIL}</a>.</p>`;

  const body = `
  <section class="section bg-white">
    <div class="shell max-w-3xl">
      <h1 class="h2-section">${title}</h1>
      <p class="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 mb-9">Placeholder text — not reviewed by counsel. Replace before launch.</p>
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
