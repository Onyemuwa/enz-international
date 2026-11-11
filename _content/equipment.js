// Equipment ENZ helps buyers source, grouped by industry.
//
// ===========================================================================
// WHAT THIS IS (AND IS NOT)
// ===========================================================================
// This is not a list of specific machines from named, verified factories and
// not stock ENZ holds. ENZ sources against a buyer's brief. Every entry is a
// TYPE of production line or machine with a one-line description of what it
// does. There are deliberately NO power, capacity or lead-time figures here any
// more: the previous catalogue had them for 29 machines researched one by one;
// this one has ~160 lines, and a wrong number on a spec sheet is worse for
// trust than no number. Ask us for the figures for the line you want and we
// quote them against your site, voltage and output target.
//
// The product LINES were taken from a production-line directory the founder
// chose as a reference (kichuguu.com): names of machine types are facts, not
// expression. Their photographs and their descriptions were NOT copied: the
// descriptions below are written from scratch, and photographs are either an
// ENZ-licensed stock photo already on disk (see assets/images/CREDITS.md) or
// empty until the founder supplies real ones. Cards with no image render
// without a photo box rather than with a grey placeholder.
//
// Near-duplicates in the source list (e.g. "toilet tissue line" and "toilet
// tissue line, cheaper") are merged into one entry; a price tier is a quote
// conversation, not a separate machine.
//
// `industry` must match a name in _content/pages.js `industries` and a key in
// _content/images.js `industryImages`. Add a category in all three places.
//
// TO ADD A PHOTO
//   1. Export about 1000x750px, .webp.
//   2. Save in assets/images/ and set the item's image to that filename.
//   3. `node _generate-static.mjs`
// ===========================================================================

const it = (name, use, image = '') => ({ name, use, image });

export const equipmentCategories = [
  {
    industry: 'Construction & building materials',
    intro: 'Brick, board, roofing and profile lines for builders and building-materials manufacturers.',
    items: [
      it('Hollow, solid & paving brick production line', 'Presses and cures concrete or cement bricks, hollow blocks and paving stones.', 'concrete-block-paver-making-machine.webp'),
      it('Interlocking brick making machine', 'Forms interlocking earth or cement bricks that stack without mortar.'),
      it('Brick-making plant', 'Turns clay or cement mix into bricks, from mixing through forming and drying.'),
      it('Cement panel machinery', 'Forms and finishes cement-based wall and floor panels.'),
      it('Gypsum board production line', 'Makes plasterboard: mixing, forming between paper liners, drying and cutting.', 'gypsum-plasterboard-production-line.webp'),
      it('Gypsum ceiling tile production line', 'Casts and dries gypsum ceiling tiles in standard sizes.'),
      it('Gypsum cornice production line', 'Produces gypsum cornices and ceiling mouldings.'),
      it('Gypsum decoration production line', 'Casts decorative gypsum elements such as rosettes and wall relief.'),
      it('Galvanized metal roof tile production line', 'Rolls galvanised steel coil into pressed roof tiles.'),
      it('Roofing sheet forming line', 'Roll-forms coil into corrugated and trapezoidal roofing sheets.'),
      it('Stone-coated roofing sheet line', 'Coats steel roofing tiles with stone chips for a tile-like finish.'),
      it('Aluminium profile extrusion line', 'Extrudes aluminium billet into window, door and structural profiles.', 'aluminium-profile-extrusion-line.webp'),
      it('Building steel rod (rebar) rolling mill', 'Rolls billet into reinforcing bar for construction.'),
      it('Steel rolling machine', 'Hot or cold rolls steel into bar, strip and simple sections.'),
      it('Hand steel bar cutting machine', 'Cuts reinforcing bar on site without a full workshop.'),
      it('Steel hollow section production line', 'Forms and welds square and rectangular steel tubing.'),
      it('Door skin production line', 'Presses wood-fibre panels into moulded door skins.'),
      it('MDF board production plant', 'Makes medium-density fibreboard from wood fibre and resin.'),
      it('Plywood production line', 'Peels, glues and presses veneer into plywood sheets.'),
      it('PVC wall panel production line', 'Extrudes PVC wall and ceiling panels.'),
      it('Wood-plastic composite production line', 'Extrudes decking, cladding and profiles from wood fibre and plastic.'),
      it('Float glass processing line', 'Cuts, edges and processes flat glass for windows and facades.'),
      it('Stone processing line', 'Cuts and polishes natural or artificial stone into slabs and tiles.'),
    ],
  },
  {
    industry: 'Industrial equipment & machinery',
    intro: 'General-purpose industrial machines, power and workshop equipment.',
    items: [
      it('Silent diesel generator', 'Sound-attenuated diesel generator set for backup or primary power.'),
      it('Well drilling machine', 'Rig for drilling water boreholes and shallow wells.'),
      it('Filtering machine', 'Filters liquids or oils to remove solids in process lines and workshops.'),
      it('Distillation & extraction equipment', 'Separates and extracts liquids and essences, from spirits to plant oils.'),
      it('Liquid filling machine', 'Fills bottles and containers with liquids, from water to oils and sauces.'),
      it('Crimping machine', 'Crimps fittings onto hydraulic hose and cable assemblies.'),
      it('Pipe bending machine', 'Bends pipe and tube to a set angle for fabrication.'),
      it('Hose skiving machine', 'Strips hose cover ahead of fitting a coupling.'),
      it('Hose pressure test machine', 'Pressure-tests hose assemblies before they ship.'),
      it('Laser marking machine', 'Marks logos and serial numbers onto metal, plastic and packaging.'),
      it('Key duplicating machine', 'Cuts duplicate keys for retail and kiosk use.'),
      it('Photovoltaic panel production line', 'Assembles, laminates and tests solar modules.'),
    ],
  },
  {
    industry: 'Metal, hardware & electrical',
    intro: 'Fasteners, wire, cable and small-metalware lines for hardware makers.',
    items: [
      it('Automatic nail making machine', 'Draws wire into nails at high speed, with heading and pointing.'),
      it('Roofing nail & screw production line', 'Makes roofing nails and self-tapping screws from wire.'),
      it('Screw & nut production line', 'Forms, threads and finishes screws, bolts and nuts.'),
      it('Hinge production line', 'Stamps, forms and assembles door and cabinet hinges.'),
      it('Door lock production line', 'Machines and assembles door locks and lock sets.'),
      it('Steel wire production line', 'Draws steel wire for kitchenware, mesh and general use.'),
      it('Fence wire production line', 'Produces chain-link and welded fence wire.'),
      it('Electric cable production line', 'Draws, insulates and sheaths electrical cable.'),
      it('Steel furniture making line', 'Cuts, bends and welds steel office and school furniture.'),
      it('Steel pipe tooling', 'Tooling and fittings for cutting, threading and joining steel pipe.'),
      it('Silverware & cutlery production line', 'Stamps, polishes and finishes spoons, forks and knives.'),
      it('Flashlight assembly line', 'Assembles torches from housings, LEDs and switches.'),
      it('Simple electronics assembly line', 'Assembles small electronics such as calculators, LED lamps, radios and toys.'),
    ],
  },
  {
    industry: 'Agriculture & food processing',
    intro: 'Farm machinery and primary processing for grain, oil, nuts, sugar and tea.',
    items: [
      it('Agricultural machinery', 'Tractors and implements for tilling, planting and harvesting.'),
      it('Wheat harvester', 'Harvests and threshes wheat and similar cereal crops.'),
      it('Peanut seeder', 'Plants groundnuts at an even depth and spacing.'),
      it('Knapsack weeding machine', 'Back-mounted petrol weeder for small farms.'),
      it('Electric sprayer', 'Battery sprayer for crop protection.'),
      it('Lawn mower', 'Petrol or electric mower for lawns and estates.'),
      it('Animal feed pellet making machine', 'Mixes and presses feed ingredients into pellets for poultry, fish and livestock.', 'animal-feed-pellet-line.webp'),
      it('Animal feed processing line', 'Grinds, mixes and bags compound feed.', 'animal-feed-pellet-line.webp'),
      it('Pet food production line', 'Extrudes and dries kibble for dogs, cats and fish.'),
      it('Aquaculture & fisheries equipment', 'Feeders, aerators and handling gear for fish and shrimp farms.'),
      it('Maize milling production line', 'Cleans, degerms and mills maize into flour and grits.', 'grain-milling-processing-line.webp'),
      it('Rice milling production line', 'Hulls, whitens and grades paddy into milled rice.', 'rice-maize-milling-line.webp'),
      it('Edible oil production line', 'Presses, filters and refines vegetable oil.', 'edible-oil-pressing-refining-line.webp'),
      it('Sunflower seed oil production line', 'Presses sunflower seed and refines the oil.', 'edible-oil-pressing-refining-line.webp'),
      it('Cashew nut processing machinery', 'Shells, peels and grades cashew nuts.'),
      it('Nut processing plant', 'Cleans, shells, roasts and packs mixed nuts.'),
      it('Ginger processing machine', 'Washes, slices and dries ginger.'),
      it('Chilli & white pepper grinding machine', 'Grinds chilli and pepper to powder.'),
      it('Coconut fibre dryer', 'Dries coconut husk fibre for bedding, rope and briquettes.'),
      it('Sisal production line', 'Decorticates and cleans sisal leaf into fibre.'),
      it('Cassava residue organic fertiliser line', 'Composts cassava waste into granulated organic fertiliser.'),
      it('Sugar processing factory', 'Crushes cane and refines it into sugar.'),
      it('Sugar cube production line', 'Presses and dries granulated sugar into cubes.'),
      it('Seed roasting machine', 'Roasts sunflower, pumpkin and other seeds evenly.'),
      it('Roasted peanut machine', 'Roasts groundnuts for snacks and butter.'),
      it('Table salt processing plant', 'Washes, dries, iodises and packs table salt.'),
      it('Tea processing & packaging line', 'Withers, rolls, dries and packs tea.'),
    ],
  },
  {
    industry: 'Food & snack production',
    intro: 'Bakery, snack, noodle and packaged-food lines for local food brands.',
    items: [
      it('Biscuit production line', 'Mixes, forms, bakes and cools biscuits and crackers.'),
      it('Bakery workshop equipment', 'Mixers, ovens and proofers for a commercial bakery.'),
      it('Instant noodle production line', 'Makes, steams, fries and packs instant noodles.'),
      it('Noodle processing line', 'Produces fresh or dried noodles.'),
      it('Pasta production line', 'Extrudes and dries pasta in common shapes.'),
      it('Potato chips (crisps) production line', 'Washes, slices, fries and seasons potato chips.'),
      it('Frozen french fries line', 'Peels, cuts, blanches and freezes potato fries.'),
      it('Banana chips making plant', 'Slices, fries and seasons banana and plantain chips.'),
      it('Dried fruit production line', 'Washes, cuts and dries fruit for packing.', 'fruit-vegetable-processing-line.webp'),
      it('Peanut butter production line', 'Roasts, grinds and fills peanut butter.'),
      it('Popcorn production line', 'Pops, coats and packs popcorn.'),
      it('Egg roll production line', 'Bakes and rolls wafer-style egg rolls.'),
      it('Lollipop & candy production line', 'Cooks, deposits and wraps hard candy and lollipops.'),
      it('Popsicle making machine', 'Freezes and packs ice lollies and popsicles.'),
      it('Canned food production line', 'Fills, seams and sterilises canned food.'),
      it('Tomato paste production line', 'Extracts, concentrates and fills tomato paste.', 'fruit-vegetable-processing-line.webp'),
      it('Cheese production line', 'Processes milk into cheese, from curding to pressing.', 'dairy-processing-packaging-line.webp'),
      it('Tea bag production line', 'Fills and seals tea into tea bags.'),
    ],
  },
  {
    industry: 'Beverage & bottled water',
    intro: 'Bottled water, soft drink, juice and alcohol lines from small plants to full factories.',
    items: [
      it('Bottled water production plant', 'Treats, bottles and caps drinking water, from raw water to packed case.'),
      it('Mineral water production line', 'Compact water bottling line for entry-level plants.'),
      it('Carbonated drinks production line', 'Mixes, carbonates and fills soft drinks.'),
      it('Fruit juice production line', 'Extracts, pasteurises and fills fruit juice.'),
      it('Brewing & beer production line', 'Brews, ferments and fills beer.'),
      it('Whisky & gin production line', 'Distils and bottles spirits.'),
      it('Sugarcane juice production line', 'Presses, filters and bottles sugarcane juice.'),
      it('Ice block making factory', 'Freezes block ice for fish, drinks and cold chain.'),
    ],
  },
  {
    industry: 'Packaging & printing',
    intro: 'Packaging, labelling and print-finishing lines for branded goods.',
    items: [
      it('Aluminium container production line', 'Stamps aluminium foil into takeaway and baking containers.'),
      it('Aluminium foil forming line', 'Rolls and forms aluminium foil for household and catering use.'),
      it('Carton & box making line', 'Cuts, prints and folds corrugated boxes.', 'corrugated-carton-production-line.webp'),
      it('Paper bag production line', 'Forms and glues paper shopping and food bags.'),
      it('Flexo printing machine', 'Prints film, paper and bags using flexographic plates.', 'flexographic-printing-press.webp'),
      it('Bottle label production line', 'Prints and cuts labels for bottles and cans.', 'label-printing-die-cutting-line.webp'),
      it('PVC label production line', 'Produces shrink and PVC labels.', 'label-printing-die-cutting-line.webp'),
      it('Printing & book-making line', 'Prints, folds and binds books and magazines.'),
      it('Exercise book manufacturing plant', 'Makes school exercise books, from paper to finished stack.'),
      it('PVC card printing machine', 'Prints ID, loyalty and membership cards.'),
      it('Birthday card printing machine', 'Prints and finishes greeting cards.'),
      it('Envelope making machine', 'Cuts, folds and glues envelopes.'),
      it('Powder packaging plant', 'Weighs, fills and seals powders such as flour, milk and spice.', 'pouch-sachet-forming-line.webp'),
      it('Glass bottle making line', 'Melts and moulds glass into bottles and jars.'),
      it('PP woven bag machine', 'Weaves and converts polypropylene into woven sacks.', 'nonwoven-bag-pp-woven-sack-production-line.webp'),
      it('Non-woven bag production line', 'Forms and sews non-woven shopping bags.', 'nonwoven-bag-pp-woven-sack-production-line.webp'),
    ],
  },
  {
    industry: 'Paper, tissue & stationery',
    intro: 'Tissue, paper-product and stationery lines.',
    items: [
      it('Tissue paper jumbo roll production line', 'Makes jumbo parent rolls of tissue from pulp or waste paper.'),
      it('Toilet roll production line', 'Rewinds, embosses and cuts jumbo rolls into toilet rolls.'),
      it('Facial tissue production line', 'Folds, cuts and packs facial tissue.'),
      it('Recycled paper production line', 'Pulps waste paper and forms recycled paper.'),
      it('Pulp moulding factory', 'Moulds waste-paper pulp into trays and protective packaging.'),
      it('Egg tray production line', 'Moulds and dries egg trays from paper pulp.'),
      it('Paper cup making machine', 'Forms and seals paper cups for hot and cold drinks.'),
      it('Cake paper cup making machine', 'Forms baking cups for cakes and cupcakes.'),
      it('Paper container production line', 'Forms paper bowls and food containers.'),
      it('Disposable lunch box production line', 'Forms disposable takeaway boxes.'),
      it('Pencil production line', 'Cuts, grooves, glues and paints wood pencils.'),
      it('Recycled newspaper pencil machine', 'Rolls waste newspaper into pencils.'),
      it('Pen production line', 'Assembles ballpoint pens and refills.'),
      it('School chalk production line', 'Moulds and dries school chalk.'),
      it('Toothpick making machine', 'Cuts and polishes bamboo or wood toothpicks.'),
    ],
  },
  {
    industry: 'Plastics & rubber products',
    intro: 'Moulding, extrusion and blowing lines for plastic goods and pipe.',
    items: [
      it('PET bottle blowing machine', 'Blow-moulds PET preforms into drinks and water bottles.', 'pet-bottle-blow-moulding-line.webp'),
      it('PE bottle blowing machine', 'Blow-moulds PE containers for oil, detergent and chemicals.'),
      it('PE container production line', 'Produces PE drums, jerrycans and containers.'),
      it('Plastic bucket production line', 'Injection-moulds buckets, lids and handles.', 'household-plastics-production-line.webp'),
      it('Plastic cup production line', 'Thermoforms disposable plastic cups.', 'household-plastics-production-line.webp'),
      it('Plastic cup lid production line', 'Forms lids for cups and containers.'),
      it('PS foam container production line', 'Foams and shapes polystyrene food boxes.'),
      it('PVC clear bottle making line', 'Forms clear PVC bottles and packs.'),
      it('PVC injection plant', 'Injection-moulds PVC fittings and parts.'),
      it('Plastic injection moulding plant', 'Injection-moulds plastic parts from household goods to crates.', 'plastic-injection-moulding-machine.webp'),
      it('HDPE water pipe production line', 'Extrudes HDPE water and irrigation pipe.'),
      it('PVC water pipe production line', 'Extrudes PVC pressure and drainage pipe.'),
      it('Fishing net & rope extrusion line', 'Extrudes monofilament yarn and twists it into rope and netting.'),
    ],
  },
  {
    industry: 'Textiles & apparel',
    intro: 'Garment, knitting, towel and footwear production equipment.',
    items: [
      it('Garment processing machines', 'Cutting, sewing and finishing machines for a garment workshop.', 'garment-cut-and-sew-production-line.webp'),
      it('Fabric weaving plant', 'Looms and preparation machines that weave fabric.', 'weaving-loom-line.webp'),
      it('Socks making machine', 'Knits socks on automatic circular machines.', 'circular-flat-knitting-line.webp'),
      it('Towel making machine', 'Weaves and finishes bath and hand towels.'),
      it('Disposable cotton towel making machine', 'Makes single-use cotton towels for salons and hotels.'),
      it('Shoelace production line', 'Braids and tips shoelaces.'),
      it('Shoe making line', 'Cuts, stitches and assembles shoes.'),
      it('EVA shoe production line', 'Moulds EVA foam sandals and shoes.'),
      it('Sole production line', 'Moulds rubber and PU shoe soles.'),
      it('Sole tape making line', 'Makes adhesive tape used in shoe-sole assembly.'),
      it('Tent production line', 'Cuts, welds and sews tents and tarpaulins.'),
      it('Leather processing plant', 'Tans, dyes and finishes hides into leather.'),
    ],
  },
  {
    industry: 'Hygiene & personal care',
    intro: 'Soap, detergent, hygiene-product and medical-disposable lines.',
    items: [
      it('Diaper & sanitary towel making line', 'Forms absorbent core, cuts and packs baby diapers and pads.'),
      it('Fully automatic sanitary napkin machine', 'Forms and packs women\'s sanitary napkins.'),
      it('Medical mask making machine', 'Welds nose wire and ear loops onto layered non-woven masks.', 'nonwoven-fabric-production-line.webp'),
      it('PP non-woven mask line', 'Makes facial and medical masks from PP non-woven.', 'nonwoven-fabric-production-line.webp'),
      it('Medical gloves production line', 'Dips, cures and strips disposable gloves.'),
      it('IV non-PVC soft bag production line', 'Forms and fills non-PVC bags for intravenous solutions.'),
      it('Toothpaste making machine', 'Mixes, fills and seals toothpaste tubes.'),
      it('Toothbrush production line', 'Moulds handles and tufts bristles.'),
      it('Bar soap production line', 'Mixes, extrudes, stamps and wraps bar soap.'),
      it('Liquid detergent production line', 'Blends and fills liquid soap and detergent.'),
      it('Washing powder production line', 'Mixes, dries and packs washing powder.'),
    ],
  },
  {
    industry: 'Consumer goods & retail',
    intro: 'Small-business production lines for everyday household goods.',
    items: [
      it('Candle making production line', 'Melts, pours and cools candles at production scale.'),
      it('Manual candle making machine', 'Entry-level candle moulding for small workshops.'),
      it('Birthday candle making machine', 'Forms and cuts birthday candles.'),
      it('Ceramic plate & cup production line', 'Presses, glazes and fires tableware.', 'sanitaryware-slip-casting-glazing-line.webp'),
      it('Stamp making machine', 'Makes rubber and polymer stamps for offices and kiosks.'),
    ],
  },
  {
    industry: 'Recycling & waste-to-energy',
    intro: 'Plastic and tyre recycling and fuel-briquette equipment.',
    items: [
      it('Plastic (PP/PE/PET) recycling line', 'Washes, shreds and pelletises waste plastic.', 'plastic-recycling-pelletizing-line.webp'),
      it('Waste tyre recycling production line', 'Shreds tyres into rubber crumb and recovers steel.'),
      it('Waste tyre & plastic pyrolysis plant', 'Heats waste tyre and plastic without oxygen to produce fuel oil and carbon.'),
      it('Sawdust briquette making machine', 'Presses sawdust into fuel briquettes.'),
      it('Coconut fibre briquette dryer', 'Dries coconut fibre ahead of briquetting.'),
    ],
  },
];
