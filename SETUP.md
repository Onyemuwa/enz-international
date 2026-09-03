# SETUP.md — Setup, SEO Audit, Performance Checklist, Deployment Guide

The entire stack is HTML, CSS, and JavaScript — no React, no Node backend, no build step, ever. This
document covers what's real vs. placeholder, the SEO/performance state, and how to deploy.

---

## 0. How form submissions reach you

**Forms deliver automatically right now.** A visitor presses Submit and the enquiry arrives at
`CONTACT_EMAIL` with nothing further for them to do. Delivery is chosen in `assets/js/config.js`,
first configured option wins:

| | needs | automatic |
|---|---|---|
| `API_BASE_URL` | your own backend | yes |
| `WEB3FORMS_ACCESS_KEY` | a free key, no account | yes — **recommended** |
| `FORMSUBMIT_EMAIL` | nothing | yes — **live now** |
| nothing set | — | no, opens the visitor's mail app |

**Every automatic path falls back to the mail-app handoff if the send fails** — offline visitor, ad
blocker eating a third-party POST, relay down. A form must never show success and drop the enquiry;
when it falls back the copy changes to "press send", so we only claim what we can actually know.

### Two things to do

1. **Activate FormSubmit** (required while it is the live path). It holds mail until the address is
   confirmed. Submit one test enquiry on the live site, then click the activation link it emails to
   `info@enzinternational.co` — **check spam**. Until you do, submissions are held, not delivered.
2. **Then move to Web3Forms.** Free key in ~30s at [web3forms.com](https://web3forms.com), no account.
   Paste it into `WEB3FORMS_ACCESS_KEY`. It is checked *before* FormSubmit, so it takes over with no
   code change. You gain 250 submissions/month, a 30-day submission archive (an email lost to a spam
   filter stops being a lost lead) and a published DPA you can name in the privacy policy.

After changing `config.js`: bump `ASSET_VERSION` in `_lib/site-config.js`, run
`node _generate-static.mjs`, redeploy. Otherwise browsers keep serving the cached config.

The careers/CV form stays a mail handoff on purpose — FormSubmit's AJAX endpoint takes JSON, not
files, so a CV would be silently dropped while the applicant was told it went through.

---

## 1. Before you launch — things that need YOUR input

These are placeholders on purpose. Publishing them as-is would mean shipping unverified or fabricated
claims on a live company site, which isn't something to guess on your behalf.

| Item | Where | What to do |
|---|---|---|
| Real production domain | ✅ done — `enzinternational.co`, set in `_generate-static.mjs` and baked into every canonical/hreflang tag, `robots.txt`, and `sitemap.xml` | Point your DNS at whichever host you use — `vercel.json` and `_headers` are both committed, so Vercel, Netlify, Cloudflare Pages, and GitHub Pages all work with no build command |
| **Photography** | `_content/images.js` | **The biggest visual upgrade available.** The site had two images on it, both the logo. Ten image slots are now built into the layouts and render a branded gradient until filled. Each entry carries the exact filename, pixel size and a brief describing what to buy. Drop files into `assets/images/`, set `src`, regenerate |
| Team bios/photos | `_lib/pages-primary.js` | Shows the founder note rather than fake names — add a real team grid when you have photos/bios |
| Client testimonials/case studies | `_content/proof.js` | Sections are built and styled but render nothing while the arrays are empty. Add real, permissioned entries and they appear automatically — nothing fabricated is shipped |
| Certifications (e.g. "ISO 9001") | Hero trust badges say "Certifications on request" | Add a specific certification only once you can point to a real, current certificate |
| HQ address for the embedded map | `contact.html` (all languages) | Currently centers on "Guangzhou, China" generically — swap in the real street address |
| Contact email | `assets/js/config.js` (`CONTACT_EMAIL`) | Domain matches (`info@enzinternational.co`) but confirm that inbox actually exists and is monitored |
| Operational hubs / markets list | `assets/js/config.js`, page content | Confirm the cities and 5 markets (Tanzania, Kenya, DRC, US, UK) are current |
| Privacy Policy / Terms | `_lib/pages-detail.js` | Rewritten to describe what the site **actually does** — no cookies, no analytics, no tracking (verified against the shipped JS), and how the form relay works. The in-page "placeholder" banner is gone. Still worth a legal review for UK/EU obligations, but it is no longer placeholder text |
| **Activate form delivery** | `assets/js/config.js` | **Launch blocker.** See section 0 — one test submission plus one click in your inbox. |
| Homepage stat strip | `_content/stats.js` | Now counted from the site's own content (5 markets, 4 inspection stages, 3 service lines, 24h response). The old 10+/50+/200+/98% set was removed: it claimed 50+ markets on a site listing five. Add real track-record numbers with `confirmed: true` |
| Article bylines | `_content/authors.js` | Credited to the organisation. Set `byline` to `'founder'` only if Erick genuinely authored/owns them |

## 2. Stack

- **Markup**: hand-written semantic HTML, one real file per page (27 pages, plus a root redirect and a
  shared 404). English-only — see the header of `_content/translations.js` for why `/sw/`, `/fr/` and
  `/zh/` were withdrawn, and the four steps to publish a language properly.
- **Styling**: one plain stylesheet, `assets/css/site.css`, committed to the repo. It is compiled from
  `_build/tailwind.src.css` only when markup changes — deploying still needs no build step. This
  replaced the Tailwind Play CDN, which ships a compiler to every visitor, warns in the console, and
  restyles the page after first paint. See [_build/README.md](./_build/README.md).
- **Animation**: [Motion](https://motion.dev) (`assets/js/motion-effects.js`), loaded as a native ES
  module import. Vendored at `assets/js/vendor/motion.min.js` rather than fetched from a CDN, so there is no
  third-party runtime dependency — same team and engine as Framer Motion, framework-free, so
  it runs without React. Powers staggered reveals (`[data-reveal-group]`) and count-up stats
  (`[data-counter]`).

  The safety order is load-bearing: HTML and CSS render everything visible, Motion is imported, and only
  *after* a successful import is anything hidden — one element at a time, immediately before animating it
  back in. A watchdog then clears every inline style unconditionally after 4s. Every failure path ends at
  "visible", which is precisely how the four earlier scroll-reveal attempts failed and this one does not.
- **Interactivity**: plain vanilla JS (`assets/js/site.js`) — no framework. The booking modal, FAQ
  accordion, scroll-linked chrome, language switcher, and form submission. No exit-intent popups, cookie
  banners, or sticky bottom bars — deliberately left out to keep the experience calm and trustworthy
  rather than aggressive-growth-hacky. The modal only ever opens from an explicit click on "Book
  Consultation", never unprompted.
- **Fonts**: Google Fonts (Inter) via `<link>`, with `preconnect` for performance.

## 3. Real email on form submit — no backend required

`assets/js/api.js` tries three things in order, controlled entirely from `assets/js/config.js`:

1. **`API_BASE_URL`** — if you stand up a real backend somewhere, point at it here for full persistence
   of submissions. (Not included in this repo — ask if you want one built; it would be a
   separate service you host, since "no other stack" means it can't live in this repo.)
2. **`WEB3FORMS_ACCESS_KEY`** — no backend at all. Get a free key at [web3forms.com](https://web3forms.com)
   (no account/password — the key is emailed to you). Forms POST straight to Web3Forms, which relays the
   submission to your inbox. This is the recommended path given the all-static constraint — it directly
   answers "the form should arrive by email automatically" with zero infrastructure to run or pay for.
   It is a mail relay, so it delivers submissions but does not store them anywhere you can query.
3. **Neither set** — the submission opens the visitor's own email client with the enquiry pre-written:
   recipient, subject and every field filled in. Works everywhere with no configuration; the visitor
   presses send. This is what runs today. See section 0.

## 4. SEO audit — current state

| Check | Status |
|---|---|
| Unique `<title>`/description per page/language | ✅ |
| Canonical URLs | ✅ |
| hreflang (published languages + x-default) | ✅ — every tag now describes a page genuinely in that language |
| Open Graph / Twitter Card | ✅ (add a real 1200×630 `og-cover.jpg` and a real domain before launch) |
| JSON-LD structured data | ✅ one merged `@graph` per page: Organization + WebSite sitewide, plus LocalBusiness/FAQPage (home), Service list (services, pricing), HowTo (process), BreadcrumbList (inner pages), BlogPosting (insight posts) |
| `robots.txt` + `sitemap.xml` | ✅ 76 URLs with `lastmod`/`priority`; nothing is excluded. Privacy and terms are indexable — a reachable privacy policy is a trust signal, and hiding it gained nothing |
| Semantic heading hierarchy (one `<h1>` per page) | ✅ |
| Real per-language URLs (not query params or client routing) | ✅ — this is the structural advantage of the all-static approach: every `/xx/page.html` is a genuinely separate, crawlable file |
| Mobile responsiveness | ✅ verified at 360/768/1280 across en/fr/zh — zero horizontal overflow, mobile menu functional |
| Core Web Vitals / Lighthouse score | ⏳ not yet measured — audit once deployed to a real URL; localhost scores aren't representative |
| Google Search Console / Bing Webmaster verification | ⏳ needs your domain + account |

**Ranking realistically**: on-page SEO here is solid, but competitive keywords also depend on backlinks,
domain age/authority, and content velocity (3 blog posts is a start, not a full content strategy).

## 5. Performance checklist

- [x] One compiled stylesheet (~42KB minified) instead of a CDN compiler on the critical path
- [x] Font `preconnect` + `display=swap`
- [x] Motion vendored locally — one fetch, cached by the browser across all 27 pages
- [x] No horizontal overflow at 360/768/1280 in any language
- [x] Cache + security headers shipped in `_headers` and `vercel.json`
- [ ] Image optimization / WebP — revisit once real photography (team, facilities) is added
- [x] CDN cache headers — shipped in `_headers` (Netlify/Cloudflare Pages) and `vercel.json`: HTML is
      revalidated so content fixes go live immediately, `/assets/` is immutable for a year, which is safe
      because every asset URL carries `?v=ASSET_VERSION` and changes when the file does
- [ ] Lighthouse CI budget — add once deployed to a stable URL

## 6. Deployment guide

**Any static host, zero configuration**:

- **Vercel**: import the repo, leave the framework preset as "Other" / no build command. Root directory
  is the repo root. Deploy.
- **Netlify**: same — no build command, publish directory is the repo root.
- **Anything else** (S3, GitHub Pages, nginx, a shared host over FTP): upload the repo contents as-is.

There is no SPA fallback to configure — every URL is a real file, so there's nothing for a 404-to-200
rewrite rule to do. `404.html` is picked up automatically by most static hosts for genuinely unmatched
paths.

**Currently live on GitHub Pages** at `enz-international` under this repo's owner, with a `CNAME` file
already committed pointing at `enzinternational.co`. To make that domain actually serve the site, add these
DNS records at your domain registrar (whoever you bought `enzinternational.co` from):

```
Type   Name   Value
A      @      185.199.108.153
A      @      185.199.109.153
A      @      185.199.110.153
A      @      185.199.111.153
```

(Some registrars want an ALIAS/ANAME record instead of 4 A records for the apex domain — use whichever
your provider supports.) GitHub auto-provisions HTTPS for the custom domain once DNS resolves, usually
within a few hours of the records propagating. No further repo changes are needed once DNS is set.

## 7. Testing

No test framework is included (that would itself be "another stack" — Node/npm-based test runners don't
fit a zero-tooling site). Verification for this build was done by hand in-browser: console-error checks,
DOM-state assertions for interactive elements (modals, tabs, forms), and viewport-width overflow checks at
375px/1280px. If you want automated regression coverage later, that's a separate decision to make
explicitly, since any JS test runner reintroduces Node/npm as a dev-time dependency (not a shipped one).
