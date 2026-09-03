// Photography manifest.
//
// ---------------------------------------------------------------------------
// EVERY SLOT SHIPS EMPTY, AND THE SITE LOOKS DELIBERATE EITHER WAY.
// ---------------------------------------------------------------------------
// The site had exactly two images on it — the logo, twice — which is the real
// reason it read as a template no matter how the boxes were styled. Every
// premium B2B site in this category is carried by photography.
//
// So the layouts are now built around images. Each slot below has a `src` that
// is empty by default. While it is empty the layout renders a branded gradient
// block in the same aspect ratio, which looks intentional rather than broken.
// Drop a file into assets/images/ and set `src`, and that block becomes the
// photograph with no markup to touch.
//
// TO FILL THESE IN
//   1. Buy or shoot the image described in `brief`.
//   2. Export it at the pixel size in `size`, as .webp if you can (about a
//      third the weight of JPEG at the same quality) or .jpg otherwise.
//   3. Save it into assets/images/ using the filename in `file`.
//   4. Set `src` to that filename here.
//   5. Run `node _generate-static.mjs`, then rebuild the CSS.
//
// `alt` is written already, because alt text describes the intent of the slot
// and that does not change when the file arrives. Adjust it if your photo
// shows something meaningfully different — it is read aloud to screen-reader
// users and indexed by search engines.
//
// A NOTE ON STOCK
// Avoid the obvious "business handshake in front of a skyline" register; it
// signals stock louder than no image at all. Look for photographs that could
// plausibly have been taken on one of your own jobs: a real container yard, a
// real production line, hands on an actual product. Unsplash and Pexels are
// free and permit commercial use; iStock and Adobe Stock are paid and have far
// deeper industrial libraries.
// ---------------------------------------------------------------------------

/** @type {Record<string, {src: string, file: string, alt: string, size: string, brief: string}>} */
export const images = {
  hero: {
    src: 'hero-factory.webp',
    file: 'hero-factory.webp',
    alt: 'Production line inside a Chinese manufacturing facility',
    size: '2000×1200 (landscape, will be cropped to 16:9 and shorter on mobile)',
    brief:
      'The single most important image on the site. A working production floor or container terminal, shot wide, with depth. Needs a calm area on the LEFT THIRD where the headline sits — busy detail there will fight the text. Cool daylight suits the palette better than warm tungsten.',
  },

  qualityControl: {
    src: 'quality-inspection.webp',
    file: 'quality-inspection.webp',
    alt: 'Inspector checking goods against a specification sheet before shipment',
    size: '1200×900 (4:3)',
    brief:
      'Someone actually inspecting: calipers, a checklist, a clipboard, goods in shot. This is the proof image for the four-stage QC claim, so it should look like work rather than a posed portrait.',
  },

  factorySetup: {
    src: 'factory-setup.webp',
    file: 'factory-setup.webp',
    alt: 'Machinery being installed and commissioned in a new facility',
    size: '1200×900 (4:3)',
    brief: 'Machinery installation, an assembly line mid-build, or an empty industrial unit being fitted out.',
  },

  sourcing: {
    src: 'sourcing.webp',
    file: 'sourcing.webp',
    alt: 'Shipping containers stacked at a port terminal',
    size: '1200×900 (4:3)',
    brief: 'Containers at port, a loading crane, or freight being consolidated. Avoid anything that reads as a stock "global trade" montage.',
  },

  about: {
    src: 'about-team.webp',
    file: 'about-team.webp',
    alt: 'ENZ INTERNATIONAL staff at work',
    size: '1600×1000 (16:10)',
    brief:
      'Ideally your own team, since this is the page where a real photograph does the most work. A supplier meeting or a site visit both work. If you use stock here, keep it unposed.',
  },

  markets: {
    src: 'markets-port.webp',
    file: 'markets-port.webp',
    alt: 'Cargo vessel being loaded at an East African port',
    size: '1600×900 (16:9)',
    brief: 'A port, a road freight convoy, or a market scene in one of the served regions. Something recognisably East African rather than generic.',
  },
};

// Industry cards. Small, so they crop hard — pick images that survive being
// cut to a wide strip and read at a glance rather than needing inspection.
/** @type {Record<string, {src: string, file: string, alt: string}>} */
export const industryImages = {
  'Construction & building materials': {
    src: 'ind-construction.webp', file: 'ind-construction.webp',
    alt: 'Tiles, fittings and finishing materials stacked at a building site',
  },
  'Industrial equipment & machinery': {
    src: 'ind-machinery.webp', file: 'ind-machinery.webp',
    alt: 'Production machinery on an assembly line',
  },
  'Consumer goods & retail': {
    src: 'ind-consumer.webp', file: 'ind-consumer.webp',
    alt: 'Packaged consumer goods moving along a production line',
  },
  'Commodities & raw materials': {
    src: 'ind-commodities.webp', file: 'ind-commodities.webp',
    alt: 'Raw copper and mineral stock at a bulk handling facility',
  },
  // These three ship empty on purpose, same as every other slot in this file
  // until a real photo is dropped in — see the file header. They are NOT
  // filled with imagery pulled from a reference site: an image of a specific
  // named company's product implies ENZ inspected that exact machine, which
  // nobody here has. A gradient placeholder here is honest; a stranger's
  // product photo under this industry's name would not be.
  'Agriculture & food processing': {
    src: '', file: 'ind-agriculture.webp',
    alt: 'Grain or produce moving through a processing line',
  },
  'Packaging & printing': {
    src: '', file: 'ind-packaging.webp',
    alt: 'Printed packaging coming off a converting line',
  },
  'Textiles & apparel': {
    src: '', file: 'ind-textiles.webp',
    alt: 'Fabric on a knitting or weaving line',
  },
};
// Every industry card uses this size.
export const INDUSTRY_IMAGE_SIZE = '800×500 (16:10)';

export default { images, industryImages, INDUSTRY_IMAGE_SIZE };
