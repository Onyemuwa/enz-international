// Local preview server. Zero dependencies — plain Node, nothing to install.
//
// WHY THIS EXISTS
// Pages are written as directories (en/services/index.html serves at
// /en/services/) so the live site has no .html in its URLs. The cost is that
// opening the folder straight off disk no longer works: file:// has no
// directory-index resolution, so the browser shows a file listing instead of
// the page. Any web server fixes that, and this is the smallest possible one.
//
// RUN IT
//   Double-click preview.bat            (Windows)
//   or: node preview.mjs                (any platform)
//
// It prints a http://localhost:5500 address. Open that, not the files.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve('.');
const PORT = Number(process.argv[2]) || 5500;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

async function resolveFile(urlPath) {
  // Strip the query string and decode %20 etc.
  const clean = decodeURIComponent(urlPath.split('?')[0]);

  // Refuse anything trying to climb out of the project directory.
  const candidate = normalize(join(ROOT, clean));
  if (!candidate.startsWith(ROOT)) return null;

  try {
    const info = await stat(candidate);
    // THIS is the bit file:// cannot do: a directory serves its index.html.
    if (info.isDirectory()) return resolveFile(join(clean, 'index.html'));
    return candidate;
  } catch {
    // /en/about -> /en/about/index.html, so a missing trailing slash still works
    if (!clean.endsWith('/') && !extname(clean)) return resolveFile(clean + '/');
    return null;
  }
}

const server = createServer(async (req, res) => {
  const file = await resolveFile(req.url || '/');

  if (!file) {
    // Same 404 page the real hosts serve.
    try {
      const body = await readFile(join(ROOT, '404.html'));
      res.writeHead(404, { 'Content-Type': TYPES['.html'] }).end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': TYPES['.txt'] }).end('404 Not Found');
    }
    return;
  }

  try {
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream',
      // No caching, so an edit plus a refresh always shows the edit.
      'Cache-Control': 'no-store',
    }).end(body);
  } catch {
    res.writeHead(500, { 'Content-Type': TYPES['.txt'] }).end('500 Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`\n  ENZ INTERNATIONAL — local preview\n`);
  console.log(`  Open:  http://localhost:${PORT}/en/\n`);
  console.log(`  Do NOT open the .html files directly from the folder: the site`);
  console.log(`  uses clean URLs (/en/services/), which need a server to resolve.\n`);
  console.log(`  Stop with Ctrl+C.\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  Port ${PORT} is already in use.`);
    console.error(`  Either something is already serving the site, or run:\n`);
    console.error(`      node preview.mjs 5501\n`);
    process.exit(1);
  }
  throw err;
});
