// Search-result copy.
//
// WHY THIS IS SEPARATE FROM THE PAGE SUBTITLES
// Descriptions used to reuse each page's visible lead (`servicesSubtitle` and
// friends), which meant they were written to sit under a heading, not to be
// clicked in a result list. They came out at 64-122 characters, so Google had
// 40-90 characters of unused space it filled by scraping the page itself.
//
// These are written for the SERP instead: 150-160 characters, front-loaded
// with the terms someone actually types, and ending on a reason to click.
// The visible page copy is untouched.
//
// RULES
//  * 150-160 characters. Under 150 wastes the slot; over 160 truncates.
//    `npm run check:seo` in _build fails the build if any entry is outside it.
//  * Every claim must already be true elsewhere on this site. No volumes, no
//    client names, no certifications — the same line _content/proof.js draws.
//  * Lead with the service and the place, because that is the query shape:
//    "china sourcing agent kenya", not "we are a leading provider".
//
// Keys are page filenames, matching _lib/nav.js. A missing key falls back to
// the page's own subtitle, so adding a page never breaks the build.

export const seoDescriptions = {
  'index.html':
    'China sourcing, supplier verification, factory audits and quality inspection for importers in East Africa, the DRC, the US and the UK. One contact throughout.',

  'about.html':
    'Who ENZ INTERNATIONAL is: a China sourcing and quality-control firm working from Guangzhou for buyers in Tanzania, Kenya, the DRC, the US and the UK today.',

  'services.html':
    'Three service lines: China sourcing and commodity procurement, turnkey factory setup, and market-entry support. Verified suppliers, staged inspection, freight.',

  'markets.html':
    'China sourcing and factory-setup support for businesses in Tanzania, Kenya, the DRC, the United States and the United Kingdom. Coordinated from Guangzhou.',

  'insights.html':
    'Practical guidance on sourcing from China: vetting suppliers, managing lead times, protecting quality, Incoterms and landed cost. Written for importers.',

  'process.html':
    'How a China sourcing project runs, step by step: brief, supplier shortlist, samples and negotiation, production monitoring, inspection, and freight booking.',

  'pricing.html':
    'What China sourcing, quality inspection and factory setup actually cost, and the factors that move the number. No published rates, because scope decides price.',

  'industries.html':
    'China sourcing and quality control for construction materials, industrial machinery, consumer goods and commodities including copper and cobalt procurement.',

  'equipment.html':
    'Equipment ENZ helps you source across seven industries — construction, machinery, food processing, packaging, textiles, consumer goods and commodities.',

  'quality-control.html':
    'Four-stage quality control on China orders: incoming materials, during production, pre-shipment inspection and container loading. AQL sampling explained.',

  'logistics.html':
    'Freight forwarding, customs documentation and Incoterms explained for China imports. Where cost and risk actually transfer between EXW, FOB, CIF and DDP terms.',

  'faq.html':
    'Straight answers on sourcing from China: how projects start, what quality control covers, how pricing works, payment terms, lead times, and what we will not do.',

  'resources.html':
    'Reference material for China importers: Incoterms 2020, AQL sampling tables, shipping document checklists, landed-cost breakdowns and a sourcing glossary.',

  'contact.html':
    'Talk to ENZ INTERNATIONAL about sourcing from China, factory setup or quality inspection. Book a consultation, or reach us by email, phone or WhatsApp.',

  'careers.html':
    'Work with ENZ INTERNATIONAL on China sourcing, quality inspection and factory-setup projects across East Africa, the DRC, the US and the UK. Open applications.',

  'privacy.html':
    'How ENZ INTERNATIONAL handles what you submit through this website. No cookies, no analytics and no third-party tracking — only the enquiry you choose to send.',

  'terms.html':
    'The terms governing use of the ENZ INTERNATIONAL website: published content is informational, engagements are governed by separately signed agreements.',

  // ---- insight articles -------------------------------------------------
  'insight-navigating-china-supply-chain-2026.html':
    'A buyer’s checklist for sourcing from China in 2026: how to vet a supplier properly, plan around lead times, and protect quality before goods leave the factory.',

  'insight-factory-setup-east-africa-guide.html':
    'Setting up a factory in East Africa, step by step: feasibility and site selection, machinery sourcing, import permits, commissioning and training a local team.',

  'insight-commodity-trading-outlook-copper-cobalt.html':
    'Copper and cobalt trading fundamentals for buyers: how contracts are priced and settled, what assay and quality terms mean, and where the real risk sits.',

  // ---- service landing pages --------------------------------------------
  'sourcing.html':
    'China sourcing and commodity procurement: verified supplier shortlists, factory audits, price benchmarking, pre-shipment inspection and freight to your port.',

  'factory-setup.html':
    'Turnkey factory setup: feasibility study, site selection, machinery sourcing, production-line layout, import permits, technician training and commissioning.',

  'market-entry.html':
    'Market-entry support for businesses expanding into new territories: supplier networks, local production options, regulatory guidance and procurement strategy.',

  // ---- location landing pages -------------------------------------------
  'tanzania.html':
    'China sourcing, factory setup and import support for Tanzanian businesses. Supplier vetting and staged quality inspection, coordinated via Dar es Salaam.',

  'kenya.html':
    'China sourcing, factory setup and import support for Kenyan businesses. Supplier vetting, staged quality control and freight, coordinated through Nairobi.',

  'drc.html':
    'China sourcing, commodity trading and factory-setup support for businesses in the DRC. Procurement and staged quality control coordinated through Kinshasa.',

  'usa.html':
    'A China sourcing partner for US importers and brands: supplier vetting, quality control, freight forwarding and factory-setup options for diversifying.',

  'uk.html':
    'A China sourcing partner for UK importers and brands: supplier vetting, quality inspection, freight forwarding and supply-chain diversification, from London.',
};

/** Falls back to the page's own subtitle when no SERP copy is written yet. */
export function seoDescriptionFor(page, fallback) {
  return seoDescriptions[page] || fallback;
}

export default seoDescriptions;
