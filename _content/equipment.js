// Equipment ENZ helps buyers source — organised the way a production-line
// directory organises itself: by industry, then by machine type, then by a
// short spec table. That structure is the useful part of that pattern and is
// what this borrows.
//
// ===========================================================================
// WHAT THIS IS NOT
// ===========================================================================
// This is not a catalogue of specific machines from named, verified factories,
// and it is not an inventory ENZ holds or resells. ENZ sources against a
// buyer's brief; there is no fixed stock. A page structured like a product
// listing but describing units nobody has actually inspected would be the
// same category of problem this project has refused everywhere else on this
// site — see the empty arrays in proof.js and the "confirmed" gate in
// stats.js. So every entry here is a TYPE of equipment and a TYPICAL spec
// range for that type, not a claim about one specific unit.
//
// Ranges are ordinary-knowledge figures for each machine category — the same
// kind of fact as an AQL table or an Incoterm in pages.js — not a measurement
// of anything ENZ has sourced. Keep it that way: a specific number here reads
// as a claim, and a wrong one is worse for trust than a wide, honest range.
//
// `industry` matches a key in _content/pages.js `industries` and in
// _content/images.js `industryImages`, so the equipment page reuses the same
// photography and the same four categories already published on
// industries.html — one taxonomy, not a second one that can drift from it.
// ===========================================================================

export const equipmentCategories = [
  {
    industry: 'Construction & building materials',
    intro:
      'Tile, sanitaryware and profile lines are what buyers in this category most often ask us to source and commission.',
    items: [
      {
        name: 'Ceramic tile press & kiln line',
        use: 'Forms and fires clay or porcelain body into finished floor or wall tile.',
        power: '40–180 kW',
        capacity: '3,000–8,000 m²/day',
        leadTime: '75–120 days',
      },
      {
        name: 'Sanitaryware slip-casting & glazing line',
        use: 'Casts and glazes basins, cisterns and WC pans from ceramic slip.',
        power: '20–90 kW',
        capacity: '500–2,000 pcs/day',
        leadTime: '90–120 days',
      },
      {
        name: 'Aluminium profile extrusion line',
        use: 'Extrudes aluminium billet into window, door and structural profile.',
        power: '150–800 kW',
        capacity: '1,500–4,000 t/year',
        leadTime: '90–150 days',
      },
    ],
  },
  {
    industry: 'Industrial equipment & machinery',
    intro:
      'General-purpose production and assembly equipment, sourced for a new line or to add capacity to an existing one.',
    items: [
      {
        name: 'CNC machining centre',
        use: 'Cuts, drills and mills metal or plastic parts to specification from a digital design.',
        power: '15–75 kW',
        capacity: 'Varies by part geometry',
        leadTime: '45–90 days',
      },
      {
        name: 'Plastic injection moulding machine',
        use: 'Injects molten plastic into a mould to produce components at volume.',
        power: '20–150 kW',
        capacity: '500–5,000 shots/day',
        leadTime: '60–90 days',
      },
      {
        name: 'Automated packaging & palletising line',
        use: 'Fills, seals, labels and palletises finished goods for shipment.',
        power: '10–60 kW',
        capacity: '20–80 cartons/min',
        leadTime: '60–100 days',
      },
    ],
  },
  {
    industry: 'Consumer goods & retail',
    intro:
      'Production lines for household products, packaging and textiles — the categories with the tightest quality tolerances, because defects reach the end customer directly.',
    items: [
      {
        name: 'Household plastics production line',
        use: 'Moulds and finishes household plastic goods — containers, fixtures, general merchandise.',
        power: '30–120 kW',
        capacity: '2,000–10,000 pcs/day',
        leadTime: '60–90 days',
      },
      {
        name: 'Corrugated carton production line',
        use: 'Converts kraft paper into corrugated board and dies it into finished cartons.',
        power: '40–200 kW',
        capacity: '15,000–40,000 m²/day',
        leadTime: '75–120 days',
      },
      {
        name: 'Circular/flat knitting line',
        use: 'Knits yarn into fabric for apparel and household textiles.',
        power: '5–15 kW per machine',
        capacity: '80–200 kg/day per machine',
        leadTime: '45–75 days',
      },
    ],
  },
  {
    industry: 'Commodities & raw materials',
    intro:
      'Processing and handling equipment for copper, cobalt and agricultural goods — where chain-of-custody and quality specification matter as much as the machine itself.',
    items: [
      {
        name: 'Ore flotation & concentration line',
        use: 'Separates valuable mineral from waste rock to produce a saleable concentrate.',
        power: '200–1,200 kW',
        capacity: '100–1,000 t/day feed',
        leadTime: '120–180 days',
      },
      {
        name: 'Grain milling & processing line',
        use: 'Cleans, mills and grades grain or pulses into a finished, saleable product.',
        power: '50–300 kW',
        capacity: '50–300 t/day',
        leadTime: '75–120 days',
      },
      {
        name: 'Cold-chain storage & handling system',
        use: 'Holds and moves temperature-sensitive commodities between production and port.',
        power: '20–100 kW',
        capacity: '200–2,000 m³ storage',
        leadTime: '60–100 days',
      },
    ],
  },
];

export default equipmentCategories;
