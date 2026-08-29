// The homepage's argument, in order: what goes wrong → what we do about it →
// how you engage us → how to start.
//
// This file exists because that argument was previously spread across the
// homepage as eight reference sections (Incoterms, landed cost, glossary,
// payment terms…). Those are genuinely useful, but they are things a buyer
// looks up *after* deciding to talk to you — not what answers "what is this
// company and should I contact them?". They now live on the pages built for
// them (resources.html, logistics.html, about.html) and the homepage makes
// the case instead.

// ---------------------------------------------------------------------------
// The problem. Drawn from `commonMistakes` in pages2.js — the same failures,
// stated as the buyer experiences them rather than as advice.
// ---------------------------------------------------------------------------
export const problems = [
  {
    icon: 'shield',
    title: 'You cannot verify who you are buying from',
    body: 'Trading companies present themselves as factories. Platform badges are not verification.',
  },
  {
    icon: 'check',
    title: 'Quality is checked once, too late to fix',
    body: 'One inspection at the end tells you it is wrong once it is made and paid for.',
  },
  {
    icon: 'trendingUp',
    title: 'The quoted price is not the price you pay',
    body: 'Freight, duties and port fees arrive later. A cheap EXW quote often lands dearer than a higher FOB one.',
  },
  {
    icon: 'user',
    title: 'Nobody owns the problem when it goes wrong',
    body: 'Supplier, forwarder and broker each answer for their own leg. The gaps between them are yours.',
  },
];

// ---------------------------------------------------------------------------
// How you engage us. Previously buried at the bottom of services.html; it is
// the question every serious buyer asks second, so it now has a page of its
// own and a summary on the homepage.
//
// No figures here on purpose — see the note in services.js. Publishing rates
// for consulting and trading work without the owner's sign-off would be
// inventing numbers, and a wrong number is worse than an honest "scoped".
// ---------------------------------------------------------------------------
export const engagementModels = [
  {
    icon: 'briefcase',
    name: 'Single sourcing project',
    tagline: 'One product, one order.',
    body: 'Test a new supplier without committing to anything ongoing.',
    bestFor: 'First-time buyers, sample orders, seasonal purchases',
    includes: [
      'Supplier shortlisting and verification',
      'Price benchmarking and negotiation support',
      'Pre-shipment inspection',
      'Freight booking and customs documentation',
    ],
  },
  {
    icon: 'calendar',
    name: 'Ongoing retainer',
    tagline: 'Repeat orders, one team.',
    body: 'Ongoing sourcing and QC across repeat orders, with a contact who knows your spec.',
    bestFor: 'Growing brands with recurring purchase cycles',
    featured: true,
    includes: [
      'Everything in a single project',
      'Dedicated point of contact',
      'Staged QC across every order',
      'Supplier performance tracking over time',
      'Priority scheduling on new briefs',
    ],
  },
  {
    icon: 'award',
    name: 'Full factory partnership',
    tagline: 'Build production, not just orders.',
    body: 'Site selection through commissioning, plus support once you are running.',
    bestFor: 'Businesses localising production in a new market',
    includes: [
      'Feasibility study and site selection',
      'Machinery sourcing and assembly-line planning',
      'Installation and commissioning support',
      'Ongoing sourcing after first production run',
    ],
  },
];

// ---------------------------------------------------------------------------
// What it costs. Honest structure without invented rates: these are the
// variables that move a quote, so a buyer can see what they are being asked
// to describe on the call.
// ---------------------------------------------------------------------------
export const pricingFactors = [
  { label: 'Scope', body: 'Sourcing, sourcing plus logistics, or full factory setup.' },
  { label: 'Order value and volume', body: 'One container and a monthly programme need different oversight.' },
  { label: 'Product complexity', body: 'Standard goods need less verification than custom or regulated ones.' },
  { label: 'Inspection depth', body: 'How many of the four inspection points you want covered.' },
];

// ---------------------------------------------------------------------------
// Getting started. Same three steps as the booking modal's "what happens
// next", expanded — repeated deliberately, because the single most common
// reason a first enquiry never gets sent is not knowing what sending it does.
// ---------------------------------------------------------------------------
export const gettingStarted = [
  {
    n: '01',
    title: 'Tell us what you need',
    body: 'Product, volume, market, timeline. A paragraph is enough.',
    meta: '2 minutes',
  },
  {
    n: '02',
    title: 'We reply within one business day',
    body: 'A person replies with questions, or an honest "not a fit". No drip sequence.',
    meta: '1 business day',
  },
  {
    n: '03',
    title: 'A 30-minute scoping call',
    body: 'What the project involves, and whether we are right for it. Free, no obligation.',
    meta: '30 minutes',
  },
  {
    n: '04',
    title: 'A written scope, then work begins',
    body: 'Scope, cost and timeline in writing. Nothing starts until you agree.',
    meta: 'Before you commit',
  },
];

export default { problems, engagementModels, pricingFactors, gettingStarted };
