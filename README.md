# ENZ INTERNATIONAL — Corporate Website

Plain HTML, CSS, and JavaScript. No React, no Node backend, no bundler, and **no build step to deploy** —
point any static web server at this folder and it works.

Multi-language (`/en/`, `/sw/`, `/fr/`, `/zh/`, real per-language URLs), multi-page, responsive,
SEO-optimized, and animated with [Motion](https://motion.dev) — the same team and engine behind Framer
Motion, vendored locally as a framework-free ES module so it works without React and without a CDN.

Everything the browser loads is a plain file already sitting in this repo: the HTML, one stylesheet, four
small scripts, and the Motion bundle. Nothing is compiled, fetched, or generated at request time.

## Run it locally

Pick whichever you have — none of them are required to deploy, only to preview:

```bash
npx serve .
# or: python -m http.server 8080
```

Or just open `en/index.html` directly in a browser.

## Deploy it

Any static host works — there is no build command to configure. Push this repo and point Vercel, Netlify,
GitHub Pages, S3, or any web server at the root. Done.

## Structure

```
index.html          Redirects to en/index.html (root visitors land on English)
404.html             Shared 404 page (most static hosts serve this automatically)
robots.txt, sitemap.xml
site.webmanifest     Installable-app + Android home-screen metadata
_headers, vercel.json  Cache and security headers, in Netlify's and Vercel's dialects.
                       Both are inert on a host that doesn't read them.
assets/
  css/
    site.css           The ONE stylesheet. Compiled from _build/ and committed — see
                       "Changing the design" below.
  images/
  js/
    config.js          The ONE place to set a real backend URL or Web3Forms key (see below)
    i18n.js            Translation dictionary
    api.js             Mock-first API client — real backend, Web3Forms, or mock, in that order
    motion-effects.js  Count-up stats, staggered reveals, hero parallax — via Motion
    site.js            All other interactive behavior: modals, tabs, FAQ, forms,
                        sticky-header state, reading progress, language switcher
    vendor/
      motion.min.js    Motion, vendored. No third-party CDN at runtime.
en/  sw/  fr/  zh/    One real folder per language — 19 pages each:
  index.html, about.html, services.html, markets.html, insights.html,
  insight-*.html (×3), contact.html, pricing.html, careers.html,
  privacy.html, terms.html
```

Each page is a genuinely separate, real file — not client-rendered from a template. That's what makes
`/en/services.html` and `/fr/services.html` crawlable at their own URLs, and what makes this deployable
anywhere with zero configuration.

## Changing the design

The design system lives in `_build/tailwind.src.css` and compiles to `assets/css/site.css`, which is
committed. **Editing markup that uses an existing class needs no rebuild.** You only rebuild when you
introduce a Tailwind class the site never used before, or when you edit the source stylesheet:

```bash
cd _build && npx tailwindcss@3.4.17 -c ./tailwind.config.cjs -i ./tailwind.src.css -o ../assets/css/site.css --minify
```

Then commit the regenerated `assets/css/site.css`. Full detail, and the reasoning behind dropping the
Tailwind Play CDN, is in **[_build/README.md](./_build/README.md)**.

## Editing content

For small changes, **edit the `.html` files directly** — nothing to run, nothing to build. Shared chrome
(header, footer, modals) is duplicated across every page on purpose; that's the tradeoff for having no
build step. To change something in the header nav, for example, a project-wide search for the text you're
changing is the fastest way to find every place it needs to change.

For a sweeping change that touches most or all of the 76 pages at once (e.g. a full copy rewrite, a new
sitewide section), `_generate-static.mjs` can regenerate everything from the structured content in
`_content/` — see `_content/README.md`. Neither file is loaded by the live site; they're optional
maintenance tooling, kept only so large content passes don't mean hand-editing 13 files × 4 languages.

## Real email on form submit (no backend required)

Open `assets/js/config.js` and set `WEB3FORMS_ACCESS_KEY` to a free key from
[web3forms.com](https://web3forms.com) (no account/password — just an emailed key, ready in under a
minute). Every form (booking, newsletter, CV upload) then emails its submission straight to your inbox.
Leave it empty to keep forms in mock mode — they work locally, nothing is sent.

Full details, including the alternative of running a real backend, plus the SEO audit and performance
checklist: **[SETUP.md](./SETUP.md)**.
