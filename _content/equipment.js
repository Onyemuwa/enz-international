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
// WHY 29 PRODUCTS, NOT 50
// ===========================================================================
// This used to be a wide 50-item catalogue — every machine a buyer might
// plausibly ask about, one entry per idea. That's a fine way to prove range,
// but it's a poor way to prove judgement: half of those 50 were things ENZ's
// actual buyer rarely asks for (a copper electro-refining line is a real
// machine, but the person who buys one is a mining company doing a
// nine-figure capital project, not the audience this storefront is written
// for), and a visitor can't tell a considered recommendation from padding.
//
// This list was cut down against actual demand data — what Chinese suppliers
// specifically market at Nigerian/East African buyers, what shows up
// repeatedly as "popular small-business machine" imports, not a guess. Ore
// flotation, copper electro-refining and gold CIL/CIP plants were removed
// entirely on that basis (real machines, wrong audience for a page whose job
// is generating inquiries from people about to place an order). Four
// products were added because the same research surfaced them as genuine,
// currently-unmet demand: sachet/bottled water lines, tissue paper lines,
// polythene bag machines and plastic recycling lines. If you're deciding
// whether to add a 30th, ask whether it's something people are actually
// searching for and buying, not whether ENZ is capable of sourcing it — ENZ
// can source almost anything; this page is not obligated to list all of it.
//
// ===========================================================================
// EACH ITEM'S `image` FIELD
// ===========================================================================
// '' renders a branded placeholder block (icon + a filename hint) instead of a
// photo, the same convention every other unfilled image on this site uses —
// see _content/images.js. Most items below carry a real, licensed stock photo
// (Pexels, commercial-use, no attribution required — same basis as every
// other photo on this site) as a placeholder until real factory-floor or
// product photography replaces it. The four newest additions (sachet/bottled
// water, tissue paper, polythene bag, plastic recycling) ship with '' for
// now — sourcing their stock photos, not writing their content, is the one
// step still pending.
//
// TO REPLACE A STOCK PHOTO WITH A REAL ONE
//   1. Export at roughly 1000x750px, .webp if you can.
//   2. Save it into assets/images/ under the SAME filename already set below
//      (or update the `image` field to a new filename).
//   3. Run `node _generate-static.mjs`.
// No other file needs to change — pages-equipment.js reads this field
// directly.
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
// three places. (Categories are NOT cut when their item count drops — see
// Commodities & raw materials below, trimmed to three items rather than
// removed, because removing it here would mean removing ENZ's stated
// commodities-trading industry from industries.html too, which is a real
// service line, not a leftover.)
// ===========================================================================

export const equipmentCategories = [
  {
    industry: 'Construction & building materials',
    intro:
      'Block, profile and fabrication lines are what buyers in this category most often ask us to source and commission.',
    items: [
      {
        name: 'Concrete block & paver making machine',
        image: 'concrete-block-paver-making-machine.webp',
        use: 'Forms and cures concrete into blocks, pavers and kerbstones.',
        power: '15–60 kW',
        capacity: '3,000–12,000 blocks/day',
        leadTime: '45–75 days',
        specs: [
          'Vibration-pressed forming head, mould interchangeable for block, kerb or paver profiles',
          'Automatic pallet feed and stacking to cut labour per shift',
          'Batching-plant integration for a consistent mix ratio',
          'Curing chamber or yard-curing option, depending on site space',
        ],
      },
      {
        name: 'Steel door & window fabrication line',
        image: 'steel-door-window-fabrication-line.webp',
        use: 'Cuts, welds and finishes steel sections into doors and window frames.',
        power: '20–80 kW',
        capacity: '200–600 units/day',
        leadTime: '60–90 days',
        specs: [
          'CNC punching and cutting stations sized to standard door/window gauges',
          'Automated welding jigs for corner and frame joints',
          'Powder-coat or galvanising line integration for finishing',
          'Hardware-fitting station for locks, hinges and closers',
        ],
      },
      {
        name: 'Aluminium profile extrusion line',
        image: 'aluminium-profile-extrusion-line.webp',
        use: 'Extrudes aluminium billet into window, door and structural profile.',
        power: '150–800 kW',
        capacity: '1,500–4,000 t/year',
        leadTime: '90–150 days',
        specs: [
          'Extrusion press rated 800–2,600 tonnes, matched to profile complexity',
          'Billet-heating furnace, induction or gas-fired',
          'In-line quench, stretch and cut-to-length stations',
          'Ageing oven for T5/T6 temper, sized to daily extrusion volume',
        ],
      },
      {
        name: 'Ceramic tile press & kiln line',
        image: 'ceramic-tile-press-kiln-line.webp',
        use: 'Forms and fires clay or porcelain body into finished floor or wall tile.',
        power: '40–180 kW',
        capacity: '3,000–8,000 m²/day',
        leadTime: '75–120 days',
        specs: [
          'Hydraulic press cycle down to single-digit seconds per tile, tuned to body thickness',
          'Roller-hearth or shuttle kiln firing, matched to porcelain or ceramic body',
          'Automatic glaze line for single-fire or double-fire production',
          'PLC-controlled firing curve with temperature-log traceability',
        ],
      },
    ],
  },
  {
    industry: 'Industrial equipment & machinery',
    intro:
      'General-purpose production equipment, sourced for a new line or to add capacity to an existing one.',
    items: [
      {
        name: 'CNC machining centre',
        image: 'cnc-machining-centre.webp',
        use: 'Cuts, drills and mills metal or plastic parts to specification from a digital design.',
        power: '15–75 kW',
        capacity: 'Varies by part geometry',
        leadTime: '45–90 days',
        specs: [
          '3-, 4- or 5-axis configurations, matched to part complexity',
          'Tool-changer capacity from 20 to 40+ stations for unattended runs',
          'Coolant-through-spindle option for deep-hole and hard-metal work',
          'Compatible with common CAM software — Mastercam, Fusion, SolidCAM',
        ],
      },
      {
        name: 'Plastic injection moulding machine',
        image: 'plastic-injection-moulding-machine.webp',
        use: 'Injects molten plastic into a mould to produce components at volume.',
        power: '20–150 kW',
        capacity: '500–5,000 shots/day',
        leadTime: '60–90 days',
        specs: [
          'Clamping force from 80 to 1,000+ tonnes, sized to part and mould',
          'Servo-hydraulic or all-electric drive, trading energy use against cycle time',
          'Multi-cavity mould compatibility for high-volume small parts',
          'Robotic take-off arm integration for unmanned cycling',
        ],
      },
      {
        name: 'Sheet metal laser cutting & bending line',
        image: 'sheet-metal-laser-cutting-bending-line.webp',
        use: 'Cuts and forms sheet metal to specification for fabrication and enclosures.',
        power: '10–40 kW',
        capacity: 'Varies by part geometry',
        leadTime: '45–75 days',
        specs: [
          'Fibre laser cutting up to 20–25mm mild steel, thinner for stainless or aluminium',
          'CNC press brake with tonnage matched to sheet gauge and bend length',
          'Nesting software to minimise material waste per sheet',
          'Automatic sheet loading and unloading for lights-out cutting runs',
        ],
      },
      {
        name: 'Industrial air compressor & pneumatic system',
        image: 'industrial-air-compressor-pneumatic-system.webp',
        use: 'Supplies compressed air for pneumatic tools, actuators and process equipment across a facility.',
        power: '15–250 kW',
        capacity: '1,000–15,000 L/min',
        leadTime: '45–75 days',
        specs: [
          'Screw or piston compressor, matched to duty cycle and required pressure',
          'Refrigerated or desiccant dryer for moisture-sensitive downstream equipment',
          'Receiver tank sized to smooth demand peaks',
          'Variable-speed drive option to cut energy use at partial load',
        ],
      },
      {
        name: 'Plastic recycling & pelletizing line',
        image: '',
        use: 'Washes, shreds and re-pelletises plastic waste into reusable raw-material granules.',
        power: '40–160 kW',
        capacity: '300–1,500 kg/hour',
        leadTime: '75–110 days',
        specs: [
          'Shredding and crushing stage sized to input material — PET, HDPE, LDPE or PP',
          'Washing and de-labelling line for contaminated post-consumer waste',
          'Single- or twin-screw extruder for re-pelletising into resaleable granules',
          'Water-ring or strand-cut pelletising head, by output granule shape required',
        ],
      },
    ],
  },
  {
    industry: 'Consumer goods & retail',
    intro:
      'Production lines for household products and daily consumables — the category with the tightest quality tolerances, because defects reach the end customer directly.',
    items: [
      {
        name: 'Household plastics production line',
        image: 'household-plastics-production-line.webp',
        use: 'Moulds and finishes household plastic goods — containers, fixtures, general merchandise.',
        power: '30–120 kW',
        capacity: '2,000–10,000 pcs/day',
        leadTime: '60–90 days',
        specs: [
          'Injection or blow-moulding, matched to product geometry — rigid vs. hollow',
          'Multi-cavity tooling for high-volume SKUs like containers and fixtures',
          'In-line trimming and quality-check stations',
          'Colour-masterbatch dosing for consistent product colour across runs',
        ],
      },
      {
        name: 'Corrugated carton production line',
        image: 'corrugated-carton-production-line.webp',
        use: 'Converts kraft paper into corrugated board and dies it into finished cartons.',
        power: '40–200 kW',
        capacity: '15,000–40,000 m²/day',
        leadTime: '75–120 days',
        specs: [
          'Corrugator rated to board flute type (A/B/C/E) and daily linear-metre output',
          'Flexo printer-slotter for branded, printed cartons in one pass',
          'Die-cutting station for custom box shapes beyond standard slotted cartons',
          'Bundling and strapping station for palletised dispatch',
        ],
      },
      {
        name: 'PET bottle blow-moulding line',
        image: 'pet-bottle-blow-moulding-line.webp',
        use: 'Blows preforms into finished PET bottles for beverages and household liquids.',
        power: '20–100 kW',
        capacity: '3,000–15,000 bottles/hour',
        leadTime: '60–100 days',
        specs: [
          'Two-stage (preform-to-bottle) or single-stage, depending on volume and SKU count',
          'Mould-change tooling for running multiple bottle shapes on one machine',
          'In-line leak testing before the filling-line handoff',
          'Energy-recovery options on the preform-heating stage',
        ],
      },
      {
        name: 'Garment cut-and-sew production line',
        image: 'garment-cut-and-sew-production-line.webp',
        use: 'Cuts fabric and assembles finished apparel at volume.',
        power: '5–20 kW',
        capacity: '500–2,000 pcs/day',
        leadTime: '60–90 days',
        specs: [
          'Automated or manual fabric-spreading and cutting stations',
          'Sewing-line layout sized to garment complexity and daily unit target',
          'Finishing stations — pressing, quality check, folding and packing',
          'Compatible with woven and knit fabric types',
        ],
      },
      {
        name: 'Tissue paper & toilet roll production line',
        image: '',
        use: 'Converts jumbo paper reels into finished, packaged toilet rolls, kitchen towels or facial tissue.',
        power: '20–75 kW',
        capacity: '150–400 cartons/day',
        leadTime: '60–100 days',
        specs: [
          'Rewinding line with embossing and perforation, sized to reel width',
          'Automatic log-saw cutting to finished roll length',
          'Wrapping and cartoning station for retail-ready packs',
          'Compatible with virgin or 100% recycled base paper',
        ],
      },
    ],
  },
  {
    industry: 'Commodities & raw materials',
    intro:
      'Processing equipment for cotton, coffee, cocoa and other agricultural export commodities — where chain-of-custody and quality specification matter as much as the machine itself.',
    items: [
      {
        name: 'Cotton ginning line',
        image: 'cotton-ginning-line.webp',
        use: 'Separates cotton fibre from seed and cleans it ahead of baling.',
        power: '40–150 kW',
        capacity: '10–40 bales/hour',
        leadTime: '75–110 days',
        specs: [
          'Saw or roller gin stand, matched to cotton variety and fibre length',
          'Lint cleaner stages for trash and short-fibre removal',
          'Seed-handling system for by-product recovery',
          'Bale press for standard export-bale density and dimensions',
        ],
      },
      {
        name: 'Coffee & cocoa wet/dry processing line',
        image: 'coffee-cocoa-wet-dry-processing-line.webp',
        use: 'Pulps, ferments, washes and dries coffee cherry or cocoa pod into export-grade beans.',
        power: '20–100 kW',
        capacity: '5–30 t/day',
        leadTime: '75–120 days',
        specs: [
          'Pulping and fermentation tanks sized to daily cherry or pod intake',
          'Mechanical or raised-bed drying, matched to climate and throughput',
          'Hulling and grading station for export-grade bean sizing',
          'Moisture-testing station for consistent export moisture content',
        ],
      },
      {
        name: 'Cold-chain storage & handling system',
        image: 'cold-chain-storage-handling-system.webp',
        use: 'Holds and moves temperature-sensitive commodities between production and port.',
        power: '20–100 kW',
        capacity: '200–2,000 m³ storage',
        leadTime: '60–100 days',
        specs: [
          'Refrigeration capacity sized to storage volume and product turnover',
          'Temperature-zone segregation for products with different holding requirements',
          'Data-logging for cold-chain compliance and audit trail',
          'Loading-dock design to minimise temperature excursion during transfer',
        ],
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
        image: 'rice-maize-milling-line.webp',
        use: 'Hulls, polishes and grades grain into a finished, saleable product.',
        power: '30–150 kW',
        capacity: '20–150 t/day',
        leadTime: '60–100 days',
        specs: [
          'Pre-cleaning, husking and whitening stages in one integrated line',
          'Colour-sorter option for export-grade product',
          'By-product recovery — bran, husk — for secondary revenue',
          'Packaging station sized to bag weight and daily output target',
        ],
      },
      {
        name: 'Animal feed pellet line',
        image: 'animal-feed-pellet-line.webp',
        use: 'Grinds and pellets grain, oilseed meal and additives into livestock feed.',
        power: '15–90 kW',
        capacity: '1–10 t/hour',
        leadTime: '60–90 days',
        specs: [
          'Hammer mill for raw-material grinding ahead of the pellet press',
          'Conditioner for steam treatment, improving pellet durability',
          'Ring-die or flat-die pellet press, matched to output tonnage',
          'Cooling and screening station before bagging',
        ],
      },
      {
        name: 'Edible oil pressing & refining line',
        image: 'edible-oil-pressing-refining-line.webp',
        use: 'Presses and refines oilseed into bottled cooking oil.',
        power: '30–200 kW',
        capacity: '10–100 t/day seed',
        leadTime: '90–150 days',
        specs: [
          'Mechanical expeller press, with solvent-extraction option for higher yield',
          'Degumming, neutralising, bleaching and deodorising stages',
          'Filtration and polishing stage for clear, bottled-grade oil',
          'Bottling and capping line integration for finished-goods output',
        ],
      },
      {
        name: 'Cassava/starch processing line',
        image: 'cassava-starch-processing-line.webp',
        use: 'Peels, grates and extracts starch from cassava roots for food or industrial use.',
        power: '20–100 kW',
        capacity: '5–40 t/day roots',
        leadTime: '75–110 days',
        specs: [
          'Washing and peeling station ahead of grating',
          'Grating and pulping stage to release starch from fibre',
          'Extraction and sieving circuit for starch-milk separation',
          'Drying and packing station for finished starch or flour product',
        ],
      },
      {
        name: 'Fruit & vegetable processing line',
        image: 'fruit-vegetable-processing-line.webp',
        use: 'Washes, sorts, cuts and packs fresh or frozen produce.',
        power: '15–75 kW',
        capacity: '2–20 t/day',
        leadTime: '60–100 days',
        specs: [
          'Washing, sorting and grading stations ahead of cutting or processing',
          'Blanching or pasteurising stage, matched to product and shelf-life target',
          'Freezing (IQF) or canning line options for preservation method',
          'Packaging station for retail pack or bulk export format',
        ],
      },
    ],
  },
  {
    industry: 'Packaging & printing',
    intro:
      'Flexible packaging, filling and print-finishing equipment for branded goods.',
    items: [
      {
        name: 'Flexographic printing press',
        image: 'flexographic-printing-press.webp',
        use: 'Prints multi-colour graphics onto flexible packaging film.',
        power: '15–60 kW',
        capacity: '100–300 m/min',
        leadTime: '60–90 days',
        specs: [
          'In-line multi-colour stations, typically 4–8, matched to design complexity',
          'Compatible with film, paper and light-board substrates',
          'Anilox roller system for consistent ink lay-down',
          'In-line slitting and rewinding for finished-roll output',
        ],
      },
      {
        name: 'Pouch & sachet forming line',
        image: 'pouch-sachet-forming-line.webp',
        use: 'Forms, fills and seals flexible pouches and sachets.',
        power: '10–40 kW',
        capacity: '60–200 pouches/min',
        leadTime: '60–90 days',
        specs: [
          'Vertical or horizontal form-fill-seal, matched to product — liquid, powder or granule',
          'Multi-lane configuration for small-sachet high-speed output',
          'Nitrogen-flush option for oxygen-sensitive products',
          'Date-coding and batch-printing integration',
        ],
      },
      {
        name: 'Sachet & bottled water production line',
        image: '',
        use: 'Purifies, fills and seals drinking water into sachets or bottles for retail sale.',
        power: '15–60 kW',
        capacity: '1,500–3,000 sachets/hour',
        leadTime: '60–90 days',
        specs: [
          'Reverse-osmosis or multi-stage filtration and UV sterilisation train',
          'Automatic sachet-forming, filling and sealing machine, or bottle-filling line',
          'Date-coding and batch-printing integration',
          'Compatible with 500ml sachet, and 50cl/75cl/1.5L bottle formats',
        ],
      },
      {
        name: 'Polythene bag making machine',
        image: '',
        use: 'Extrudes and heat-seals polythene film into shopping, refuse or packaging bags.',
        power: '15–50 kW',
        capacity: '80–250 kg film/day',
        leadTime: '60–90 days',
        specs: [
          'Blown-film extrusion line feeding an in-line or offline bag-making unit',
          'Photoelectric-tracking heat-sealing and cutting for printed film',
          'Multi-line or single-line configuration by bag width and speed required',
          'Compatible with HDPE, LDPE and biodegradable film stock',
        ],
      },
    ],
  },
  {
    industry: 'Textiles & apparel',
    intro:
      'Fabric production equipment through to finishing — the machinery behind a garment or sack order.',
    items: [
      {
        name: 'Circular/flat knitting line',
        image: 'circular-flat-knitting-line.webp',
        use: 'Knits yarn into fabric for apparel and household textiles.',
        power: '5–15 kW per machine',
        capacity: '80–200 kg/day per machine',
        leadTime: '45–75 days',
        specs: [
          'Gauge range matched to fabric-weight target — fine gauge for lightweight, coarse for heavier fabric',
          'Multiple-feeder configuration for pattern and jacquard capability',
          'Yarn-tension control for consistent fabric quality across the run',
          'Compatible with cotton, synthetic and blended yarns',
        ],
      },
      {
        name: 'Denim washing & finishing line',
        image: 'denim-washing-finishing-line.webp',
        use: 'Washes, distresses and finishes denim garments to the required shade and hand-feel.',
        power: '20–90 kW',
        capacity: '500–3,000 garments/day',
        leadTime: '60–95 days',
        specs: [
          'Industrial washing machines sized to batch volume and garment weight',
          'Stone-wash, enzyme-wash or chemical-wash process options',
          'Tumble dryer and finishing press stations',
          'Effluent-treatment integration for wastewater compliance',
        ],
      },
      {
        name: 'Nonwoven bag (PP woven sack) production line',
        image: 'nonwoven-bag-pp-woven-sack-production-line.webp',
        use: 'Weaves polypropylene tape into fabric and converts it into woven sacks and bags.',
        power: '40–150 kW',
        capacity: '5,000–20,000 bags/day',
        leadTime: '75–110 days',
        specs: [
          'Tape extrusion line to produce PP tape from resin',
          'Circular or flat weaving looms for sack fabric',
          'Cutting and sewing (or bottom-sealing) station for finished bags',
          'Printing station option for branded sacks',
        ],
      },
    ],
  },
];

export default equipmentCategories;
