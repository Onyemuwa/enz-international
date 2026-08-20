# ENZ INTERNATIONAL — Reference Backend

Implements the API contract documented in [`../SETUP.md`](../SETUP.md) (`/api/bookings`,
`/api/newsletter`, `/api/auth/login`, `/api/careers/applications`). SQLite-backed via Node's built-in
`node:sqlite` — no native build step, no external database service required to run locally.

## Quick start

```bash
cp .env.example .env
npm install
npm run seed:admin   # creates a client-portal login from SEED_ADMIN_* in .env
npm run dev           # http://localhost:4000
```

Point the frontend at it by setting `VITE_API_BASE_URL=http://localhost:4000` in the frontend's `.env`.

## What's real vs. still a placeholder

- **Real**: input validation (zod), password hashing (bcrypt) + JWT issuance for portal login,
  SQLite persistence, rate limiting (general + a tighter limit on login), CORS locked to
  `FRONTEND_ORIGIN`, `helmet` security headers, PDF-only + 5MB-capped CV uploads.
- **Placeholder**: email delivery falls back to logging to the console when no `SMTP_*` env vars are
  set — safe for local dev, but you need a real SMTP provider (SendGrid, AWS SES, Postmark, etc.)
  before booking/application notifications actually reach an inbox.
- **No self-serve signup**: client-portal accounts are created via `npm run seed:admin`, not through
  the website. That's intentional — there's no product requirement yet for prospects to self-register
  as clients; provisioning stays a deliberate action by your team.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start with auto-restart on file changes |
| `npm start` | Start once (production) |
| `npm run seed:admin` | Create/update a portal login from `SEED_ADMIN_*` env vars |
| `npm run lint` | ESLint |
| `npm test` | Run the API test suite (Node's built-in test runner + supertest, isolated SQLite file) |

## Data

SQLite file lives at `data/enz.sqlite3` (gitignored). Uploaded CVs land in `uploads/` (also gitignored,
and not currently served back over HTTP — they're stored for your team to retrieve manually or wire up
to real storage like S3 in a later pass).

## Deploying this alongside the frontend

This is a standard Node/Express process — deploy it anywhere that runs Node ≥22.5 (Railway, Render,
Fly.io, a VPS, or a container — see `../Dockerfile.server`). It is **not** a serverless function set;
if you'd rather deploy on Vercel/Netlify functions instead of a long-running process, the four route
handlers in `src/routes/` would need adapting to that platform's function signature — flag it if you'd
like that version instead.

Whatever you deploy to, set real values for `JWT_SECRET`, `SMTP_*`, and `FRONTEND_ORIGIN` — the server
refuses to start in production with the placeholder `JWT_SECRET`.
