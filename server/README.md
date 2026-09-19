# server/ — enquiry backend (Express + SQLite)

One Node process that does two jobs:

1. **Serves the website** — the pre-generated pages in `en/` and `assets/`, with the same redirects,
   headers and cache rules `vercel.json` used to provide.
2. **Stores what the forms send** — consultation/quote requests, newsletter sign-ups and CV
   applications go into a SQLite database, and the team is emailed when one arrives. An admin page at
   `/admin/` lists them, lets you mark them contacted/closed, add notes, export CSV and download a
   backup.

There is no build step. The site is regenerated locally (`node _generate-static.mjs`), the output is
committed, and Railway just runs `npm ci` and `npm start`.

```
server/
  index.js      entry point: listen, graceful shutdown
  app.js        wires everything together (a factory, so tests get a fresh app)
  config.js     every environment variable, in one place
  db.js         schema, migrations, all SQL
  api.js        public API: /api/bookings, /api/newsletter, /api/careers/applications, /api/health
  admin.js      /admin page + /api/admin/* (Basic auth, CSV, CV download, backup)
  notify.js     email alerts via Resend's HTTPS API
  site.js       static-site serving: redirects, headers, cache rules, the allowlist
  validate.js   input cleaning and file-type checks
  admin/        the admin page itself (plain HTML/CSS/JS, no dependencies)
  test/         end-to-end tests (`npm test`)
```

---

## Deploy to GitHub + Railway

### 1. Push to GitHub

The repo is already at `github.com/Onyemuwa/enz-international`. Commit and push as usual:

```bash
git add -A && git commit -m "…" && git push
```

`node_modules/`, `data/`, `*.db` and `.env` are git-ignored on purpose — the database holds real people's
enquiries and must never be committed.

### 2. Create the Railway service

1. [railway.com](https://railway.com) → **New Project** → **Deploy from GitHub repo** → pick
   `enz-international`.
2. Railway detects Node and runs `npm ci` then `npm start` (see `railway.json`). Node 22+ is required
   (`engines` in `package.json`, `.node-version`).

### 3. Attach a Volume — do not skip this

SQLite is a file, and **a Railway container's own disk is erased on every deploy**. Without a Volume,
every enquiry would vanish the next time you push.

1. In the service → **Settings → Volumes → Add Volume**, mount path **`/data`**.
2. That is all. Railway sets `RAILWAY_VOLUME_MOUNT_PATH=/data`, and the server puts the database
   (`/data/enz.db`) and uploaded CVs (`/data/uploads/`) there automatically.

If you forget, the server logs a loud warning at start-up and the admin page shows a red banner.

### 4. Set variables (service → **Variables**)

| Variable | Value | Notes |
|---|---|---|
| `ADMIN_PASSWORD` | a long random passphrase | **Required.** The admin is switched off until set. |
| `RESEND_API_KEY` | from [resend.com](https://resend.com) | Needed for email alerts. Without it enquiries are still saved. |
| `NOTIFY_TO` | `info@enzinternational.co` | Who gets the alert. Comma-separate for several. |
| `NOTIFY_FROM` | `ENZ Website <notifications@enzinternational.co>` | See "Email alerts" below. |
| `SITE_URL` | `https://enzinternational.co` | Default. Used for the www redirect and email links. |
| `ADMIN_USER` | `admin` | Default. Change if you like. |

Everything else has a sensible default; the full list is in `.env.example`.

### 5. Domain

1. Service → **Settings → Networking → Generate Domain** first, and open it — that is your smoke test.
2. **Custom Domain** → add `enzinternational.co` and `www.enzinternational.co`. Railway shows the DNS
   records to create at your registrar (a CNAME per host; some registrars call the apex version
   ALIAS/ANAME/"CNAME flattening"). HTTPS certificates are issued automatically once DNS resolves.
3. The server redirects `http → https` and `www → enzinternational.co` itself.

### 6. Check it works

- `https://<your-domain>/api/health` → `{"status":"ok"}`
- Send a test enquiry from the live site's contact form.
- `https://<your-domain>/admin/` → sign in → the enquiry is there, and the email arrived.

### After that: updating the site

Edit content → `node _generate-static.mjs` → (CSS changed? `cd _build && npm run css`, in that order, after
bumping `ASSET_VERSION`) → commit → push. Railway redeploys; the Volume keeps the data.

---

## Email alerts

The team is emailed for every new enquiry and application, with the visitor's address as *Reply-To*, so
"Reply" answers them directly. Sending uses [Resend](https://resend.com)'s HTTPS API rather than SMTP,
because Railway blocks outbound SMTP on its lower plans.

- **Testing:** with the default sender (`onboarding@resend.dev`) Resend only delivers to the email
  address that owns the Resend account. Set `NOTIFY_TO` to that address while testing.
- **Production:** verify `enzinternational.co` in Resend (it gives you DNS records to add), then set
  `NOTIFY_FROM` to an address on that domain.
- **If sending fails** the enquiry is still saved, the row records `notify_status = failed` with the
  reason, and the admin page shows a banner. A failed email never becomes an error for the visitor.

The privacy policy names Railway (hosting) and Resend (email). If you change either, update the "How
your submission reaches us" paragraph in `_lib/pages-detail.js` and regenerate.

## Admin page

`/admin/` — HTTP Basic auth with `ADMIN_USER` / `ADMIN_PASSWORD`. No cookies or sessions to steal.

- Tabs for enquiries, career applications and newsletter subscribers; filter by status, search.
- Set **New → Contacted → Closed**, add internal notes (never shown to visitors), reply by email.
- **Export CSV** (formula-safe) and **Download backup** (a consistent SQLite snapshot).
- Repeated wrong passwords are throttled (10 failures / 15 min per IP).

**Back up regularly.** Volumes are not backed up on every Railway plan; *Download backup* gives you a
copy you keep elsewhere. Deleting an enquiry or application in the admin is permanent, and is how you
honour a "delete my data" request (the privacy policy promises this).

## API

All JSON. Errors are `{ "message": "…" }` with a non-2xx status — the shape `assets/js/api.js` expects.

| Endpoint | Body | Success |
|---|---|---|
| `POST /api/bookings` | `name`, `email`, `phone`, `company`, `date`, `service`, `message` | `201 { id, status: "received" }` |
| `POST /api/newsletter` | `email` | `201 { status: "subscribed" }` (identical if already subscribed) |
| `POST /api/careers/applications` | multipart: `name`, `email`, `message`, optional `cv` (PDF/DOC/DOCX, ≤ 5 MB) | `201 { id, status: "received" }` |
| `GET /api/health` | — | `200 { status: "ok" }` (Railway's healthcheck) |

A message that starts `Quote request: <product>` (what the equipment page's buttons produce) is stored as
a **quote** with the product in its own column.

**Abuse controls:** per-IP rate limits (8 enquiries / 15 min, 10 sign-ups / hour, 5 applications / hour),
strict server-side validation and length caps, an identical enquiry within 10 minutes is stored once,
and uploaded files are checked by their first bytes (not their name) and stored under random names.
The page's own JavaScript spam trap (`assets/js/site.js`) is unchanged.

## Things worth knowing

- **One instance only.** SQLite is a single-writer file; `railway.json` pins `numReplicas: 1`. That is
  far more than this site's traffic needs. If you ever outgrow it, that's the moment to move to Postgres.
- **Nothing is served that isn't allowlisted.** The site *is* the repo root, so `site.js` serves only
  `/en`, `/assets` and five named root files — never `server/`, `package.json`, `_content/` or the
  database. The tests check this explicitly, including path-traversal attempts.
- **Image caching.** CSS/JS are cache-busted by `?v=ASSET_VERSION` and cached for a year. Photos keep
  their filename when replaced, so they are cached for one day, not a year — swap a stock photo for a
  real one and returning visitors see it within a day. The generated `vercel.json` and `_headers` use the
  same rule (it lives in `_generate-static.mjs`, which writes both).
- **`ALLOWED_ORIGINS`** is only for hosting the static site elsewhere (e.g. Vercel) and calling this
  server cross-origin; set `API_BASE_URL` in `assets/js/config.js` to match. Same-origin (the default)
  needs neither.

## Run it locally

```bash
npm install
ADMIN_PASSWORD=choose-something npm start     # http://localhost:3000, admin at /admin/
npm test                                       # the backend test suite (no network needed)
```

On Windows PowerShell: `$env:ADMIN_PASSWORD="choose-something"; npm start`.
Local data lives in `./data/` (git-ignored). `preview.mjs` remains a zero-dependency static-only preview.
