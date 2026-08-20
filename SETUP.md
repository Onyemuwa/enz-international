# SETUP.md — Setup, SEO Audit, Performance Checklist, Deployment Guide

This is Phase 1 of the rebuild: a production-track multi-page foundation. It replaces the original
single-file CDN/Babel prototype with a real build (Vite + React Router + Tailwind), full SEO plumbing,
i18n routing, accessibility, and CRO scaffolding. Backend-dependent features (payments, real auth,
analytics, CMS) are wired up on the frontend but stubbed — see "Backend integration" below.

---

## 1. Before you launch — things that need YOUR input

These are placeholders on purpose. Publishing them as-is would mean shipping unverified or fabricated
claims on a live company site, which isn't something to guess on your behalf.

| Item | Where | What to do |
|---|---|---|
| Real production domain | `src/lib/siteConfig.js`, `index.html`, `scripts/generate-sitemap.mjs` | Replace `www.enzinternational.com` everywhere it appears (search for it) once you've picked/confirmed the domain |
| Team bios/photos | `src/data/team.js` | Currently empty — About page shows a "coming soon" placeholder instead of fake names |
| Client testimonials/case studies | `src/data/testimonials.js` | Currently empty, not rendered anywhere yet |
| Certifications (e.g. "ISO 9001") | Removed from hero trust badges, replaced with "Certifications on request" | Add back only once you can point to a real, current certificate |
| HQ address for the embedded map | `src/pages/Contact.jsx` | Currently just centers on "Guangzhou, China" — swap in the real street address |
| Contact email | `src/lib/siteConfig.js` (`CONTACT_EMAIL`) | Currently a placeholder `info@enzinternational.com` — confirm it's a real, monitored inbox |
| Operational hubs list | `src/data/regions.js` | Confirm the six cities listed are current before launch |
| Privacy Policy / Terms | `src/pages/Legal.jsx` | Structural placeholder text, explicitly flagged — **have a lawyer review before launch**, especially GDPR/data-processing language |
| Og/social preview image | `index.html`, `src/components/SEO.jsx` | Points to `/images/og-cover.jpg`, which doesn't exist yet — add a real 1200×630 image |

## 2. What's implemented in this pass

Mapped to your original 11 categories:

**1. SEO & metadata** — done for the frontend-controllable parts: per-page `<title>`/description via
`react-helmet-async` (`src/components/SEO.jsx`), canonical URLs, hreflang alternates for all 4 languages
+ x-default, Open Graph + Twitter Card tags, JSON-LD (`Organization` site-wide, `LocalBusiness` on Home,
`Service` ItemList on Services, `BreadcrumbList` on every inner page, `BlogPosting` on each insight post),
`robots.txt`, and a generated `sitemap.xml` (36 URLs = 6 static pages + 3 blog posts × 4 languages).
*Not done:* you'll need Google Search Console verification and a real domain before any of this can be
crawled for real.

**2. Performance** — route-level code splitting via `React.lazy` (every page is its own chunk — see the
`npm run build` output), font `preconnect`/`display=swap`, a vendor chunk split from app code, loading
skeleton for lazy routes. *Not done:* image optimization/WebP (the only image is the logo PNG; there's no
photography yet to optimize), CDN caching headers (set at your hosting layer, not app code), Lighthouse
budget enforcement in CI.

**3. Multi-page architecture** — done. React Router with `/:lang/page` structure: Home, About, Services,
Insights (list + individual posts), Contact, Client Portal, Careers, Privacy, Terms, 404.

**4. Interactive features** — booking form and portal login are fully built and functional against a
**mock API** (see below); no real calendar sync, payments, or JWT auth exist yet — those need your
provider accounts. Newsletter signup UI exists and calls the same mock pattern.

**5. Content** — About, Services (with process steps), Insights (3 full articles), FAQ accordion, Careers
page with CV upload UI. Team/testimonials intentionally left empty (see section 1).

**6. CRO** — sticky bottom CTA bar (appears after scrolling past the hero, dismissible), FAQ accordion,
newsletter capture, booking CTA repeated at every major scroll point, cookie consent banner gating future
analytics. *Not done:* exit-intent popup, per-market landing pages, A/B testing — flagged for Phase 2 since
they either need real traffic to be worth building or a testing framework decision from you first.

**7. Analytics** — not wired in yet. `.env.example` has placeholders (`VITE_GA4_MEASUREMENT_ID`,
`VITE_GTM_CONTAINER_ID`) and the cookie-consent gate is already built so analytics can be added behind it
without a GDPR compliance gap. Tell me when you have a GA4 property / GTM container and I'll wire it in.

**8. Backend** — see the dedicated section below.

**9. Security & compliance** — inputs are sent as structured JSON/FormData (no raw HTML injection points),
cookie consent banner with essential/all choice, Privacy/Terms pages present (unreviewed placeholder
copy). HTTPS/SSL is a hosting-platform concern (Vercel/Netlify provide it automatically — see deployment
guide). Real auth security (password hashing, rate limiting, CSRF) is a backend concern — see section 4.

**10. UI/UX polish** — focus-trapped, keyboard-accessible modals (Tab cycles inside, Escape closes, focus
returns to the trigger), skip-to-content link, visible focus rings, `aria-*` labeling throughout, 404 page,
breadcrumbs with `BreadcrumbList` schema, print stylesheet (`@media print` hides header/footer/nav). *Not
done:* dark mode, page-transition animations — flagged as genuinely optional polish, not blocking launch.

**11. Deployment & DevOps** — deployment guide below. Docker/CI pipeline not set up yet — see Phase 2 note.

---

## 3. Backend integration — the contract this frontend expects

`src/lib/api.js` runs in **mock mode** by default: every form works and shows success states, but nothing
is actually sent anywhere. Set `VITE_API_BASE_URL` in a `.env` file (copy `.env.example`) to point it at a
real backend, which must implement:

```
POST /api/bookings
  body: { name, email, phone?, company?, date, service, message? }
  returns: { id, status: 'received' }

POST /api/newsletter
  body: { email }
  returns: { status: 'subscribed' }

POST /api/auth/login
  body: { email, password }
  returns: { token, user: { name, email } }
  ⚠ the current mock accepts ANY credentials — a real implementation needs hashed
    passwords, rate limiting, and JWT issuance before this can go live

POST /api/careers/applications   (multipart/form-data)
  fields: name, email, message, cv (file)
  returns: { id, status: 'received' }
```

Suggested stack for Phase 2 (not built yet, your call): Node/Express or a serverless function set
(Vercel/Netlify functions) in front of Postgres, SendGrid or AWS SES for transactional email on booking
confirmation, and bcrypt + JWT for the client portal once it needs to hold real project data.

## 4. SEO audit — current state

| Check | Status |
|---|---|
| Unique `<title>`/description per page/language | ✅ |
| Canonical URLs | ✅ |
| hreflang (all 4 languages + x-default) | ✅ |
| Open Graph / Twitter Card | ✅ (og image asset itself still needs to be supplied — see section 1) |
| JSON-LD structured data | ✅ Organization, LocalBusiness, Service, BreadcrumbList, BlogPosting |
| `robots.txt` + `sitemap.xml` | ✅ (portal/privacy/terms correctly excluded via `noindex` + robots disallow) |
| Semantic heading hierarchy (one `<h1>` per page) | ✅ |
| Image alt text | ✅ for the logo; no other imagery exists yet to audit |
| Mobile responsiveness | ✅ (Tailwind mobile-first, same as the original prototype) |
| Core Web Vitals / Lighthouse score | ⏳ not yet measured — run `npm run build && npm run preview` and audit with Lighthouse once deployed to a real URL; localhost scores aren't representative |
| Google Search Console / Bing Webmaster verification | ⏳ needs your domain + account |

**Ranking for "global sourcing China" realistically**: on-page SEO is necessary but not sufficient — that
keyword is competitive, and ranking also depends on backlinks, domain age/authority, and content velocity
(the 3 blog posts here are a start, not a full content strategy). Flagging this so the SEO work here is
understood as the foundation, not a guarantee.

## 5. Performance checklist

- [x] Route-based code splitting (`React.lazy`)
- [x] Vendor chunk separated from app code
- [x] Font preconnect + `display=swap`
- [x] No unused CSS shipped (Tailwind purges by content scan — `tailwind.config.js` `content` glob)
- [ ] Image optimization / WebP — revisit once real photography (team, facilities) is added
- [ ] CDN cache headers — configure at the hosting platform (see deployment guide)
- [ ] Lighthouse CI budget — add once deployed to a stable URL

## 6. Deployment guide

**Vercel or Netlify (recommended — zero config beyond env vars):**

1. Push this repo to GitHub/GitLab.
2. Import the repo in Vercel/Netlify. Build command: `npm run build`. Output directory: `dist`.
3. **SPA fallback is required** — this is a client-side-routed app, so all paths must serve `index.html`:
   - Vercel: auto-detected for Vite projects; if not, add a `vercel.json` with a rewrite from `/(.*)` to `/index.html`.
   - Netlify: add `public/_redirects` containing `/*  /index.html  200`.
4. Set environment variables (`VITE_API_BASE_URL`, `VITE_GA4_MEASUREMENT_ID`, etc.) in the platform's
   dashboard once you have them — leaving them unset keeps the site in mock mode, which is safe to ship.
5. Point your domain's DNS at the platform; both provision HTTPS automatically.

**Any static host (S3+CloudFront, GitHub Pages, etc.):** same SPA-fallback requirement applies — configure
the host to serve `index.html` for unmatched paths (a 404-to-200 rewrite), and set `Cache-Control:
public, max-age=31536000, immutable` on the hashed files in `dist/assets/` while keeping `index.html`
uncached (`no-cache`).

## 7. Known dependency advisories (tracked, not yet acted on)

- `react-router-dom@6.26.2` has a moderate-severity open-redirect advisory (patched only in the v7 major).
  Exposure here is low — every `navigate()`/`<Link>` target in this app is built from a fixed language
  code + static path segment, never from raw user input — but a v6→v7 upgrade is worth scheduling once
  there's time to regression-test the route tree.
- `esbuild` (via Vite's dev server) has a known advisory that only affects `npm run dev` locally, not
  production builds.

## 8. Testing

`npm test` runs Vitest + React Testing Library: routing/i18n redirect behavior, language switching, 404
handling, and the booking form's validation + mock-submit success flow. This is a starting smoke-test
suite, not full coverage — Cypress/Playwright e2e tests were explicitly deferred to a later phase per your
"phase it" preference.

## 9. Suggested Phase 2 order

1. Real content: your team/testimonials/certifications/legal copy (section 1) — unblocks launch.
2. Analytics (GA4/GTM) behind the existing cookie-consent gate.
3. A real backend for the four endpoints above (start with bookings + newsletter — highest value).
4. Docker + CI (GitHub Actions: lint → test → build on every PR).
5. CRO additions that need traffic to justify: exit-intent popup, per-market landing pages, A/B testing.
