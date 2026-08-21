# ENZ INTERNATIONAL — Static Site (no build step)

Plain HTML/CSS/JS. No npm, no Node, no bundler — anywhere. Open a file, or point any static
web server at this folder, and it works.

## Run it locally

Any of these work — pick whichever you have:

```bash
# Node's npx, used only as a convenient local file server (not required to deploy):
npx serve static-site

# Or Python, if you have it:
python -m http.server 8080 --directory static-site

# Or just open static-site/en/index.html directly in a browser.
```

## Deploy it

Any static host works — there is no build command to configure:

- **Vercel**: import the repo, set **Root Directory** to `static-site`, leave build command
  empty (or set it to nothing / "Other" framework preset). No output directory setting needed.
- **Netlify**: same idea — set the base directory to `static-site`, no build command.
- **Anything else** (S3, GitHub Pages, nginx, a shared host over FTP): just upload the contents
  of this folder as-is.

## Structure

```
static-site/
  index.html          Redirects to en/index.html (root visitors land on English)
  404.html            Shared 404 page (most static hosts serve this automatically)
  robots.txt, sitemap.xml
  assets/
    js/
      config.js       The ONE place to set a real backend URL (see below)
      i18n.js          Translation dictionary (mirrors the React version's)
      api.js           Mock-first API client — same contract as ../server/
      site.js          All interactive behavior: modals, tabs, FAQ, forms, cookie
                        consent, exit-intent popup, sticky CTA, language switcher
    images/
  en/  sw/  fr/  zh/    One real folder per language — 13 pages each:
    index.html, about.html, services.html, markets.html, insights.html,
    insight-*.html (×3), contact.html, portal.html, careers.html,
    privacy.html, terms.html
```

Each page is a genuinely separate, real file — not client-side-rendered from a template. That's
what makes `/en/services.html` and `/fr/services.html` crawlable at their own URLs.

## Editing content

There is no generator to run and no source-of-truth elsewhere — **edit these `.html` files
directly**. Shared chrome (header, footer, modals) is duplicated across every page on purpose;
that's the tradeoff for having no build step. To change something in the header nav, for example,
you'll need to find-and-replace across the files that need it (a project-wide search for the text
you're changing is usually the fastest way).

## Connecting a real backend

Same contract as the React version. Open `assets/js/config.js` and set `API_BASE_URL` to your
deployed backend (see `../server/README.md`). Leave it empty to keep every form working in mock
mode — nothing is sent anywhere, but nothing breaks either.

## What's identical to the React version, and what isn't

Content and translations were ported directly from the React app's data files, so the copy is the
same. Two structural differences given the no-build constraint:

- **URLs use `.html`** (`/en/services.html`, not `/en/services`) — no server-side rewriting exists
  to hide the extension.
- **Markets are one page with anchors** (`markets.html#market-kenya`) instead of five separate
  pages — trims 20 files down to 4 without losing any content.

See the root [`SETUP.md`](../SETUP.md) for the SEO audit, performance checklist, and what still
needs your real content (team, testimonials, certifications, legal review) before launch — all of
that applies here too, unchanged.
