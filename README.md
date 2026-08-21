# ENZ INTERNATIONAL — Corporate Website

Plain HTML, CSS, and JavaScript. No React, no Node backend, no bundler, no build step — anywhere, ever.
Open a file, or point any static web server at this folder, and it works.

Multi-language (`/en/`, `/sw/`, `/fr/`, `/zh/`, real per-language URLs), multi-page, SEO-optimized, and
animated with [Motion](https://motion.dev) — the same team and engine behind Framer Motion, loaded here as
a framework-free ES module so it works without React.

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
assets/
  images/
  js/
    config.js         The ONE place to set a real backend URL or Web3Forms key (see below)
    i18n.js            Translation dictionary
    api.js             Mock-first API client — real backend, Web3Forms, or mock, in that order
    motion-effects.js  Scroll-reveal, count-up stats, hero entrance — via Motion
    site.js            All other interactive behavior: modals, tabs, FAQ, forms, cookie
                        consent, exit-intent popup, sticky CTA, language switcher
en/  sw/  fr/  zh/    One real folder per language — 13 pages each:
  index.html, about.html, services.html, markets.html, insights.html,
  insight-*.html (×3), contact.html, portal.html, careers.html,
  privacy.html, terms.html
```

Each page is a genuinely separate, real file — not client-rendered from a template. That's what makes
`/en/services.html` and `/fr/services.html` crawlable at their own URLs, and what makes this deployable
anywhere with zero configuration.

## Editing content

There is no generator to run and no source-of-truth elsewhere — **edit these `.html` files directly**.
Shared chrome (header, footer, modals) is duplicated across every page on purpose; that's the tradeoff for
having no build step. To change something in the header nav, for example, a project-wide search for the
text you're changing is the fastest way to find every place it needs to change.

## Real email on form submit (no backend required)

Open `assets/js/config.js` and set `WEB3FORMS_ACCESS_KEY` to a free key from
[web3forms.com](https://web3forms.com) (no account/password — just an emailed key, ready in under a
minute). Every form (booking, newsletter, CV upload) then emails its submission straight to your inbox.
Leave it empty to keep forms in mock mode — they work locally, nothing is sent.

Full details, including the alternative of running a real backend, plus the SEO audit and performance
checklist: **[SETUP.md](./SETUP.md)**.
