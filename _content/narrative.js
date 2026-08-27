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
    body: 'Platform badges and self-reported credentials are not verification. Trading companies present themselves as factories, and you find out after the deposit has cleared.',
  },
  {
    icon: 'check',
    title: 'Quality is checked once, too late to fix',
    body: 'A single pre-shipment inspection tells you the order is wrong when it is already made and paid for. By then your options are a discount or a delay.',
  },
  {
    icon: 'trendingUp',
    title: 'The quoted price is not the price you pay',
    body: 'Unit price is a fraction of landed cost. Freight, duties, inspection, and port fees arrive later, and a cheap EXW quote routinely lands dearer than a higher FOB one.',
  },
  {
    icon: 'user',
    title: 'Nobody owns the problem when it goes wrong',
    body: 'A supplier, a forwarder, and a customs broker each answer for their own leg. The gaps between them are where orders stall — and those gaps are yours to manage.',
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
    body: 'Ideal for testing a new supplier relationship or a one-off procurement need, without committing to anything ongoing.',
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
    body: 'Continuous sourcing and quality control across multiple SKUs and repeat order cycles, with a dedicated point of contact who already knows your specification.',
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
    body: 'End-to-end factory establishment — site selection through commissioning — plus ongoing operational and sourcing support once you are running.',
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
  { label: 'Scope', body: 'Sourcing only, sourcing plus logistics, or full factory setup. The more legs we own, the more of the work moves off your desk.' },
  { label: 'Order value and volume', body: 'A single container and a rolling monthly programme need different amounts of oversight, and are priced differently.' },
  { label: 'Product complexity', body: 'Commodity goods to a standard specification take less verification than custom-engineered or regulated products.' },
  { label: 'Inspection depth', body: 'How many of the four inspection points you want covered, and whether the order justifies on-site factory visits.' },
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
    body: 'Product, rough volume, target market, and your timeline. A paragraph is enough — you do not need a finished specification to start.',
    meta: '2 minutes',
  },
  {
    n: '02',
    title: 'We reply within one business day',
    body: 'A person reads it and comes back with either questions or an honest "this is not a fit for us". No drip sequence, no sales cadence.',
    meta: '1 business day',
  },
  {
    n: '03',
    title: 'A 30-minute scoping call',
    body: 'We work out what the project actually involves and whether we are the right people for it. Free, and with no obligation attached.',
    meta: '30 minutes',
  },
  {
    n: '04',
    title: 'A written scope, then work begins',
    body: 'What we will do, what it costs, and how long it takes — in writing. Nothing starts until you have agreed to it.',
    meta: 'Before you commit',
  },
];

export default { problems, engagementModels, pricingFactors, gettingStarted };
