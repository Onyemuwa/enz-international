// Additional landing-page content.
//
// SCOPE RULE (same as pages.js): everything here is either verifiable industry
// standard — Incoterms, HS codes, payment instruments, AQL, PVoC — or a
// description of process. Nothing asserts an ENZ-specific fact that would need
// evidence. Industry knowledge demonstrates expertise honestly; invented
// specifics are a liability the moment a prospect asks you to back one up.

export const landedCost = {
  title: 'What actually makes up your landed cost',
  lead: 'Unit price is usually 50–70% of what you finally pay. A quote compared on unit price alone is a quote compared on the smaller half of the number.',
  items: [
    { label: 'Unit price (EXW/FOB)', body: 'The factory price. The only figure most buyers compare — and therefore the one most easily discounted to win an order that is made back elsewhere.' },
    { label: 'Inland freight in China', body: 'Factory to port. Minor on a full container, disproportionate on a part load moving from an inland province.' },
    { label: 'Export clearance and origin documents', body: 'Export declaration, certificate of origin, and any inspection certificates the destination market requires.' },
    { label: 'Ocean or air freight', body: 'The most volatile line item. Rates move with season, fuel, and capacity — a freight quote three months old is not a quote.' },
    { label: 'Cargo insurance', body: 'Typically a small percentage of cargo value. Cheap relative to the loss it covers, and routinely skipped.' },
    { label: 'Import duty and VAT', body: 'Driven by HS code and destination. Misclassification is common and expensive, because it triggers penalties rather than simple corrections.' },
    { label: 'Port, handling, and demurrage', body: 'Terminal handling, customs examination fees, and storage if clearance stalls. Demurrage accrues daily and is almost entirely avoidable with correct paperwork.' },
    { label: 'Final-mile delivery', body: 'Port to your warehouse, including special handling for oversized, fragile, or hazardous goods.' },
  ],
  note: 'A landed-cost estimate before you commit is worth more than a lower unit price after you have.',
};

export const commonMistakes = [
  { title: 'Comparing quotes on different Incoterms', body: 'An EXW quote and a DDP quote are not comparable numbers. Normalise every quote to the same term first, or you will pick the most expensive supplier believing it is the cheapest.' },
  { title: 'Paying a deposit to an unverified supplier', body: 'A 30% deposit to a company you have not verified is 30% at risk. Verification costs a fraction of that and takes days, not weeks.' },
  { title: 'Skipping the pre-production sample', body: 'Approving a catalogue photo rather than a sample built to your specification. Whatever you approve becomes the reference every later inspection is judged against.' },
  { title: 'Ignoring the Chinese New Year calendar', body: 'Factories close for two to four weeks and run hot for weeks either side. Orders placed in the wrong window ship late regardless of what was promised.' },
  { title: 'Mistaking a trading company for a factory', body: 'Both are legitimate and both have their place. Problems start when you believe you are speaking to the factory and you are not — pricing and quality control work differently.' },
  { title: 'Accepting an under-declared invoice value', body: 'Sometimes offered by a supplier as a favour to reduce your duty. It is customs fraud in your market, and the liability sits with the importer of record — you.' },
];

export const paymentTerms = [
  { code: 'T/T', name: 'Telegraphic transfer', body: 'A bank wire, commonly 30% deposit with the balance before shipment. Fast and cheap, but offers little recourse once sent — which is exactly why the balance should be tied to a passed inspection rather than a promised date.' },
  { code: 'L/C', name: 'Letter of credit', body: 'A bank guarantees payment against presented documents. Strong protection on large orders, at the cost of bank fees and strict document discipline — a single discrepancy can hold payment.' },
  { code: 'D/P', name: 'Documents against payment', body: 'Shipping documents release only on payment, handled bank to bank. A middle ground: cheaper than a letter of credit, more structured than a bare wire.' },
  { code: 'Escrow', name: 'Platform escrow', body: 'Funds held by a marketplace until you confirm receipt. Genuinely useful for small trial orders; rarely practical at container scale.' },
];

export const timelines = {
  title: 'Realistic timelines',
  lead: 'Typical ranges, not promises — complexity, tooling, and season all move them. The value is in planning against honest numbers rather than best-case ones.',
  rows: [
    { phase: 'Supplier shortlisting and verification', typical: '1–2 weeks', note: 'Longer for technical or regulated products' },
    { phase: 'Sampling and revisions', typical: '2–4 weeks', note: 'Each revision round adds roughly a week' },
    { phase: 'Production', typical: '20–45 days', note: 'Highly product-dependent; new tooling adds materially' },
    { phase: 'Inspection and freight booking', typical: '3–7 days', note: 'A failed inspection means rework and rebooking' },
    { phase: 'Ocean transit to East Africa', typical: '25–40 days', note: 'Port to port, before clearance' },
    { phase: 'Customs clearance', typical: '2–10 days', note: 'Clean paperwork is the single biggest variable' },
  ],
};

export const glossary = [
  { term: 'MOQ', def: 'Minimum order quantity — the smallest run a factory will accept. Often negotiable on a first order, usually at a higher unit price.' },
  { term: 'HS code', def: 'Harmonised System code classifying goods for customs. It sets your duty rate, and misclassification carries penalties.' },
  { term: 'Golden sample', def: 'The approved reference unit retained by both parties. Every later inspection is judged against it.' },
  { term: 'LCL / FCL', def: 'Less than container load (shared) versus full container load. LCL costs more per unit of volume and is handled more times.' },
  { term: 'Demurrage', def: 'Daily charges once a container sits at destination beyond its free time. Usually caused by paperwork, not by shipping.' },
  { term: 'PVoC', def: 'Pre-export verification of conformity, required by several African markets before shipment. Missing it means goods are refused at arrival.' },
];

export const whyChina = {
  title: 'Why China — and when the answer is no',
  lead: 'China still has the deepest supplier base, the most complete component ecosystems, and the shortest path from prototype to volume in most categories. That is a real advantage. It is not a universal one.',
  pros: [
    'Component ecosystems mean a supplier can usually source sub-parts locally, which compresses lead time.',
    'Genuine competition at almost every quality tier, so there is real room to negotiate rather than take a price.',
    'Mature export infrastructure — freight, documentation, and third-party inspection are routine services, not special requests.',
  ],
  cons: [
    'At very low volumes, MOQs and freight can make regional or local sourcing cheaper overall.',
    'Where lead time matters more than unit cost, nearer suppliers frequently win despite higher prices.',
    'Some categories face tariffs or trade restrictions that erase the price advantage entirely.',
  ],
  note: 'If your volume or category makes China the wrong answer, we would rather say so on the first call than after you have paid us.',
};
