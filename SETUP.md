# SETUP.md — Setup, SEO Audit, Performance Checklist, Deployment Guide

Phase 1 replaced the original single-file CDN/Babel prototype with a real build (Vite + React Router +
Tailwind), full SEO plumbing, i18n routing, and accessibility. Phase 2 added a working reference backend,
analytics/monitoring wiring, CI/CD, Docker, e2e tests, an exit-intent popup, and per-market landing pages.
What's left is genuinely yours: real content (team, testimonials, certifications, legal review) and your
own accounts for third-party services (domain, SMTP, GA4, Sentry).

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
| Operational hubs list | `src/data/regions.js`, `src/data/markets.js` | Confirm the six cities / five markets listed are current before launch |
| Privacy Policy / Terms | `src/pages/Legal.jsx` | Structural placeholder text, explicitly flagged — **have a lawyer review before launch**, especially GDPR/data-processing language |
| Og/social preview image | `index.html`, `src/components/SEO.jsx` | Points to `/images/og-cover.jpg`, which doesn't exist yet — add a real 1200×630 image |
| Portal user accounts | `server/` | No self-serve signup by design — run `npm run seed:admin` in `server/` to create real client logins |
| SMTP provider | `server/.env` | Booking/CV notification emails log to the console until you set `SMTP_*` to a real provider (SendGrid, SES, Postmark, ...) |
| GA4 / GTM / Sentry IDs | `.env` (frontend) | All three are wired up and consent-gated but inert until you supply real IDs — see section 6 |

## 2. What's implemented, mapped to your original 11 categories

**1. SEO & metadata** — per-page `<title>`/description via `react-helmet-async`, canonical URLs, hreflang
alternates for all 4 languages + x-default, Open Graph + Twitter Card tags, JSON-LD (`Organization`
site-wide, `LocalBusiness` on Home, `Service` ItemList on Services, `BreadcrumbList` on every inner page,
`BlogPosting` on each insight post), `robots.txt`, and a generated `sitemap.xml` (44 URLs = static pages +
3 blog posts + 5 market pages, × 4 languages). *Still needs you:* Search Console verification and a real
domain before any of this can be crawled for real.

**2. Performance** — route-level code splitting via `React.lazy` for every page, a vendor chunk split from
app code, font `preconnect`/`display=swap`, and **dead-code elimination for unconfigured integrations** —
Sentry (`@sentry/react`, ~120KB gzipped) is dynamically imported and only enters the bundle at all once
`VITE_SENTRY_DSN` is set (verified: 0 bytes when unset, a separate lazy chunk when set). *Still open:*
image optimization/WebP (no real photography yet), CDN cache headers (set at your hosting layer — nginx
config included for the Docker path, see section 7), a Lighthouse CI budget.

**3. Multi-page architecture** — React Router with `/:lang/page` structure: Home, About, Services,
Markets (index + 5 per-market landing pages), Insights (list + posts), Contact, Client Portal, Careers,
Privacy, Terms, 404.

**4. Interactive features** — booking form, newsletter signup, portal login, and CV upload are all wired
to a **real backend** (`server/`, see section 3) — SQLite persistence, real password hashing + JWT for
portal login, email notifications (console-logged until you set SMTP). No calendar sync or payments yet;
flag it if you want those next. The frontend still runs standalone in mock mode if `VITE_API_BASE_URL` is
unset, so it's demoable with zero backend setup.

**5. Content** — About, Services (with process steps), 5 per-market landing pages, Insights (3 full
articles), FAQ accordion, Careers page with real CV upload. Team/testimonials intentionally left empty
(see section 1).

**6. CRO** — sticky bottom CTA bar, FAQ accordion, newsletter capture, an exit-intent popup (desktop-only,
fires once per tab session when the cursor leaves toward the top of the viewport, opens the booking
modal), 5 per-market landing pages, cookie-consent-gated analytics. *Still open:* A/B testing — Google
Optimize (the tool named in your original brief) was **discontinued by Google in 2023**; if you want
experimentation, tell me and I'll wire up an alternative (GrowthBook and PostHog both have straightforward
React SDKs) rather than build against a dead product.

**7. Analytics & monitoring** — GA4, GTM, and Sentry are all implemented and load **only after a visitor
accepts cookies** (`src/lib/analytics.js`, `src/lib/monitoring.js`, `src/lib/consent.js`), each a no-op
until you supply its ID in `.env`. GA4 fires a virtual pageview on every client-side route change (SPAs
don't get free pageviews from GA4's default snippet). Scroll-depth/engagement tracking isn't wired in —
flag it if you want it once GA4 is actually configured, since testing it meaningfully needs a real
property.

**8. Backend** — see the dedicated section below. This moved from "documented contract" to "working
implementation" in Phase 2.

**9. Security & compliance** — real password hashing (bcrypt) + JWT for portal auth (no more "any
credentials accepted"), rate limiting (general + a tighter limit on login), input validation (zod) on
every endpoint, `helmet` security headers, CORS locked to your frontend origin, PDF-only + size-capped
uploads, cookie consent banner. HTTPS/SSL is a hosting-platform concern (Vercel/Netlify provide it
automatically). Real CSRF protection is less relevant here since the API takes JSON/FormData from a
same-origin SPA rather than form posts, but flag it if your deployment shape changes that.

**10. UI/UX polish** — focus-trapped, keyboard-accessible modals, skip-to-content link, visible focus
rings, `aria-*` labeling throughout, 404 page, breadcrumbs with `BreadcrumbList` schema, print stylesheet.
*Still open:* dark mode, page-transition animations — genuinely optional polish, not blocking launch.

**11. Deployment & DevOps** — GitHub Actions CI (frontend lint/test/build, backend lint/test, Cypress e2e
— see `.github/workflows/ci.yml`), Dockerfiles for both frontend (nginx) and backend, `docker-compose.yml`
to run them together. **Not verified in this environment** — no Docker daemon was available here to build
the images; run `docker compose build` yourself before relying on it. Staging vs. production environments
and a database backup strategy are deployment-target decisions I can't make for you (they depend on where
you host `server/`) — flag it once you've picked a host and I'll set it up.

---

## 3. Backend — `server/` (or zero backend at all)

There are now two ways to get real form submissions instead of mock responses, tried in this order by
`src/lib/api.js`:

1. **`VITE_API_BASE_URL`** — the real backend below. Full persistence, real portal auth, your own database.
2. **`VITE_WEB3FORMS_ACCESS_KEY`** — no backend at all. Forms POST straight to
   [Web3Forms](https://web3forms.com), which emails the submission to whichever address you registered
   the key with. Free, no account/password (just an emailed key), set up in under a minute. This is the
   right choice if you don't want to run or pay for a backend — it directly answers "forms should arrive
   by email automatically." The one thing it **can't** do is client-portal login (it's a mail relay, not
   an auth provider) — that still needs option 1 if you want real portal accounts.

Leave both unset to stay in mock mode (forms work, nothing is sent).

A real, working implementation of the four endpoints, not just a documented contract:

```
POST /api/bookings                        { name, email, phone?, company?, date, service, message? }
POST /api/newsletter                      { email }
POST /api/auth/login                      { email, password } → { token, user }
POST /api/careers/applications  (multipart)  name, email, message, cv (PDF, ≤5MB)
```

- **Persistence**: SQLite via Node's built-in `node:sqlite` (not `better-sqlite3` — this machine had no
  Python/node-gyp toolchain to compile it, and the built-in module needs no native build step at all,
  which is arguably better for deployability anyway). Requires Node ≥22.5.
- **Auth**: bcrypt password hashing, JWT issuance, no self-serve signup — accounts are created via
  `npm run seed:admin` (see `server/README.md`).
- **Tests**: Node's built-in test runner (not Vitest — Vitest's bundled Vite couldn't resolve `node:sqlite`
  as an external, a known gap for very new Node builtins; Node's own runner sidesteps the issue entirely).
  10 tests covering all four endpoints, run with `npm test` inside `server/`.
- **Not yet real**: email delivery (logs to console until you set `SMTP_*`), file storage for CVs (local
  disk in `server/uploads/`, not S3 — fine for low volume, revisit if that grows).

Full setup: [`server/README.md`](./server/README.md). Frontend `.env`: set `VITE_API_BASE_URL` to point at
it (leave unset to keep the frontend in standalone mock mode).

**This is a long-running Node process, not a serverless function set.** If you'd rather deploy on
Vercel/Netlify functions instead of a VPS/container, the route handlers in `server/src/routes/` would need
adapting to that platform's function signature — say so and I'll do that conversion instead.

## 4. SEO audit — current state

| Check | Status |
|---|---|
| Unique `<title>`/description per page/language | ✅ |
| Canonical URLs | ✅ |
| hreflang (all 4 languages + x-default) | ✅ |
| Open Graph / Twitter Card | ✅ (og image asset itself still needs to be supplied — see section 1) |
| JSON-LD structured data | ✅ Organization, LocalBusiness, Service, BreadcrumbList, BlogPosting |
| `robots.txt` + `sitemap.xml` | ✅ 44 URLs; portal/privacy/terms correctly excluded via `noindex` + robots disallow |
| Semantic heading hierarchy (one `<h1>` per page) | ✅ |
| Image alt text | ✅ for the logo; no other imagery exists yet to audit |
| Mobile responsiveness | ✅ (Tailwind mobile-first) |
| Per-market landing pages (long-tail SEO) | ✅ Tanzania, Kenya, DRC, US, UK |
| Core Web Vitals / Lighthouse score | ⏳ not yet measured — run `npm run build && npm run preview` and audit with Lighthouse once deployed to a real URL; localhost scores aren't representative |
| Google Search Console / Bing Webmaster verification | ⏳ needs your domain + account |

**Ranking for "global sourcing China" realistically**: on-page SEO is necessary but not sufficient — that
keyword is competitive, and ranking also depends on backlinks, domain age/authority, and content velocity
(3 blog posts + 5 market pages is a start, not a full content strategy).

## 5. Performance checklist

- [x] Route-based code splitting (`React.lazy`)
- [x] Vendor chunk separated from app code
- [x] Font preconnect + `display=swap`
- [x] No unused CSS shipped (Tailwind purges by content scan)
- [x] Zero-cost when unconfigured — Sentry is dead-code-eliminated from the bundle until you set a DSN
- [ ] Image optimization / WebP — revisit once real photography (team, facilities) is added
- [ ] CDN cache headers — configured in `nginx.conf` for the Docker path; set equivalently at Vercel/Netlify
- [ ] Lighthouse CI budget — add once deployed to a stable URL

## 6. Analytics & monitoring setup

All three are already wired to `src/lib/consent.js` — nothing loads until a visitor clicks "Accept all" on
the cookie banner. To activate:

1. Copy `.env.example` to `.env` (frontend root).
2. `VITE_GA4_MEASUREMENT_ID` — from your GA4 property. Pageviews fire automatically on route change.
3. `VITE_GTM_CONTAINER_ID` — from Google Tag Manager, if you use it instead of/alongside GA4 directly.
4. `VITE_SENTRY_DSN` — from a Sentry project. Rebuild after setting it (`npm run build`) — this is when
   the Sentry chunk actually gets included; setting it at runtime with no rebuild does nothing.

## 7. Deployment guide

**Vercel or Netlify (recommended for the frontend — zero config beyond env vars):**

1. Push this repo to GitHub/GitLab.
2. Import the repo. Build command: `npm run build`. Output directory: `dist`.
3. SPA fallback is already configured: `vercel.json` (rewrite) and `public/_redirects` (Netlify) are both
   in the repo.
4. Set environment variables (`VITE_API_BASE_URL`, `VITE_GA4_MEASUREMENT_ID`, etc.) once you have them —
   leaving them unset keeps the site in mock mode, which is safe to ship.
5. Point your domain's DNS at the platform; both provision HTTPS automatically.
6. The backend (`server/`) needs somewhere else to run — it's a long-running process, not a static site.
   Railway, Render, Fly.io, or a small VPS all work; see `server/README.md`.

**Full stack via Docker** (frontend + backend together, e.g. on a VPS):

```bash
cp server/.env.example server/.env   # fill in JWT_SECRET at minimum
docker compose up --build
```

Frontend on `:8080`, backend on `:4000`. **I wrote this but couldn't verify it builds** — no Docker daemon
was available in this environment. Run `docker compose build` yourself before relying on it in production.

**Any other static host** (S3+CloudFront, GitHub Pages, etc.): needs the same SPA-fallback behavior —
configure a 404-to-200 rewrite to `index.html`, and cache `dist/assets/*` forever (`immutable`) while
keeping `index.html` uncached.

## 8. Known dependency advisories (tracked, not acted on)

- `react-router-dom` has a moderate-severity open-redirect advisory patched only in the v7 major (pinned
  to the latest 6.x patch, `^6.30.6`, in the meantime). Exposure here is low — every `navigate()`/`<Link>`
  target in this app is built from a fixed language code + static path segment, never raw user input — but
  a v6→v7 upgrade is worth scheduling once there's time to regression-test the route tree.
- `esbuild` (via Vite's and Cypress's dev-only tooling) has a known advisory that only affects local dev
  servers, not production builds — same situation on both the frontend and `server/`.
- Cypress's own dependency tree carries some older transitive packages with advisories; all devDependency
  -only, not shipped to users (`npm audit --omit=dev` on the frontend shows only the react-router item
  above).

## 9. Testing

- **Unit** (`npm test`, frontend): Vitest + React Testing Library — routing/i18n, language switching, 404
  handling, booking form validation + mock-submit flow. 5 tests.
- **Unit** (`npm test`, `server/`): Node's built-in test runner + supertest — all 4 API endpoints,
  including auth success/failure paths and file-type rejection. 10 tests, isolated SQLite file per run.
- **E2E** (`npm run e2e`, frontend): Cypress against a real production build — booking flow end-to-end,
  portal login, modal focus/Escape behavior, language switching (URL + content), navigation, 404. 9 tests,
  all passing. Runs in CI via `cypress-io/github-action`. Note: if you ever run Cypress locally on Windows
  in a sandboxed/GPU-restricted environment, `npm run cy:run` already bakes in the `--disable-gpu` flags
  that were needed to get Electron to launch here — you shouldn't need to think about this.

## 10. What's left, roughly in priority order

1. Real content (section 1) — the only thing actually blocking launch.
2. Point `server/` at a real SMTP provider so notifications land in an inbox.
3. Deploy `server/` somewhere long-running and set `VITE_API_BASE_URL` in production.
4. Verify the Docker build actually works (I couldn't test it here).
5. Decide on an A/B testing tool (Google Optimize is dead) if you still want experimentation.
6. Real photography → image optimization pass.
