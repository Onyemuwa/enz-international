# `_lib/` — the site generator, split into modules

Nothing here ships. These are build-time modules imported by
`../_generate-static.mjs`, which writes the actual site.

## Why this exists

`_generate-static.mjs` had grown to ~2,600 lines and held constants, URL
rewriting, translation lookup, every component, every page and the file writer
in one scroll. The only way to find out whether a component already existed was
to read the whole thing, so components got rewritten instead of reused — which
is how the booking success panel ended up as two copies that drifted until one
of them silently lost its confirmation sentence.

The generator is now 467 lines and does one job: decide what to write, and
write it.

## Layout

Dependencies point strictly downward. Nothing here imports the generator, and
no module imports one listed below it.

| module | holds |
|---|---|
| `site-config.js` | canonical URL, contact details, asset cache version, font |
| `urls.js` | clean-URL helpers and the link rewrite — read the trailing-slash note |
| `i18n.js` | `t(lang, key, vars)` |
| `icons.js` | the inline SVG set |
| `tokens.js` | design-system class aliases (`CARD`, `BTN_PRIMARY`, …) |
| `image-variants.js` | reads `assets/images/manifest.json`, builds `srcset` |
| `nav.js` | `NAV_ITEMS` and `ALL_PAGES` — the site's shape |
| `components.js` | reusable pieces: section head, media slot, engagement card, … |
| `chrome.js` | header, footer, language switcher, booking modal, breadcrumbs |
| `page-shell.js` | `<head>`, SEO, and the wrapper every page fills |
| `page-parts.js` | `pageHero` and `closingCta`, shared by the non-home pages |
| `pages-primary.js` | home, about, services, markets, insights, contact, careers |
| `pages-detail.js` | process, industries, QC, logistics, FAQ, resources, pricing, legal |

## Changing something

Run `node _generate-static.mjs` from the repo root. It rewrites all 76 pages in
place.

**Refactoring should not change output.** There is a check for that:

```bash
node _build/verify-output.mjs snapshot   # before
node _generate-static.mjs
node _build/verify-output.mjs check      # after
```

It hashes all 155 generated files. The entire split above was done against it,
one module at a time. If you are making a deliberate content change the check
is *expected* to fail — read the list of files it prints, confirm each one is a
file you meant to change, then re-snapshot.

## Conventions

- Every component returns an HTML string and touches nothing else. No shared
  mutable state, so call order never matters.
- Write links in the plain `about.html` form. `toCleanUrls()` in
  `page-shell.js` rewrites them once, for the depth the page is written at.
  Hand-writing `../` paths in a page module will break at another depth.
- One component, one definition. Two copies of anything in `chrome.js` is the
  bug described above waiting to happen again.
