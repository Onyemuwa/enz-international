# ENZ INTERNATIONAL — Corporate Website

Plain HTML, CSS, and JavaScript on the front end — no React, no bundler, and **no build step to deploy**.
The pages are pre-generated and committed, so any static web server can still serve this folder. A small
Node + SQLite server (`server/`) sits alongside it: it serves the same files and stores the enquiries the
forms send, with an admin page to read them. See [server/README.md](./server/README.md).

Multi-language (`/en/`, `/sw/`, `/fr/`, `/zh/`, real per-language URLs), multi-page, responsive,
SEO-optimized, and animated with [Motion](https://motion.dev) — the same team and engine behind Framer
Motion, vendored locally as a framework-free ES module so it works without React and without a CDN.

Everything the browser loads is a plain file already sitting in this repo: the HTML, one stylesheet, four
small scripts, and the Motion bundle. Nothing is compiled, fetched, or generated at request time.

## Run it locally

**Double-click `preview.bat`** (Windows), or run:

```bash
node preview.mjs
```

Then open **http://localhost:5500/en/**. Nothing to install — `preview.mjs` is a
~40-line zero-dependency Node server, so it works offline.

> **Do not open the files directly from the folder.** The site uses clean URLs
> (`/en/services/`, no `.html`), which are real directories containing an
> `index.html`. `file://` has no directory-index resolution, so a browser opening
> the folder shows a *file listing* instead of the page, and every link lands on
> another listing. Any web server resolves this correctly; the one above is the
> smallest possible.

`npx serve .` and `python -m http.server 8080` both work too, if you prefer them.

## Deploy it

**Railway (recommended — runs the site and the enquiry database together).** Push this repo to GitHub,
create a Railway project from it, attach a Volume at `/data`, set `ADMIN_PASSWORD` and
`RESEND_API_KEY`. Step-by-step in **[server/README.md](./server/README.md)**.

**Static-only** still works: the pages need no build, so Vercel, Netlify, GitHub Pages or any web server
pointed at the root will serve the site. Without the backend the forms fall back to a relay and then to
the visitor's mail app (see `assets/js/config.js`), and there is no admin or database.

Run it locally with the backend: `npm install` then `npm start` (http://localhost:3000, admin at
`/admin/` once `ADMIN_PASSWORD` is set). `npm test` runs the backend tests.

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
en/                  The published site — 27 pages:
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

For a sweeping change that touches most or all of the 27 pages at once (e.g. a full copy rewrite, a new
sitewide section), `_generate-static.mjs` can regenerate everything from the structured content in
`_content/` — see `_content/README.md`. Neither file is loaded by the live site; they're optional
maintenance tooling, kept only so large content passes don't mean hand-editing every page by hand.

## Where form submissions go

Every form (consultation and quote requests, newsletter, CV upload) posts to the bundled backend, which
saves it to SQLite and emails the team. Read them at `/admin/`. If the backend is unreachable, forms fail
over to a relay and then to the visitor's mail app, so an enquiry is never silently lost — the order and
the switches are documented at the top of `assets/js/config.js`.

Full details, plus the SEO audit and performance checklist: **[SETUP.md](./SETUP.md)**.
