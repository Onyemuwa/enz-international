// The Incoterms handover diagram.
//
// ---------------------------------------------------------------------------
// WHY THIS EXISTS
// ---------------------------------------------------------------------------
// Incoterms decide who pays for what and who carries the risk if a container
// is lost. Buyers routinely get this wrong, and it is expensive when they do:
// an under-quoted DDP or an unexpected demurrage bill both trace back to not
// knowing where responsibility actually passed.
//
// Every explanation of this online is a table. A table is exactly the wrong
// shape for it, because the thing being explained is a JOURNEY with a point on
// it. So this is the journey, with the point marked.
//
// THE DETAIL THAT MATTERS
// Under CIF the seller pays freight to the destination port, but RISK passes
// the moment the goods are loaded at origin. If your container sinks
// mid-ocean on CIF terms, the seller has met its obligation and the loss is
// yours — you are relying on the insurance THEY chose. Nearly every summary
// table collapses cost and risk into one column and loses this.
//
// So the diagram tracks them separately. On EXW, FOB and DDP the two points
// coincide; on CIF they do not, and the gap between them is the whole lesson.
//
// Not legal advice, and deliberately not phrased as any. Incoterms 2020 is the
// governing text and a contract can vary any of this.
// ---------------------------------------------------------------------------

// The physical journey, origin to destination. Stage indices are what the
// terms below point at, so the order is load-bearing.
export const journey = [
  { id: 'factory', label: 'Factory', detail: "Goods packed and ready at the seller's premises" },
  { id: 'inland-origin', label: 'Inland transit', detail: 'Road or rail to the origin port' },
  { id: 'export', label: 'Export clearance', detail: 'Origin customs and export documentation' },
  { id: 'loaded', label: 'Loaded on vessel', detail: 'Goods cross the ship’s rail' },
  { id: 'ocean', label: 'Ocean freight', detail: 'Main carriage to the destination port' },
  { id: 'arrival', label: 'Arrival port', detail: 'Discharged at the destination terminal' },
  { id: 'import', label: 'Import duty & VAT', detail: 'Destination customs, duties and taxes' },
  { id: 'delivery', label: 'Final delivery', detail: 'Onward transport to your door' },
];

// `costTo` / `riskTo` are the LAST journey index the seller is responsible for.
// -1 would mean the buyer carries everything from the very start.
export const terms = [
  {
    code: 'EXW',
    name: 'Ex Works',
    costTo: 0,
    riskTo: 0,
    summary: 'You collect from the factory gate and carry everything after that, including export clearance.',
    watch: 'The cheapest headline price and the most work. Export clearance in the seller’s own country is on you, which many first-time buyers are not set up to do.',
  },
  {
    code: 'FOB',
    name: 'Free On Board',
    costTo: 3,
    riskTo: 3,
    summary: 'The seller delivers, clears for export and loads the vessel. Cost and risk both pass once loaded.',
    watch: 'The most balanced starting point for sea freight from China, and the one to ask for if you are unsure.',
    recommended: true,
  },
  {
    code: 'CIF',
    name: 'Cost, Insurance & Freight',
    costTo: 5,
    riskTo: 3,
    summary: 'The seller pays freight and insurance to the destination port — but risk passes at loading, not on arrival.',
    watch: 'The gap on this diagram is the point. The seller pays to get it there; if it is lost mid-ocean the loss is yours, covered by insurance they selected. They also choose the forwarder, so you lose control of routing, timing and the fees you meet on arrival.',
  },
  {
    code: 'DDP',
    name: 'Delivered Duty Paid',
    costTo: 7,
    riskTo: 7,
    summary: 'The seller carries everything to your door, import duties included.',
    watch: 'Simplest for you and the highest quoted price. Verify duties are genuinely paid — an underdeclared DDP shipment becomes your legal problem, not the seller’s.',
  },
];

// Which term the diagram opens on. FOB, because it is both the most common for
// this trade lane and the one whose cost and risk points coincide, so the
// diagram reads simply before anyone touches it.
export const defaultTerm = 'FOB';

export default { journey, terms, defaultTerm };
