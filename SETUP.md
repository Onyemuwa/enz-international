# SETUP.md — Setup, SEO Audit, Performance Checklist, Deployment Guide

The entire stack is HTML, CSS, and JavaScript — no React, no Node backend, no build step, ever. This
document covers what's real vs. placeholder, the SEO/performance state, and how to deploy.

---

## 1. Before you launch — things that need YOUR input

These are placeholders on purpose. Publishing them as-is would mean shipping unverified or fabricated
claims on a live company site, which isn't something to guess on your behalf.

| Item | Where | What to do |
|---|---|---|
| Real production domain | ✅ done — `enzinternational.co`, set in `_generate-static.mjs` and baked into every canonical/hreflang tag, `robots.txt`, `sitemap.xml`, and `CNAME` | Just point your DNS at GitHub Pages — see section 7 |
| Team bios/photos | `en/about.html` (and sw/fr/zh) | Currently shows a "coming soon" placeholder instead of fake names — add a real team grid when you have photos/bios |
| Client testimonials/case studies | Not present anywhere | Add a section once you have real, permissioned quotes — nothing fabricated is included |
| Certifications (e.g. "ISO 9001") | Hero trust badges say "Certifications on request" | Add a specific certification only once you can point to a real, current certificate |
| HQ address for the embedded map | `contact.html` (all languages) | Currently centers on "Guangzhou, China" generically — swap in the real street address |
| Contact email | `assets/js/config.js` (`CONTACT_EMAIL`) | Domain matches (`info@enzinternational.co`) but confirm that inbox actually exists and is monitored |
| Operational hubs / markets list | `assets/js/config.js`, page content | Confirm the cities and 5 markets (Tanzania, Kenya, DRC, US, UK) are current |
| Privacy Policy / Terms | `privacy.html`, `terms.html` | Structural placeholder text, explicitly flagged in-page — **have a lawyer review before launch**, especially GDPR/data-processing language |
| Web3Forms access key | `assets/js/config.js` | Empty by default (mock mode) — see section 3 |

## 2. Stack

- **Markup**: hand-written semantic HTML, one real file per page per language (52 pages total: 13 pages ×
  4 languages, plus a root redirect and a shared 404).
- **Styling**: Tailwind CSS via the CDN `<script>` tag (no build step, no local config file) — same
  approach as the very first prototype this site started from.
- **Animation**: [Motion](https://motion.dev) (`assets/js/motion-effects.js`), loaded as a native ES
  module import from a CDN — the same team and animation engine as Framer Motion, but framework-free, so
  it runs without React. Powers scroll-reveal (`[data-reveal]`), count-up stats (`[data-counter]`), and
  the hero entrance stagger (`[data-hero-stagger]`). If the CDN import ever fails (offline, blocked),
  everything degrades to instantly-visible content rather than staying hidden — verified in this session's
  testing, along with a defensive fallback for the (rarer) case where the animation never fires at all.
- **Interactivity**: plain vanilla JS (`assets/js/site.js`) — no framework. Modals, tabs, FAQ accordion,
  language switcher, and form submission. No exit-intent popups, cookie banners, or sticky
  bottom bars — deliberately left out to keep the experience calm and trustworthy rather than
  aggressive-growth-hacky. Modals only ever open from an explicit click on "Book Consultation"
  or "Client Login," never unprompted.
- **Fonts**: Google Fonts (Inter) via `<link>`, with `preconnect` for performance.

## 3. Real email on form submit — no backend required

`assets/js/api.js` tries three things in order, controlled entirely from `assets/js/config.js`:

1. **`API_BASE_URL`** — if you stand up a real backend somewhere, point at it here for full persistence
   and real client-portal auth. (Not included in this repo — ask if you want one built; it would be a
   separate service you host, since "no other stack" means it can't live in this repo.)
2. **`WEB3FORMS_ACCESS_KEY`** — no backend at all. Get a free key at [web3forms.com](https://web3forms.com)
   (no account/password — the key is emailed to you). Forms POST straight to Web3Forms, which relays the
   submission to your inbox. This is the recommended path given the all-static constraint — it directly
   answers "the form should arrive by email automatically" with zero infrastructure to run or pay for.
   The one thing it can't do is client-portal login (it's a mail relay, not an auth provider).
3. **Neither set** — mock mode. Every form works and shows a success state, but nothing is sent. Safe
   default for previewing the site.

## 4. SEO audit — current state

| Check | Status |
|---|---|
| Unique `<title>`/description per page/language | ✅ |
| Canonical URLs | ✅ |
| hreflang (all 4 languages + x-default) | ✅ |
| Open Graph / Twitter Card | ✅ (add a real 1200×630 `og-cover.jpg` and a real domain before launch) |
| JSON-LD structured data | ✅ Organization/LocalBusiness (home), Service list (services), BreadcrumbList (inner pages), BlogPosting (insight posts) |
| `robots.txt` + `sitemap.xml` | ✅ 44 URLs; portal/privacy/terms correctly excluded |
| Semantic heading hierarchy (one `<h1>` per page) | ✅ |
| Real per-language URLs (not query params or client routing) | ✅ — this is the structural advantage of the all-static approach: every `/xx/page.html` is a genuinely separate, crawlable file |
| Mobile responsiveness | ✅ verified at 375px — no horizontal overflow, mobile menu functional |
| Core Web Vitals / Lighthouse score | ⏳ not yet measured — audit once deployed to a real URL; localhost scores aren't representative |
| Google Search Console / Bing Webmaster verification | ⏳ needs your domain + account |

**Ranking realistically**: on-page SEO here is solid, but competitive keywords also depend on backlinks,
domain age/authority, and content velocity (3 blog posts is a start, not a full content strategy).

## 5. Performance checklist

- [x] Zero build-step JS/CSS shipped as-is — no bundle to bloat
- [x] Font `preconnect` + `display=swap`
- [x] Motion loaded as a CDN ES module — only fetched once, cached by the browser across all 52 pages
- [x] No horizontal overflow at mobile widths
- [ ] Image optimization / WebP — revisit once real photography (team, facilities) is added
- [ ] CDN cache headers — configure at your hosting platform (Vercel/Netlify set sensible defaults for
      static files automatically; no server-side config needed for a plain static site)
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
