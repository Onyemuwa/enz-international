# Image credits

All photographs are from [Unsplash](https://unsplash.com), used under the
[Unsplash License](https://unsplash.com/license): free for commercial use, no
permission needed and no attribution required. They are credited here anyway,
because knowing where a file came from matters when you want to replace it.

| File | Photographer | Unsplash photo | Shows |
|---|---|---|---|
| `hero-factory.webp` | Lalit Kumar | `photo-1610891015188-5369212db097` | Industrial textile factory, machinery and pipes |
| `sourcing.webp` | Timelab | `photo-1590497008432-598f04441de8` | Shipping port, stacked containers and cranes |
| `quality-inspection.webp` | TECNIC Bioprocess Solutions | `photo-1747999827332-163aa33cd597` | A man measuring a metal component |
| `factory-setup.webp` | Homa Appliances | `photo-1716194583732-0b9874234218` | Large machine in a factory with people working on it |
| `about-team.webp` | Andreea Avramescu | `photo-1630487656049-6db93a53a7e9` | Four people reviewing documents at a table |
| `markets-port.webp` | Timelab | `photo-1590496793907-4d66e2994b4d` | Container ship being loaded by cranes |
| `ind-construction.webp` | Zoshua Colah | `photo-1763950865873-41f63536825b` | Metal pipes and tubes stacked indoors |
| `ind-machinery.webp` | Homa Appliances | `photo-1716191299980-a6e8827ba10b` | Blue industrial robot arm in a factory |
| `ind-consumer.webp` | EqualStock | `photo-1741176505800-caaa3a52631a` | Workers sewing textiles in a factory |
| `ind-commodities.webp` | Dominik Vanyi | `photo-1523848309072-c199db53f137` | Excavators at a mining area |

Each is served as WebP at roughly the size it renders — about 1.9 MB across all
ten, versus roughly 6 MB if the same photographs were shipped as JPEG.

## These are stock. Replace them when you can.

A genuine photograph of your own operation will always outperform stock,
because buyers can tell the difference — and on a sourcing firm's site, "we are
actually there" is the entire pitch. A phone photo taken on a real supplier
visit beats a professionally shot stranger's factory.

To swap one: drop the new file into this folder and update the matching `src`
in [`_content/images.js`](../../_content/images.js), then run
`node _generate-static.mjs` and rebuild the CSS. Keep the same aspect ratio as
the `size` note in that file, or the crop will shift.

## One image is deliberately not stock

The founder portrait. [`_content/founder.js`](../../_content/founder.js) renders
an initials monogram instead.

Stock scenery is honest — a photograph of a container terminal shows a
container terminal, whoever took it. A stock photograph of a *person* placed
beside a real founder's name shows a stranger and asserts that it is them.
That is a different claim, and not one to ship on a live company site. Set
`photo` in that file to a real portrait and the monogram is replaced.
