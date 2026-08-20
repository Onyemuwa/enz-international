# ENZ INTERNATIONAL — Corporate Website

Production-track React app: multi-page, multi-language (`/en`, `/sw`, `/fr`, `/zh`), SEO-first, CRO-oriented.

Built with Vite + React 18 + React Router 6 + Tailwind CSS. No backend yet — see [SETUP.md](./SETUP.md).

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` (also regenerates `sitemap.xml`) |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint (includes accessibility rules via `jsx-a11y`) |
| `npm test` | Run the Vitest test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run generate:sitemap` | Regenerate `public/sitemap.xml` from routes + blog slugs |

## Project structure

```
src/
  components/   Shared UI: Header, Footer, Modal, forms, SEO, FAQ accordion, etc.
  pages/        One file per route (Home, About, Services, Insights, Contact, ...)
  layouts/      MainLayout — header/footer/modals shell wrapped around every page
  i18n/         Translation dictionary + LanguageContext (drives /:lang routing)
  context/      ModalContext (booking/portal modal open state, shared app-wide)
  data/         Static content: services, insights (blog), regions, FAQs, team, testimonials
  lib/          api.js (mock-first API client), siteConfig.js (domain/contact constants)
  test/         Vitest + Testing Library specs
scripts/
  generate-sitemap.mjs   Regenerates public/sitemap.xml
public/
  robots.txt, sitemap.xml, images/
```

Full setup, backend contract, SEO audit, performance checklist, and deployment guide: **[SETUP.md](./SETUP.md)**.
