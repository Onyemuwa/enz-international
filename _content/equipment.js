// Equipment ENZ helps buyers source, grouped by industry.
//
// ===========================================================================
// A SHORT LIST ON PURPOSE
// ===========================================================================
// This used to be ~178 production lines. It is now the 21 below, because a
// short catalogue where every card has a photograph reads as considered, and a
// long one where most cards are text-only reads as a directory. Each remaining
// product has its own photograph (no two cards share one).
//
// Nothing was lost: the full list, with descriptions, is in git history
// (commit faa3e33, this file). To bring a line back, add an `it(...)` entry
// below, drop its photograph into assets/images/, and set the image filename.
// Good candidates once photographed: bottled water, tissue paper, biscuits,
// noodles, toilet roll, paper cups, sachet water, diaper lines.
//
// ===========================================================================
// WHAT THIS IS (AND IS NOT)
// ===========================================================================
// This is not a list of specific machines from named, verified factories and
// not stock ENZ holds. ENZ sources against a buyer's brief. Every entry is a
// TYPE of production line with a one-line description of what it does. There
// are deliberately no power, capacity or lead-time figures: a wrong number on
// a spec sheet is worse for trust than no number. Ask us for the figures for
// the line you want and we quote them against your site, voltage and output.
//
// The machine types were chosen with a production-line directory as a
// reference (names of machine types are facts, not expression). Their
// photographs and descriptions were NOT copied: descriptions here are written
// from scratch, and photographs are free-to-use stand-ins (see
// assets/images/CREDITS.md) until supplier or site photographs replace them.
//
// `industry` must match a name in _content/pages.js `industries` and a key in
// _content/images.js `industryImages` (the equipment page may use a subset).
//
// TO REPLACE A PHOTO
//   1. Export about 1000x750px, .webp.
//   2. Save it in assets/images/ and set the item's image to that filename.
//   3. `cd _build && npm run images`, then `node _generate-static.mjs`.
// ===========================================================================

const it = (name, use, image = '') => ({ name, use, image });

export const equipmentCategories = [
  {
    industry: 'Construction & building materials',
    intro: 'Brick, board, profile and ceramic lines for builders and building-materials manufacturers.',
    items: [
      it('Hollow, solid & paving brick production line', 'Presses and cures concrete or cement bricks, hollow blocks and paving stones.', 'concrete-block-paver-making-machine.webp'),
      it('Gypsum board production line', 'Makes plasterboard: mixing, forming between paper liners, drying and cutting.', 'gypsum-plasterboard-production-line.webp'),
      it('Aluminium profile extrusion line', 'Extrudes aluminium billet into window, door and structural profiles.', 'aluminium-profile-extrusion-line.webp'),
      it('Ceramic & sanitaryware production line', 'Casts, glazes and fires ceramic tableware and sanitaryware.', 'sanitaryware-slip-casting-glazing-line.webp'),
    ],
  },
  {
    industry: 'Agriculture & food processing',
    intro: 'Milling, oil, feed and food-processing lines for farms, mills and food brands.',
    items: [
      it('Animal feed pellet making machine', 'Mixes and presses feed ingredients into pellets for poultry, fish and livestock.', 'animal-feed-pellet-line.webp'),
      it('Maize milling production line', 'Cleans, degerms and mills maize into flour and grits.', 'grain-milling-processing-line.webp'),
      it('Rice milling production line', 'Hulls, whitens and grades paddy into milled rice.', 'rice-maize-milling-line.webp'),
      it('Edible oil production line', 'Presses, filters and refines vegetable and seed oils.', 'edible-oil-pressing-refining-line.webp'),
      it('Dried fruit production line', 'Washes, cuts and dries fruit and vegetables for packing.', 'fruit-vegetable-processing-line.webp'),
      it('Cheese production line', 'Processes milk into cheese, from curding to pressing.', 'dairy-processing-packaging-line.webp'),
    ],
  },
  {
    industry: 'Packaging & printing',
    intro: 'Packaging, labelling and print lines for branded goods.',
    items: [
      it('Carton & box making line', 'Cuts, prints and folds corrugated boxes.', 'corrugated-carton-production-line.webp'),
      it('Flexo printing machine', 'Prints film, paper and bags using flexographic plates.', 'flexographic-printing-press.webp'),
      it('Powder packaging plant', 'Weighs, fills and seals powders such as flour, milk and spice.', 'pouch-sachet-forming-line.webp'),
      it('PP woven bag machine', 'Weaves and converts polypropylene into woven sacks and bags.', 'nonwoven-bag-pp-woven-sack-production-line.webp'),
    ],
  },
  {
    industry: 'Plastics & rubber products',
    intro: 'Blowing, moulding and recycling lines for plastic goods.',
    items: [
      it('PET bottle blowing machine', 'Blow-moulds PET preforms into drinks and water bottles.', 'pet-bottle-blow-moulding-line.webp'),
      it('Plastic bucket production line', 'Injection-moulds buckets, basins and household plastics.', 'household-plastics-production-line.webp'),
      it('Plastic injection moulding plant', 'Injection-moulds plastic parts from household goods to crates.', 'plastic-injection-moulding-machine.webp'),
      it('Plastic (PP/PE/PET) recycling line', 'Washes, shreds and pelletises waste plastic.', 'plastic-recycling-pelletizing-line.webp'),
    ],
  },
  {
    industry: 'Textiles & apparel',
    intro: 'Garment, knitting and weaving equipment.',
    items: [
      it('Garment processing machines', 'Cutting, sewing and finishing machines for a garment workshop.', 'garment-cut-and-sew-production-line.webp'),
      it('Fabric weaving plant', 'Looms and preparation machines that weave fabric.', 'weaving-loom-line.webp'),
      it('Socks making machine', 'Knits socks on automatic circular machines.', 'circular-flat-knitting-line.webp'),
    ],
  },
];
