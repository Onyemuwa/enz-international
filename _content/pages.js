// Deep content for the detail pages.
//
// SCOPE RULE: everything here is either (a) verifiable industry standard —
// Incoterms, AQL sampling, inspection types, customs documents — or (b) a
// description of process. Nothing asserts an ENZ-specific fact that would need
// evidence (no client names, no volumes, no certifications, no headcount).
// That line is deliberate: industry knowledge demonstrates expertise honestly,
// invented specifics are a liability on a live company site. Anything needing
// your sign-off is listed in SETUP.md section 1.

export const processSteps = [
  {
    n: '01',
    title: 'Discovery call',
    duration: '30 minutes',
    summary: 'We establish what you are buying or building, at what volume, to what tolerance, and by when.',
    detail: [
      'Product specification, target landed cost, and order volume — including whether this is a trial order or an ongoing programme.',
      'Your quality tolerance and any regulatory requirements in the destination market (CE, FDA, SONCAP, KEBS, and equivalents vary by product and country).',
      'Timeline constraints, especially any hard dates tied to a season, tender, or existing contract.',
    ],
    output: 'A written summary of requirements and an honest read on whether we are the right partner.',
  },
  {
    n: '02',
    title: 'Supplier identification',
    duration: '1–2 weeks',
    summary: 'We shortlist factories against your spec and verify they are what they claim to be.',
    detail: [
      'Shortlisting across the relevant manufacturing cluster — different provinces dominate different categories, and starting in the wrong one costs weeks.',
      'Business licence verification, export history, and production capacity checked against your volume.',
      'Where the order justifies it, an on-site visit or third-party audit before any commitment.',
    ],
    output: 'Three to five vetted candidates with quoted pricing, lead times, and MOQ.',
  },
  {
    n: '03',
    title: 'Sampling and negotiation',
    duration: '2–4 weeks',
    summary: 'Samples are produced and reviewed before terms are fixed.',
    detail: [
      'Pre-production samples reviewed against the agreed specification, with revisions where needed.',
      'Commercial terms negotiated on your behalf: unit price, MOQ, payment schedule, and Incoterm.',
      'A golden sample is retained as the reference standard that later inspections are judged against.',
    ],
    output: 'An approved reference sample and a signed proforma invoice.',
  },
  {
    n: '04',
    title: 'Production and quality control',
    duration: 'Varies by product',
    summary: 'Production is monitored and inspected at defined checkpoints, not just at the end.',
    detail: [
      'Incoming material checks before the line starts, so a substrate problem is caught before it becomes finished stock.',
      'During-production inspection at roughly 20–30% completion, when a systemic defect can still be corrected.',
      'Pre-shipment inspection against AQL sampling once goods are 100% produced and at least 80% packed.',
    ],
    output: 'Inspection reports with photographic evidence at each checkpoint.',
  },
  {
    n: '05',
    title: 'Freight and customs',
    duration: '2–6 weeks in transit',
    summary: 'Goods are booked, documented, and cleared into your market.',
    detail: [
      'Mode selection — sea LCL, sea FCL, air, or rail — based on your cost/urgency trade-off.',
      'Documentation prepared and checked: commercial invoice, packing list, bill of lading, certificate of origin, and any product-specific certificates.',
      'Customs clearance coordinated at destination, with duties and taxes calculated in advance so the landed cost holds.',
    ],
    output: 'Delivered goods and a complete document set for your records.',
  },
];

export const qcStages = [
  {
    code: 'IQC',
    title: 'Incoming quality control',
    when: 'Before production starts',
    body: 'Raw materials and components are checked against specification as they arrive at the factory. Catching an out-of-spec substrate here costs a delay; catching it after production costs the whole run. This is the cheapest inspection point in the entire process and the one most often skipped.',
  },
  {
    code: 'DUPRO',
    title: 'During-production inspection',
    when: 'At roughly 20–30% completion',
    body: 'The first finished units are inspected while the line is still running. A systemic error — wrong tolerance, wrong finish, misaligned assembly — can still be corrected without scrapping the order. Waiting until the goods are 100% complete removes that option entirely.',
  },
  {
    code: 'PSI',
    title: 'Pre-shipment inspection',
    when: 'At 100% production, 80%+ packed',
    body: 'The final check before goods leave the factory, conducted on a random sample drawn from packed cartons. This is the last point at which you can refuse a shipment without it becoming a cross-border dispute, which is why it matters more than any inspection that happens after arrival.',
  },
  {
    code: 'LOADING',
    title: 'Container loading supervision',
    when: 'At the point of loading',
    body: 'Verification that the quantity loaded matches the packing list, that cartons are stacked and secured to survive transit, and that the container itself is sound and dry. Damage that begins as a loading error is almost impossible to attribute after the fact.',
  },
];

export const aqlExplainer = {
  title: 'How AQL sampling works',
  body: 'Inspections use AQL (Acceptable Quality Limit) sampling under ISO 2859-1, the international standard for inspection by attributes. Rather than checking every unit — which is prohibitively slow for most consumer goods — a statistically determined sample is drawn from the batch and defects are sorted into three classes.',
  levels: [
    { label: 'Critical', desc: 'Renders the product unsafe or illegal to sell. Standard limit is zero — any critical defect fails the batch.' },
    { label: 'Major', desc: 'Would likely cause a return, complaint, or lost sale. Commonly set at 2.5% for consumer goods.' },
    { label: 'Minor', desc: 'A cosmetic deviation unlikely to affect saleability. Commonly set at 4.0%.' },
  ],
  note: 'These limits are negotiable and should be agreed in writing before production, not argued about after an inspection fails. Tighter limits generally cost more per unit.',
};

export const incoterms = [
  { code: 'EXW', name: 'Ex Works', risk: 'Buyer', body: 'Seller makes goods available at their premises. The buyer carries cost and risk from the factory gate, including export clearance. Cheapest quoted price, most work and exposure for you.' },
  { code: 'FOB', name: 'Free On Board', risk: 'Shared', body: 'Seller delivers and clears the goods for export and loads them onto the vessel. Risk transfers once loaded. The most common term for sea-freighted goods from China and usually the most balanced starting point.' },
  { code: 'CIF', name: 'Cost, Insurance & Freight', risk: 'Shared', body: 'Seller pays freight and insurance to the destination port. Convenient, but the seller chooses the forwarder — which means less control over routing, timing, and the fees you meet on arrival.' },
  { code: 'DDP', name: 'Delivered Duty Paid', risk: 'Seller', body: 'Seller bears all cost and risk to a named destination, including import duties. Simplest for the buyer and highest quoted price. Verify duties are genuinely paid — an underdeclared DDP shipment becomes your legal problem, not the seller’s.' },
];

export const shippingDocs = [
  { name: 'Commercial invoice', body: 'States the parties, goods, value, and Incoterm. Customs uses it to assess duty, so the declared value and HS code must be accurate.' },
  { name: 'Packing list', body: 'Carton-level detail: contents, quantities, weights, dimensions, and marks. Used to verify what physically arrived against what was billed.' },
  { name: 'Bill of lading', body: 'Issued by the carrier. It is the contract of carriage and, for an original B/L, a document of title — whoever holds it can claim the goods.' },
  { name: 'Certificate of origin', body: 'Establishes where goods were manufactured. Required for preferential duty rates under trade agreements, and frequently requested at African and EU customs.' },
  { name: 'Product certificates', body: 'Category and market specific — CE, RoHS, SONCAP, KEBS, PVoC and equivalents. Missing certificates are a leading cause of goods being held at destination.' },
];

export const industries = [
  { icon: 'briefcase', name: 'Construction & building materials', body: 'Fixtures, fittings, tiles, sanitaryware, hardware, and finishing materials. Volume-heavy, freight-sensitive, and highly dependent on consistent tolerance across repeat orders.', considerations: ['Freight cost often exceeds unit cost — container optimisation matters more than unit price', 'Dimensional consistency across production runs', 'Destination building-standard compliance'] },
  { icon: 'trendingUp', name: 'Industrial equipment & machinery', body: 'Production machinery, spare parts, and assembly-line equipment. Long lead times and high consequence of error, so verification before shipment is critical.', considerations: ['Voltage, frequency, and plug standards for the destination market', 'Spare-parts availability and after-sales support terms', 'Installation, commissioning, and operator training'] },
  { icon: 'globe', name: 'Consumer goods & retail', body: 'Household products, packaging, textiles, and general merchandise. Typically the most quality-sensitive category, because defects surface as customer returns.', considerations: ['Tighter AQL limits — defects reach end customers directly', 'Packaging and labelling compliance for the destination market', 'Seasonal lead-time planning around Chinese New Year'] },
  { icon: 'shield', name: 'Commodities & raw materials', body: 'Copper, cobalt, and select agricultural goods. Contract structure and chain-of-custody documentation matter more here than in any other category.', considerations: ['Quality specification and assay method agreed in writing', 'Chain-of-custody documentation from point of origin', 'Clear force majeure and off-spec penalty clauses'] },
];

export const comparison = {
  title: 'Direct sourcing vs. working with us',
  subtitle: 'An honest comparison. Direct sourcing is genuinely the right call for some buyers — usually those with staff on the ground or an established supplier they already trust.',
  rows: [
    { factor: 'Supplier verification', diy: 'You rely on platform badges and self-reported credentials', enz: 'Licence, capacity, and export history verified independently; site visits where the order justifies it' },
    { factor: 'Time to first shipment', diy: 'Often 3–6 months for a first-time buyer, most of it spent finding and vetting', enz: 'Typically shorter, because the shortlist starts from suppliers already known to the category' },
    { factor: 'Quality control', diy: 'Usually a single pre-shipment check, if any', enz: 'Staged: incoming materials, during production, pre-shipment, and loading' },
    { factor: 'Language and time zone', diy: 'Negotiating technical specs across a 6–8 hour gap and a language barrier', enz: 'Handled locally in Mandarin, during Chinese business hours' },
    { factor: 'When something goes wrong', diy: 'Limited leverage from abroad once payment has been sent', enz: 'Someone on the ground with an existing relationship and the ability to visit' },
    { factor: 'Cost', diy: 'No agency fee — but rework, delays, and freight errors are absorbed by you', enz: 'A fee against typically lower landed cost and materially lower risk of a failed order' },
  ],
};

export const resources = [
  { icon: 'check', title: 'Pre-shipment inspection checklist', body: 'The checks worth insisting on before goods leave the factory — quantity verification, workmanship, function testing, packaging, and shipping marks.', cta: 'Request the checklist' },
  { icon: 'calendar', title: 'Chinese New Year planning calendar', body: 'Factories close for two to four weeks and capacity tightens for weeks either side. This is the single most common cause of missed deadlines for first-time buyers.', cta: 'Request the calendar' },
  { icon: 'mapPin', title: 'Incoterms quick reference', body: 'What each term actually obliges each party to do, where risk transfers, and which one to ask for depending on how much control you want.', cta: 'Request the reference' },
  { icon: 'shield', title: 'Supplier verification questions', body: 'The questions that separate a manufacturer from a trading company, and the documents to ask for in each case.', cta: 'Request the questions' },
];

export const trustSignals = [
  { icon: 'mapPin', label: 'On the ground', body: 'Staff in Guangzhou and across the markets we serve' },
  { icon: 'shield', label: 'Verified suppliers', body: 'Independent checks before any recommendation' },
  { icon: 'check', label: 'Staged QC', body: 'Four inspection points, not one' },
  { icon: 'mail', label: 'One point of contact', body: 'Same person from first call to delivery' },
];

export default { processSteps, qcStages, aqlExplainer, incoterms, shippingDocs, industries, comparison, resources, trustSignals };
