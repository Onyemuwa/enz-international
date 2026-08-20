// Service catalogue used on Home (summary) and Services (detail) pages.
// Pricing is intentionally omitted — see SETUP.md "Pricing" note: publishing firm
// numbers for consulting/trading services without your sign-off would be inaccurate.

export const services = [
  {
    slug: 'sourcing',
    icon: 'globe',
    titleKey: 'service1',
    descKey: 'service1Desc',
    tagline: 'From product brief to landed shipment.',
    features: [
      'Verified-supplier shortlisting across Guangdong, Zhejiang, and Fujian manufacturing clusters',
      'Factory audits and pre-shipment quality inspection',
      'Price benchmarking and negotiation support',
      'Consolidated freight forwarding and customs documentation',
      'Commodity procurement: copper, cobalt, and select agricultural goods',
    ],
    process: [
      { step: 'Brief', desc: 'Share specifications, target price, and volume.' },
      { step: 'Shortlist', desc: 'We identify and vet 3–5 matching suppliers.' },
      { step: 'Sample & Negotiate', desc: 'Samples reviewed, terms negotiated on your behalf.' },
      { step: 'Produce & Inspect', desc: 'Production monitored; pre-shipment QC performed.' },
      { step: 'Ship', desc: 'Freight booked, customs paperwork handled door-to-port.' },
    ],
  },
  {
    slug: 'factory-setup',
    icon: 'calendar',
    titleKey: 'service2',
    descKey: 'service2Desc',
    tagline: 'A turnkey path from feasibility study to first production run.',
    features: [
      'Site selection and feasibility assessment',
      'Machinery sourcing and vendor negotiation',
      'Assembly-line layout and production-flow planning',
      'Local regulatory and import-permit guidance',
      'Technician training and commissioning support',
    ],
    process: [
      { step: 'Feasibility', desc: 'Assess site, utilities, labor market, and regulatory path.' },
      { step: 'Design', desc: 'Line layout, equipment list, and capacity plan.' },
      { step: 'Procure', desc: 'Source and ship machinery; manage import logistics.' },
      { step: 'Install', desc: 'Installation, commissioning, and safety checks.' },
      { step: 'Launch', desc: 'Operator training and first-run production support.' },
    ],
  },
  {
    slug: 'market-entry',
    icon: 'user',
    titleKey: 'service3',
    descKey: 'service3Desc',
    tagline: 'Navigate China’s supply chain and regulatory landscape with a local partner.',
    features: [
      'Market and competitor landscape briefings',
      'Local entity and trading-partner introductions',
      'Supply-chain risk assessment',
      'Ongoing on-the-ground representation',
    ],
    process: [
      { step: 'Assess', desc: 'Understand your goals and target segment.' },
      { step: 'Map', desc: 'Map suppliers, partners, and regulatory requirements.' },
      { step: 'Connect', desc: 'Introductions to vetted partners and manufacturers.' },
      { step: 'Support', desc: 'Ongoing representation as your business scales.' },
    ],
  },
];

export default services;
