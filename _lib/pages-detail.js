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

// Shown on the privacy and terms pages. A policy with no date on it reads as
// abandoned; bump this whenever the wording changes. It is deliberately a
// fixed string rather than today's date — regenerating the site is not the
// same event as revising a policy, and stamping it would claim it was.
const LEGAL_UPDATED = '1 September 2026';

export function legalPage(lang, type) {
  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? t(lang, 'footerPrivacy') : t(lang, 'footerTerms');
  // These describe what this website ACTUALLY does, which is something the
  // code can be checked against rather than something drafted from a template:
  // there is no analytics, no tag manager, no advertising pixel, no cookie of
  // any kind, and no server of our own. That was verified by searching the
  // shipped JavaScript for document.cookie, localStorage, sessionStorage,
  // gtag and analytics — none are present.
  //
  // A short, true policy beats a long, generic one, and the previous version
  // said usage data was collected "once analytics tooling is connected", which
  // described a plan rather than a fact.
  //
  // This is a factual description of the site's data handling, NOT legal
  // advice, and it is not a substitute for review by a qualified adviser —
  // particularly on UK/EU obligations, since you take enquiries from both.
  const content = isPrivacy
    ? `<p>ENZ INTERNATIONAL ("we", "us") collects only what you type into a form on this site — your name, email address, phone number, company and the details of your enquiry — and uses it only to reply to you.</p>
       <h2 >What we collect</h2><p>Consultation and contact form submissions, newsletter sign-up addresses, and career applications. Nothing else. We do not ask for, and have no way to receive, payment details through this website.</p>
       <h2 >What we do not do</h2><p>This site sets <strong>no cookies</strong>. It runs no analytics, no advertising pixels and no third-party tracking scripts, so we do not build a profile of you, follow you across other websites, or know that you visited unless you contact us. Nothing you submit is ever sold or shared for marketing.</p>
       <h2 >How your submission reaches us</h2><p>This website has no server of its own. When you submit a form, what you typed is passed to a third-party form-delivery service which relays it to our inbox as an email, and may hold it briefly so a message is not lost in transit. If that relay is unavailable, the form instead opens your own email application with the enquiry pre-written, and nothing is sent until you press send.</p>
       <h2 >How long we keep it</h2><p>Enquiries stay in our email for as long as we may reasonably need them to deal with your request and any follow-up. Ask us to delete yours and we will.</p>
       <h2 >Your rights</h2><p>You can ask us what we hold about you, ask us to correct or delete it, or withdraw consent for marketing emails at any time — just write to the address below. If you are in the UK or EU you may also complain to your national data protection authority.</p>
       <h2 >Contact</h2><p>Privacy questions and deletion requests: <a href="mailto:${CONTACT_EMAIL}" class="text-brand hover:underline">${CONTACT_EMAIL}</a>.</p>`
    : `<p>These terms govern your use of the ENZ INTERNATIONAL website. By using this site you agree to use it only for lawful purposes.</p>
       <h2 >Nothing here is a binding offer</h2><p>Everything published on this site is informational. Descriptions of services, processes, timelines and inspection stages explain how we work; they are not a quotation, a warranty or a contract. Any engagement is governed solely by a separately signed agreement, and where that agreement and this website disagree, the agreement wins.</p>
       <h2 >No pricing is published</h2><p>We do not publish rates, because the cost of a sourcing, inspection or factory-setup project depends on scope. Any figure you receive from us in writing is the one that applies.</p>
       <h2 >Guidance, not professional advice</h2><p>Our articles and reference pages — including material on Incoterms, AQL sampling, customs documentation and import procedure — are general industry guidance. They are not legal, tax, customs or financial advice, and you should confirm anything that carries risk with a qualified adviser in your own jurisdiction before acting on it.</p>
       <h2 >Third-party links</h2><p>Where we link to another organisation's website we do not control it and are not responsible for its content or its handling of your data.</p>
       <h2 >Contact</h2><p>Questions about these terms: <a href="mailto:${CONTACT_EMAIL}" class="text-brand hover:underline">${CONTACT_EMAIL}</a>.</p>`;

  const body = `
  <section class="section bg-white">
    <div class="shell max-w-3xl">
      <h1 class="h2-section">${title}</h1>
      <p class="text-sm text-slate mb-9">Last updated ${LEGAL_UPDATED}</p>
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
