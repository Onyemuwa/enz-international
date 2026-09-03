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
// photography (or the same deliberate empty-slot placeholder) and the same
// taxonomy already published on industries.html — one list, not a second one
// that can drift from it. Adding a category here means adding it there too.
//
// ===========================================================================
// SEVEN CATEGORIES, NOT FOUR
// ===========================================================================
// The first version of this page matched only the four industries already on
// industries.html. Agriculture & food processing, Packaging & printing and
// Textiles & apparel were added after that — a genuine expansion of what ENZ
// is claiming to source, done deliberately rather than by just widening this
// file: they were added to industries.html and images.js too, so the two
// pages stay in agreement. If you add an eighth category, do the same in all
// three places.
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
      {
        name: 'Concrete block & paver making machine',
        use: 'Forms and cures concrete into blocks, pavers and kerbstones.',
        power: '15–60 kW',
        capacity: '3,000–12,000 blocks/day',
        leadTime: '45–75 days',
      },
      {
        name: 'Steel door & window fabrication line',
        use: 'Cuts, welds and finishes steel sections into doors and window frames.',
        power: '20–80 kW',
        capacity: '200–600 units/day',
        leadTime: '60–90 days',
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
      {
        name: 'Sheet metal laser cutting & bending line',
        use: 'Cuts and forms sheet metal to specification for fabrication and enclosures.',
        power: '10–40 kW',
        capacity: 'Varies by part geometry',
        leadTime: '45–75 days',
      },
      {
        name: 'Industrial welding & robotic assembly cell',
        use: 'Automates repetitive welding and assembly steps on a production line.',
        power: '15–90 kW',
        capacity: '500–2,000 joints/day',
        leadTime: '75–120 days',
      },
    ],
  },
  {
    industry: 'Consumer goods & retail',
    intro:
      'Production lines for household products and general merchandise — the category with the tightest quality tolerances, because defects reach the end customer directly.',
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
        name: 'PET bottle blow-moulding line',
        use: 'Blows preforms into finished PET bottles for beverages and household liquids.',
        power: '20–100 kW',
        capacity: '3,000–15,000 bottles/hour',
        leadTime: '60–100 days',
      },
      {
        name: 'Garment cut-and-sew production line',
        use: 'Cuts fabric and assembles finished apparel at volume.',
        power: '5–20 kW',
        capacity: '500–2,000 pcs/day',
        leadTime: '60–90 days',
      },
      {
        name: 'Household appliance assembly line',
        use: 'Assembles small household appliances — fans, kettles, irons — from sourced components.',
        power: '10–40 kW',
        capacity: '500–3,000 units/day',
        leadTime: '60–90 days',
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
      {
        name: 'Copper cathode electro-refining line',
        use: 'Refines blister copper into high-purity cathode by electrolysis.',
        power: '500–3,000 kW',
        capacity: '50–300 t/day',
        leadTime: '150–210 days',
      },
      {
        name: 'Coffee & cocoa wet/dry processing line',
        use: 'Pulps, ferments, washes and dries coffee cherry or cocoa pod into export-grade beans.',
        power: '20–100 kW',
        capacity: '5–30 t/day',
        leadTime: '75–120 days',
      },
    ],
  },
  {
    industry: 'Agriculture & food processing',
    intro:
      'Post-harvest and food production lines — from raw grain and produce to a packaged, saleable product.',
    items: [
      {
        name: 'Rice/maize milling line',
        use: 'Hulls, polishes and grades grain into a finished, saleable product.',
        power: '30–150 kW',
        capacity: '20–150 t/day',
        leadTime: '60–100 days',
      },
      {
        name: 'Animal feed pellet line',
        use: 'Grinds and pellets grain, oilseed meal and additives into livestock feed.',
        power: '15–90 kW',
        capacity: '1–10 t/hour',
        leadTime: '60–90 days',
      },
      {
        name: 'Edible oil pressing & refining line',
        use: 'Presses and refines oilseed into bottled cooking oil.',
        power: '30–200 kW',
        capacity: '10–100 t/day seed',
        leadTime: '90–150 days',
      },
      {
        name: 'Fruit & vegetable processing line',
        use: 'Washes, sorts, cuts and packs fresh or frozen produce.',
        power: '15–75 kW',
        capacity: '2–20 t/day',
        leadTime: '60–100 days',
      },
      {
        name: 'Dairy processing & packaging line',
        use: 'Pasteurises, packages and cold-chains milk and dairy products.',
        power: '20–100 kW',
        capacity: '2,000–20,000 L/day',
        leadTime: '75–120 days',
      },
    ],
  },
  {
    industry: 'Packaging & printing',
    intro:
      'Flexible packaging, labelling and print-finishing equipment for branded goods.',
    items: [
      {
        name: 'Flexographic printing press',
        use: 'Prints multi-colour graphics onto flexible packaging film.',
        power: '15–60 kW',
        capacity: '100–300 m/min',
        leadTime: '60–90 days',
      },
      {
        name: 'Pouch & sachet forming line',
        use: 'Forms, fills and seals flexible pouches and sachets.',
        power: '10–40 kW',
        capacity: '60–200 pouches/min',
        leadTime: '60–90 days',
      },
      {
        name: 'Label printing & die-cutting line',
        use: 'Prints and cuts self-adhesive labels to shape.',
        power: '5–20 kW',
        capacity: '30–100 m/min',
        leadTime: '45–75 days',
      },
      {
        name: 'Blister & thermoforming packaging line',
        use: 'Forms rigid plastic packaging around a product.',
        power: '15–60 kW',
        capacity: '40–150 packs/min',
        leadTime: '60–90 days',
      },
      {
        name: 'Corrugated box printing & converting line',
        use: 'Prints and dies corrugated sheet into finished, branded boxes.',
        power: '30–120 kW',
        capacity: '8,000–20,000 boxes/day',
        leadTime: '75–110 days',
      },
    ],
  },
  {
    industry: 'Textiles & apparel',
    intro:
      'Fabric production equipment through to finishing — the machinery behind a garment or home-textile order.',
    items: [
      {
        name: 'Circular/flat knitting line',
        use: 'Knits yarn into fabric for apparel and household textiles.',
        power: '5–15 kW per machine',
        capacity: '80–200 kg/day per machine',
        leadTime: '45–75 days',
      },
      {
        name: 'Weaving loom line',
        use: 'Weaves yarn into woven fabric for apparel and home textiles.',
        power: '5–20 kW per loom',
        capacity: '200–600 m/day per loom',
        leadTime: '60–90 days',
      },
      {
        name: 'Dyeing & finishing line',
        use: 'Dyes, washes and finishes fabric to specification and colour standard.',
        power: '30–150 kW',
        capacity: '2–10 t/day fabric',
        leadTime: '75–110 days',
      },
      {
        name: 'Nonwoven fabric production line',
        use: 'Bonds fibre into nonwoven fabric for hygiene, medical or industrial use.',
        power: '50–250 kW',
        capacity: '1,000–5,000 kg/day',
        leadTime: '90–130 days',
      },
      {
        name: 'Embroidery & finishing line',
        use: 'Embroiders and finishes garments and textile goods to order.',
        power: '5–15 kW',
        capacity: '200–1,000 pcs/day',
        leadTime: '45–75 days',
      },
    ],
  },
];

export default equipmentCategories;
