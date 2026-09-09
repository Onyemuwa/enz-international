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
// EACH ITEM'S `image` FIELD — EMPTY BY DEFAULT, ON PURPOSE
// ===========================================================================
// '' renders a branded placeholder block (icon + a filename hint) instead of a
// photo, the same convention every other unfilled image on this site uses —
// see _content/images.js. There are 35 of these, one per product, which is
// too many to register into that shared file one at a time, so each item
// carries its own slot inline instead.
//
// TO ADD A REAL PHOTO
//   1. Get a properly licensed photo of that TYPE of equipment — stock
//      photography (matching how the rest of this site's images were
//      sourced), or your own factory-floor photography once you have it.
//      Never a photo copied from another company's site: it would show a
//      specific unit that specific company inspected, not one of ours.
//   2. Export at roughly 1000x750px, .webp if you can.
//   3. Save it into assets/images/ and set `image` to that filename here.
//   4. Run `node _generate-static.mjs`.
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
      {
        name: 'Sanitaryware slip-casting & glazing line',
        image: 'sanitaryware-slip-casting-glazing-line.webp',
        use: 'Casts and glazes basins, cisterns and WC pans from ceramic slip.',
        power: '20–90 kW',
        capacity: '500–2,000 pcs/day',
        leadTime: '90–120 days',
        specs: [
          'Pressure or gravity slip-casting moulds, sized to basin, cistern or WC-pan geometry',
          'Automated glazing booth with spray-robot or manual touch-up stations',
          'Humidity-controlled drying chamber to reduce cracking before firing',
          'Mould-change tooling for running multiple products on one cell',
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
    ],
  },
  {
    industry: 'Industrial equipment & machinery',
    intro:
      'General-purpose production and assembly equipment, sourced for a new line or to add capacity to an existing one.',
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
        name: 'Automated packaging & palletising line',
        image: 'automated-packaging-palletising-line.webp',
        use: 'Fills, seals, labels and palletises finished goods for shipment.',
        power: '10–60 kW',
        capacity: '20–80 cartons/min',
        leadTime: '60–100 days',
        specs: [
          'Modular design — filling, sealing, labelling and case-packing stations added as needed',
          'Robotic or gantry palletiser rated to the daily throughput target',
          'Vision-based inspection for fill-level and label checks',
          'Changeover tooling for running multiple SKUs on one line',
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
        name: 'Industrial welding & robotic assembly cell',
        image: 'industrial-welding-robotic-assembly-cell.webp',
        use: 'Automates repetitive welding and assembly steps on a production line.',
        power: '15–90 kW',
        capacity: '500–2,000 joints/day',
        leadTime: '75–120 days',
        specs: [
          '6-axis robotic arm with MIG/MAG or spot-welding end effector',
          'Positioner-integrated cell for multi-sided part access',
          'Vision-guided seam tracking for parts with dimensional variance',
          'Safety-rated enclosure meeting standard robotic-cell guarding requirements',
        ],
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
        name: 'Household appliance assembly line',
        image: 'household-appliance-assembly-line.webp',
        use: 'Assembles small household appliances — fans, kettles, irons — from sourced components.',
        power: '10–40 kW',
        capacity: '500–3,000 units/day',
        leadTime: '60–90 days',
        specs: [
          'Modular assembly stations, reconfigurable for different appliance models',
          'In-line electrical safety testing before packing',
          'Component-kitting area to reduce line-side inventory',
          'Final-pack station with carton, manual and accessory insertion',
        ],
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
        image: 'ore-flotation-concentration-line.webp',
        use: 'Separates valuable mineral from waste rock to produce a saleable concentrate.',
        power: '200–1,200 kW',
        capacity: '100–1,000 t/day feed',
        leadTime: '120–180 days',
        specs: [
          'Flotation cell bank sized to feed tonnage and mineral liberation size',
          'Crushing and grinding circuit upstream, matched to ore hardness',
          'Reagent dosing system for collector, frother and depressant control',
          'Thickener and filter press for concentrate dewatering',
        ],
      },
      {
        name: 'Grain milling & processing line',
        image: 'grain-milling-processing-line.webp',
        use: 'Cleans, mills and grades grain or pulses into a finished, saleable product.',
        power: '50–300 kW',
        capacity: '50–300 t/day',
        leadTime: '75–120 days',
        specs: [
          'Cleaning and de-stoning stage ahead of the mill, to protect equipment',
          'Roller mill or hammer mill, matched to grain type and target fineness',
          'Sifting and grading stations for multiple product grades',
          'Bagging and weighing station for retail or bulk-sack output',
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
      {
        name: 'Copper cathode electro-refining line',
        image: 'copper-cathode-electro-refining-line.webp',
        use: 'Refines blister copper into high-purity cathode by electrolysis.',
        power: '500–3,000 kW',
        capacity: '50–300 t/day',
        leadTime: '150–210 days',
        specs: [
          'Electrolytic cell bank sized to the daily cathode-production target',
          'Anode-casting station upstream, matched to blister-copper feed',
          'Cathode-stripping machine for automated harvesting',
          'Electrolyte purification circuit to maintain cathode purity grade',
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
      {
        name: 'Dairy processing & packaging line',
        image: 'dairy-processing-packaging-line.webp',
        use: 'Pasteurises, packages and cold-chains milk and dairy products.',
        power: '20–100 kW',
        capacity: '2,000–20,000 L/day',
        leadTime: '75–120 days',
        specs: [
          'Pasteurisation — HTST or batch — matched to daily milk-intake volume',
          'Homogenisation stage for consistent product texture',
          'Filling line compatible with pouch, bottle or carton formats',
          'CIP (clean-in-place) system for hygiene compliance between runs',
        ],
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
        name: 'Label printing & die-cutting line',
        image: 'label-printing-die-cutting-line.webp',
        use: 'Prints and cuts self-adhesive labels to shape.',
        power: '5–20 kW',
        capacity: '30–100 m/min',
        leadTime: '45–75 days',
        specs: [
          'Digital or flexo printing, matched to run length and colour requirements',
          'Rotary die-cutting station for custom label shapes',
          'Lamination option for durability in outdoor or wet conditions',
          'Slitting and rewinding to finished roll widths for the labelling line',
        ],
      },
      {
        name: 'Blister & thermoforming packaging line',
        image: 'blister-thermoforming-packaging-line.webp',
        use: 'Forms rigid plastic packaging around a product.',
        power: '15–60 kW',
        capacity: '40–150 packs/min',
        leadTime: '60–90 days',
        specs: [
          'Forming station sized to blister-cavity depth and pack format',
          'Sealing station compatible with foil-backed or push-through blister types',
          'In-line leak and seal-integrity testing',
          'Cutting and trimming station for finished-pack output',
        ],
      },
      {
        name: 'Corrugated box printing & converting line',
        image: 'corrugated-box-printing-converting-line.webp',
        use: 'Prints and dies corrugated sheet into finished, branded boxes.',
        power: '30–120 kW',
        capacity: '8,000–20,000 boxes/day',
        leadTime: '75–110 days',
        specs: [
          'Flexo print-slotter for branded box printing in one pass',
          'Die-cutting station for custom box shapes and structural designs',
          'Stitching or gluing station for box-closure method',
          'Bundling station for palletised, ready-to-ship output',
        ],
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
        name: 'Weaving loom line',
        image: 'weaving-loom-line.webp',
        use: 'Weaves yarn into woven fabric for apparel and home textiles.',
        power: '5–20 kW per loom',
        capacity: '200–600 m/day per loom',
        leadTime: '60–90 days',
        specs: [
          'Rapier, air-jet or water-jet looms, matched to yarn type and fabric weight',
          'Warping and sizing stations upstream to prepare the warp beam',
          'Electronic jacquard option for patterned fabric',
          'Fabric-inspection station for defect detection before finishing',
        ],
      },
      {
        name: 'Dyeing & finishing line',
        image: 'dyeing-finishing-line.webp',
        use: 'Dyes, washes and finishes fabric to specification and colour standard.',
        power: '30–150 kW',
        capacity: '2–10 t/day fabric',
        leadTime: '75–110 days',
        specs: [
          'Batch (jet/jigger) or continuous dyeing, matched to fabric type and order volume',
          'Colour-matching and recipe-management system for repeatable shades',
          'Finishing stage — softening, calendering, sanforising — per fabric end-use',
          'Effluent-treatment integration for wastewater compliance',
        ],
      },
      {
        name: 'Nonwoven fabric production line',
        image: 'nonwoven-fabric-production-line.webp',
        use: 'Bonds fibre into nonwoven fabric for hygiene, medical or industrial use.',
        power: '50–250 kW',
        capacity: '1,000–5,000 kg/day',
        leadTime: '90–130 days',
        specs: [
          'Spunbond, meltblown or needle-punch process, matched to end application',
          'Web-forming and bonding stages sized to target GSM',
          'Winding and slitting station for finished-roll widths',
          'Compatible with polypropylene, polyester and blended fibres',
        ],
      },
      {
        name: 'Embroidery & finishing line',
        image: 'embroidery-finishing-line.webp',
        use: 'Embroiders and finishes garments and textile goods to order.',
        power: '5–15 kW',
        capacity: '200–1,000 pcs/day',
        leadTime: '45–75 days',
        specs: [
          'Multi-head embroidery machine, head count matched to daily order volume',
          'Digitising-software compatibility for custom design conversion',
          'Thread-break detection to reduce rework',
          'Finishing station for trimming, pressing and folding before packing',
        ],
      },
    ],
  },
];

export default equipmentCategories;
