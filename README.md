# ENZ INTERNATIONAL — Corporate Website

Production-track full-stack app: multi-page, multi-language (`/en`, `/sw`, `/fr`, `/zh`), SEO-first,
CRO-oriented React frontend with a working reference backend.

Built with Vite + React 18 + React Router 6 + Tailwind CSS (frontend), Express + SQLite (backend, in
`server/`). See [SETUP.md](./SETUP.md) for the full picture — SEO audit, performance checklist, what's
real vs. placeholder, and the deployment guide.

**Want zero build tooling instead?** [`static-site/`](./static-site/) is a parallel, hand-editable
version of the same site — plain HTML/CSS/JS, no npm/Node required to run or deploy it, ever. Same
content, ported from this app's data. See [`static-site/README.md`](./static-site/README.md).

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173 — runs standalone in mock mode, no backend required
```

To exercise the real backend instead of the mock:

```bash
cd server && cp .env.example .env && npm install && npm run seed:admin && npm run dev   # :4000
# then, in the frontend .env: VITE_API_BASE_URL=http://localhost:4000
```

## Scripts (frontend)

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` (also regenerates `sitemap.xml`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint (includes accessibility rules via `jsx-a11y`) |
| `npm test` | Run the Vitest unit test suite once |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run e2e` | Build, serve, and run the full Cypress e2e suite against it |
| `npm run cy:open` | Open the Cypress UI against a server you're already running |
| `npm run generate:sitemap` | Regenerate `public/sitemap.xml` from routes + blog/market slugs |

Backend scripts live in [`server/README.md`](./server/README.md).

## Project structure

```
src/
  components/   Shared UI: Header, Footer, Modal, forms, SEO, FAQ accordion, exit-intent popup, etc.
  pages/        One file per route (Home, About, Services, Markets, Insights, Contact, ...)
  layouts/      MainLayout — header/footer/modals shell wrapped around every page
  i18n/         Translation dictionary + LanguageContext (drives /:lang routing)
  context/      ModalContext (booking/portal modal open state, shared app-wide)
  data/         Static content: services, insights (blog), regions, markets, FAQs, team, testimonials
  lib/          api.js (real API client, mock fallback), analytics.js, monitoring.js, consent.js
  test/         Vitest + Testing Library specs
cypress/
  e2e/          Cypress specs: navigation, booking flow, language switching
scripts/
  generate-sitemap.mjs   Regenerates public/sitemap.xml
server/
  A working Express + SQLite backend implementing the booking/newsletter/auth/careers API — see its
  own README for setup. Runs independently of the frontend, which works in mock mode without it.
.github/workflows/ci.yml
  Lint + test + build (frontend and backend) and the full Cypress e2e suite, on every push/PR.
Dockerfile, Dockerfile.server, docker-compose.yml, nginx.conf
  Container setup for both services — see SETUP.md "Deployment guide".
```

Full setup, SEO audit, performance checklist, and deployment guide: **[SETUP.md](./SETUP.md)**.
