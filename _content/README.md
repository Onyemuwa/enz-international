# _content/ — not part of the live site

These `.js` files are **not loaded by any page** and **not required to run or deploy the site**. They
exist purely as structured source data (services, insights, markets, regions, FAQs, and the 4-language
translation dictionary) that `../_generate-static.mjs` reads to regenerate every `.html` page at once.

Why this exists at all, despite the site being "no build step, ever": the first time all this content was
written, it briefly lived only inside a React app's `src/` folder. When that got deleted (per the "pure
HTML/CSS/JS" request), the only reason the translated content wasn't lost for good was that it was still
recoverable from git history. Keeping a plain copy here removes that fragility — if you ever want another
sweeping content/design pass across all 52 pages at once, `node _generate-static.mjs` from the repo root
regenerates everything from this data instead of hand-editing 13 files × 4 languages.

**Day-to-day edits still happen directly in the `.html` files** — a one-word copy fix doesn't need this.
This is only worth reaching for when a change touches most or all pages at once.
