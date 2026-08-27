# `_build/` — optional tooling, not part of the live site

Nothing in this folder is loaded by any page, and nothing here needs to run to
deploy. It exists for one job: compiling `../assets/css/site.css`.

## Why the site has a stylesheet instead of the Tailwind CDN

Every page used to load `https://cdn.tailwindcss.com`. That script is the
Tailwind **Play CDN** — a compiler, shipped to the browser. It is explicitly
not for production, and it costs a real site three things:

- **A console warning on every page**, telling anyone who opens devtools that
  the site is misconfigured.
- **A flash of unstyled content.** The compiler has to download, parse the
  page, generate CSS, and inject it — all *after* first paint. Visitors see
  the unstyled HTML first.
- **~120 KB of JavaScript** on the critical path, plus a third-party origin
  that has to resolve before the page can look right.

`assets/css/site.css` is ~37 KB, minified, cached for a year, and already
correct at first paint.

## Regenerating the stylesheet

Only needed when you change markup (adding a Tailwind class that wasn't used
anywhere before) or edit `tailwind.src.css`:

```bash
cd _build && npm install && npm run css
```

Or without installing anything:

```bash
cd _build && npx tailwindcss@3.4.17 -c ./tailwind.config.cjs -i ./tailwind.src.css -o ../assets/css/site.css --minify
```

`npm run css:watch` rebuilds on save while you work.

**Commit the resulting `assets/css/site.css`.** It is a build *output*, but
committing it is exactly what keeps the site deployable with no build step —
which is the whole point of the project. A host only ever serves plain files.

## What lives where

| File | Purpose |
| --- | --- |
| `tailwind.src.css` | The real design system. Tokens in `@layer base`, every component class in `@layer components`. |
| `tailwind.config.cjs` | Palette, type scale, shadows, keyframes, and the content globs Tailwind scans. |
| `package.json` | The two build scripts. Dev-only; the repo root deliberately has no `package.json` so hosts don't try to build anything. |

### Two things to know before editing

**The content globs include `../assets/js/**/*.js`.** `site.js` toggles
Tailwind classes by name (the services tab switcher). Those class names exist
only inside a JavaScript string, so Tailwind has to scan that file too or the
classes get tree-shaken out and the tabs render unstyled.

**Component-layer rules are tree-shaken like everything else.** A rule such as
`.site-header.is-scrolled` only survives if *both* class names appear
somewhere in the scanned content.
