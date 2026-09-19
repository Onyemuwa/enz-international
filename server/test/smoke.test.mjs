// End-to-end tests: each suite boots the real app on a throwaway SQLite file
// and talks to it over HTTP, exactly as a browser (or a bot) would.
//
//   npm test
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { after, before, describe, test } from 'node:test';
import { createApp } from '../app.js';
import { loadConfig, ROOT } from '../config.js';

const PASSWORD = 's3cret-test-password';
const basic = (user, pass) => 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
const AUTH = { Authorization: basic('admin', PASSWORD) };

const HIGH = { windowMs: 60_000, limit: 10_000 };
const NO_LIMITS = { bookings: HIGH, newsletter: HIGH, careers: HIGH, adminFailures: HIGH };

function fakeNotifier() {
  return {
    configured: true,
    calls: [],
    async send(message) {
      this.calls.push(message);
      return { status: 'sent' };
    },
  };
}

async function waitFor(check, ms = 2000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (check()) return;
    await new Promise((r) => setTimeout(r, 10));
  }
  throw new Error('timed out waiting for condition');
}

async function boot(overrides = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'enz-test-'));
  const config = loadConfig(
    {},
    {
      dbPath: path.join(dir, 'test.db'),
      uploadDir: path.join(dir, 'uploads'),
      adminPassword: PASSWORD,
      rateLimits: NO_LIMITS,
      ...overrides,
    }
  );
  const notifier = fakeNotifier();
  const quiet = { log() {}, error() {}, warn() {} };
  const built = createApp(config, { notifier, log: quiet });
  const server = await new Promise((resolve) => {
    const s = built.app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  return {
    base,
    config,
    notifier,
    store: built.store,
    get: (p, init = {}) => fetch(base + p, { redirect: 'manual', ...init }),
    post: (p, body, headers = {}) =>
      fetch(base + p, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
      }),
    async stop() {
      await new Promise((r) => server.close(r));
      await built.close();
      fs.rmSync(dir, { recursive: true, force: true });
    },
  };
}

// fetch() (undici) refuses to send a custom Host header, and the www/http
// redirects are decided by Host, so those tests talk to the socket directly.
function rawGet(base, pathname, headers) {
  const url = new URL(base);
  return new Promise((resolve, reject) => {
    const req = http.request({ host: url.hostname, port: url.port, path: pathname, method: 'GET', headers }, (res) => {
      res.resume();
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers }));
    });
    req.on('error', reject);
    req.end();
  });
}

// ---------------------------------------------------------------------------
describe('static site', () => {
  let t;
  before(async () => (t = await boot()));
  after(() => t.stop());

  test('serves the root page, robots and sitemap', async () => {
    for (const p of ['/', '/robots.txt', '/sitemap.xml', '/site.webmanifest']) {
      const res = await t.get(p);
      assert.equal(res.status, 200, p);
    }
  });

  test('directory URLs need the trailing slash, and get it by redirect', async () => {
    const bare = await t.get('/en/equipment');
    assert.equal(bare.status, 301);
    assert.equal(new URL(bare.headers.get('location'), t.base).pathname, '/en/equipment/');
    assert.equal((await t.get('/en/equipment/')).status, 200);
  });

  test('old .html URLs redirect to the clean URL', async () => {
    const page = await t.get('/en/equipment.html');
    assert.equal(page.status, 301);
    assert.equal(page.headers.get('location'), '/en/equipment/');
    const index = await t.get('/en/index.html');
    assert.equal(index.headers.get('location'), '/en/');
  });

  test('retired languages redirect to English, keeping the path and query', async () => {
    for (const lang of ['sw', 'fr', 'zh']) {
      const res = await t.get(`/${lang}/services/?x=1`);
      assert.equal(res.status, 301);
      assert.equal(res.headers.get('location'), '/en/services/?x=1');
    }
    assert.equal((await t.get('/sw')).headers.get('location'), '/en/');
  });

  test('sends the security headers and correct cache rules', async () => {
    const html = await t.get('/en/equipment/');
    assert.equal(html.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(html.headers.get('x-frame-options'), 'SAMEORIGIN');
    assert.match(html.headers.get('cache-control'), /must-revalidate/);

    const css = await t.get('/assets/css/site.css');
    assert.equal(css.status, 200);
    assert.match(css.headers.get('cache-control'), /immutable/);

    // Photos keep their filename when replaced, so they must NOT be immutable.
    const img = fs.readdirSync(path.join(ROOT, 'assets', 'images')).find((f) => f.endsWith('.webp'));
    const photo = await t.get(`/assets/images/${img}`);
    assert.equal(photo.status, 200);
    assert.equal(photo.headers.get('content-type'), 'image/webp');
    assert.doesNotMatch(photo.headers.get('cache-control'), /immutable/);
  });

  test('unknown URLs get the 404 page with a 404 status', async () => {
    const res = await t.get('/no-such-page/');
    assert.equal(res.status, 404);
    assert.match(await res.text(), /<html/i);
  });

  test('NEVER serves server code, config, source content or the database', async () => {
    const secrets = [
      '/package.json',
      '/package-lock.json',
      '/server/index.js',
      '/server/db.js',
      '/server/config.js',
      '/_content/equipment.js',
      '/_lib/site-config.js',
      '/_generate-static.mjs',
      '/.git/config',
      '/.env',
      '/node_modules/express/package.json',
      '/data/enz.db',
      '/README.md',
      '/SETUP.md',
      '/vercel.json',
      '/%2e%2e/package.json',
      '/en/%2e%2e/package.json',
      '/assets/%2e%2e/package.json',
      '/en/..%2fpackage.json',
      '/assets/..%5c..%5cpackage.json',
    ];
    for (const p of secrets) {
      const res = await t.get(p);
      const body = await res.text();
      assert.notEqual(res.status, 200, `${p} must not be served`);
      assert.doesNotMatch(body, /"name": "enz-international"|createStore|ADMIN_PASSWORD|SQLite format/, `${p} leaked content`);
    }
  });
});

// ---------------------------------------------------------------------------
describe('POST /api/bookings', () => {
  let t;
  before(async () => (t = await boot()));
  after(() => t.stop());

  test('stores a consultation request and emails the team', async () => {
    const res = await t.post('/api/bookings', {
      name: '  Amina Hassan ',
      email: 'Amina@Example.COM',
      phone: '+255 700 000 000',
      company: 'Hassan Milling',
      date: '2026-10-01',
      service: 'sourcing',
      message: 'We want a rice mill.',
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.status, 'received');

    const row = t.store.getInquiry(body.id);
    assert.equal(row.name, 'Amina Hassan');
    assert.equal(row.email, 'amina@example.com', 'email is lower-cased');
    assert.equal(row.kind, 'consultation');
    assert.equal(row.status, 'new');

    await waitFor(() => t.notifier.calls.length >= 1);
    const mail = t.notifier.calls.at(-1);
    assert.match(mail.subject, /Consultation request/);
    assert.equal(mail.replyTo, 'amina@example.com');
    assert.match(mail.text, /rice mill/);
    await waitFor(() => t.store.getInquiry(body.id).notify_status === 'sent');
  });

  test('turns a "Quote request:" first line into a quote with its own product column', async () => {
    const res = await t.post('/api/bookings', {
      name: 'Joseph',
      email: 'joe@example.com',
      message: 'Quote request: Concrete block & paver making machine\nPlease send lead time.',
    });
    const { id } = await res.json();
    const row = t.store.getInquiry(id);
    assert.equal(row.kind, 'quote');
    assert.equal(row.product, 'Concrete block & paver making machine');
    assert.equal(row.message, 'Please send lead time.');
  });

  test('rejects a missing name or an invalid email with a readable message', async () => {
    for (const bad of [{ email: 'a@b.co' }, { name: 'X', email: 'not-an-email' }, { name: 'X' }, {}]) {
      const res = await t.post('/api/bookings', bad);
      assert.equal(res.status, 400);
      assert.ok((await res.json()).message);
    }
  });

  test('the same enquiry sent twice in a row is stored once', async () => {
    const payload = { name: 'Dup', email: 'dup@example.com', message: 'hello' };
    const a = await (await t.post('/api/bookings', payload)).json();
    const b = await (await t.post('/api/bookings', payload)).json();
    assert.equal(a.id, b.id);
    assert.equal(t.store.listInquiries({ q: 'dup@example.com' }).total, 1);
  });

  test('oversized fields are truncated, control characters stripped', async () => {
    const res = await t.post('/api/bookings', {
      name: 'N\u0000ame',
      email: 'trunc@example.com',
      message: 'x'.repeat(9000),
    });
    const row = t.store.getInquiry((await res.json()).id);
    assert.equal(row.name, 'Name');
    assert.equal(row.message.length, 5000);
  });

  test('a failed notification never fails the visitor, and is recorded', async () => {
    const t2 = await boot();
    t2.notifier.send = async () => ({ status: 'failed', error: 'Resend responded 403' });
    try {
      const res = await t2.post('/api/bookings', { name: 'Ok', email: 'ok@example.com' });
      assert.equal(res.status, 201);
      const { id } = await res.json();
      await waitFor(() => t2.store.getInquiry(id).notify_status === 'failed');
      assert.match(t2.store.getInquiry(id).notify_error, /403/);
      assert.equal(t2.store.summary().notifyFailures, 1);
    } finally {
      await t2.stop();
    }
  });

  test('malformed JSON is a 400, not a crash', async () => {
    const res = await fetch(t.base + '/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{not json',
    });
    assert.equal(res.status, 400);
  });
});

// ---------------------------------------------------------------------------
describe('POST /api/newsletter', () => {
  let t;
  before(async () => (t = await boot()));
  after(() => t.stop());

  test('subscribes once, answers identically the second time', async () => {
    const a = await t.post('/api/newsletter', { email: 'News@Example.com' });
    const b = await t.post('/api/newsletter', { email: 'news@example.com' });
    assert.equal(a.status, 201);
    assert.equal(b.status, 201);
    assert.deepEqual(await a.json(), await b.json());
    assert.equal(t.store.listSubscribers().total, 1);
  });

  test('rejects an invalid address', async () => {
    assert.equal((await t.post('/api/newsletter', { email: 'nope' })).status, 400);
  });
});

// ---------------------------------------------------------------------------
describe('POST /api/careers/applications', () => {
  let t;
  before(async () => (t = await boot()));
  after(() => t.stop());

  const form = (fields, file) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(fields)) fd.append(k, v);
    if (file) fd.append('cv', new Blob([file.data], { type: file.type }), file.name);
    return fd;
  };
  const send = (fd) => fetch(t.base + '/api/careers/applications', { method: 'POST', body: fd });

  test('stores an application with a PDF under a random name', async () => {
    const res = await send(
      form({ name: 'Grace', email: 'grace@example.com', message: 'hi' }, { name: '../../evil name.pdf', type: 'application/pdf', data: '%PDF-1.4\n%fake body' })
    );
    assert.equal(res.status, 201);
    const row = t.store.getApplication((await res.json()).id);
    assert.match(row.cv_stored_name, /^[0-9a-f-]{36}\.pdf$/, 'stored name is generated, not the sender\'s');
    assert.ok(!row.cv_original_name.includes('/'), 'display name has no path separators');
    assert.ok(fs.existsSync(path.join(t.config.uploadDir, row.cv_stored_name)));
  });

  test('accepts an application with no CV', async () => {
    const res = await send(form({ name: 'NoCv', email: 'nocv@example.com' }));
    assert.equal(res.status, 201);
    assert.equal(t.store.getApplication((await res.json()).id).cv_stored_name, '');
  });

  test('rejects a file that is not really a PDF/Word document, whatever it is called', async () => {
    const res = await send(
      form({ name: 'X', email: 'x@example.com' }, { name: 'cv.pdf', type: 'application/pdf', data: '<?php system($_GET[0]); ?>' })
    );
    assert.equal(res.status, 400);
    assert.match((await res.json()).message, /PDF or Word/);
  });

  test('rejects a file over the size limit', async () => {
    const big = Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(5 * 1024 * 1024 + 100)]);
    const res = await send(form({ name: 'Big', email: 'big@example.com' }, { name: 'cv.pdf', type: 'application/pdf', data: big }));
    assert.equal(res.status, 413);
  });
});

// ---------------------------------------------------------------------------
describe('admin', () => {
  let t;
  before(async () => (t = await boot()));
  after(() => t.stop());

  test('is closed without credentials, on both the page and the API', async () => {
    for (const p of ['/admin/', '/api/admin/summary', '/api/admin/inquiries', '/api/admin/backup', '/api/admin/inquiries.csv']) {
      const res = await t.get(p);
      assert.equal(res.status, 401, p);
      assert.match(res.headers.get('www-authenticate'), /Basic/);
    }
  });

  test('rejects wrong credentials', async () => {
    for (const h of [basic('admin', 'wrong'), basic('root', PASSWORD), basic('', ''), 'Basic !!!', 'Bearer x']) {
      assert.equal((await t.get('/api/admin/summary', { headers: { Authorization: h } })).status, 401, h);
    }
  });

  test('is DISABLED (503) when no ADMIN_PASSWORD is configured — never open', async () => {
    const off = await boot({ adminPassword: '' });
    try {
      assert.equal((await off.get('/admin/')).status, 503);
      assert.equal((await off.get('/api/admin/inquiries', { headers: AUTH })).status, 503);
      assert.equal((await off.get('/api/admin/inquiries', { headers: { Authorization: basic('admin', '') } })).status, 503);
    } finally {
      await off.stop();
    }
  });

  test('serves the page with a strict CSP and no indexing', async () => {
    const res = await t.get('/admin/', { headers: AUTH });
    assert.equal(res.status, 200);
    assert.match(await res.text(), /ENZ/);
    const csp = res.headers.get('content-security-policy');
    assert.match(csp, /script-src 'self'/);
    assert.doesNotMatch(csp, /unsafe-inline/);
    assert.match(res.headers.get('x-robots-tag'), /noindex/);
    assert.equal(res.headers.get('cache-control'), 'no-store');
    assert.equal((await t.get('/admin/admin.js', { headers: AUTH })).status, 200);
  });

  test('lists, filters, searches, updates and deletes enquiries', async () => {
    const a = await (await t.post('/api/bookings', { name: 'Alpha Buyer', email: 'alpha@example.com', company: 'Acme' })).json();
    const b = await (await t.post('/api/bookings', { name: 'Beta Buyer', email: 'beta@example.com', message: 'kiln' })).json();

    const list = await (await t.get('/api/admin/inquiries', { headers: AUTH })).json();
    assert.ok(list.total >= 2);
    assert.equal(list.rows[0].id, b.id, 'newest first');

    const found = await (await t.get('/api/admin/inquiries?q=kiln', { headers: AUTH })).json();
    assert.deepEqual(found.rows.map((r) => r.id), [b.id]);

    const patched = await t.get(`/api/admin/inquiries/${a.id}`, { headers: AUTH });
    assert.equal(patched.status, 404, 'no single-GET route, only list');

    const upd = await fetch(`${t.base}/api/admin/inquiries/${a.id}`, {
      method: 'PATCH',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'contacted', notes: 'called on Monday' }),
    });
    assert.equal(upd.status, 200);
    const updated = await upd.json();
    assert.equal(updated.status, 'contacted');
    assert.equal(updated.notes, 'called on Monday');

    const bad = await fetch(`${t.base}/api/admin/inquiries/${a.id}`, {
      method: 'PATCH',
      headers: { ...AUTH, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'hacked' }),
    });
    assert.equal(bad.status, 400);

    const filtered = await (await t.get('/api/admin/inquiries?status=contacted', { headers: AUTH })).json();
    assert.ok(filtered.rows.every((r) => r.status === 'contacted'));

    const del = await fetch(`${t.base}/api/admin/inquiries/${a.id}`, { method: 'DELETE', headers: AUTH });
    assert.equal(del.status, 204);
    assert.equal(t.store.getInquiry(a.id), undefined);
  });

  test('searching for a % or _ matches it literally', async () => {
    await t.post('/api/bookings', { name: 'Pct', email: 'pct@example.com', message: '50% deposit' });
    await t.post('/api/bookings', { name: 'Other', email: 'other@example.com', message: '5000 deposit' });
    const res = await (await t.get('/api/admin/inquiries?q=' + encodeURIComponent('50%'), { headers: AUTH })).json();
    assert.deepEqual(res.rows.map((r) => r.name), ['Pct']);
  });

  test('CSV export neutralises spreadsheet formulas and quotes properly', async () => {
    await t.post('/api/bookings', { name: '=HYPERLINK("http://evil","x")', email: 'csv@example.com', message: 'line1\nline "2", ok' });
    const res = await t.get('/api/admin/inquiries.csv', { headers: AUTH });
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/csv/);
    assert.match(res.headers.get('content-disposition'), /attachment/);
    const bytes = Buffer.from(await res.arrayBuffer());
    assert.deepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf], 'UTF-8 BOM so Excel reads accents correctly');
    const csv = bytes.toString('utf8');
    assert.ok(csv.includes(`"'=HYPERLINK(""http://evil"",""x"")"`), 'formula cell is prefixed with a quote');
    assert.ok(csv.includes('"line1\nline ""2"", ok"'), 'quotes and newlines are escaped');
  });

  test('stores hostile markup as inert text', async () => {
    const xss = '<img src=x onerror=alert(1)><script>alert(2)</script>';
    const { id } = await (await t.post('/api/bookings', { name: xss, email: 'xss@example.com', message: xss })).json();
    // The API returns it verbatim as JSON data; the admin page renders it with
    // textContent only (see admin.js), and its CSP forbids inline script.
    const list = await (await t.get('/api/admin/inquiries?q=xss@example.com', { headers: AUTH })).json();
    assert.equal(list.rows[0].id, id);
    assert.equal(list.rows[0].message, xss);
    const js = fs.readFileSync(path.join(ROOT, 'server', 'admin', 'admin.js'), 'utf8');
    assert.ok(!/innerHTML|outerHTML|insertAdjacentHTML|document\.write/.test(js.replace(/^\s*\/\/.*$/gm, '')), 'admin.js must never write HTML');
  });

  test('downloads a CV, and deleting the application removes the file', async () => {
    const fd = new FormData();
    fd.append('name', 'Cv Person');
    fd.append('email', 'cv@example.com');
    fd.append('cv', new Blob(['%PDF-1.4 hello'], { type: 'application/pdf' }), 'resume.pdf');
    const { id } = await (await fetch(t.base + '/api/careers/applications', { method: 'POST', body: fd })).json();

    const dl = await t.get(`/api/admin/applications/${id}/cv`, { headers: AUTH });
    assert.equal(dl.status, 200);
    assert.match(dl.headers.get('content-disposition'), /resume\.pdf/);
    assert.equal(await dl.text(), '%PDF-1.4 hello');
    assert.equal((await t.get(`/api/admin/applications/${id}/cv`)).status, 401, 'CVs are not public');

    const file = path.join(t.config.uploadDir, t.store.getApplication(id).cv_stored_name);
    assert.ok(fs.existsSync(file));
    assert.equal((await fetch(`${t.base}/api/admin/applications/${id}`, { method: 'DELETE', headers: AUTH })).status, 204);
    assert.ok(!fs.existsSync(file), 'file removed with the record');
  });

  test('does not serve uploaded CVs as static files', async () => {
    const list = fs.readdirSync(t.config.uploadDir);
    for (const f of list.slice(0, 3)) {
      for (const p of [`/uploads/${f}`, `/assets/uploads/${f}`, `/data/uploads/${f}`]) {
        assert.equal((await t.get(p)).status, 404, p);
      }
    }
  });

  test('summary reports counts and configuration', async () => {
    const s = await (await t.get('/api/admin/summary', { headers: AUTH })).json();
    assert.equal(typeof s.inquiries.new, 'number');
    assert.equal(s.notificationsConfigured, true);
    assert.equal(s.storageIsEphemeral, false);
    assert.ok(s.dbBytes > 0);
  });

  test('exports subscribers and can remove one', async () => {
    await t.post('/api/newsletter', { email: 'sub1@example.com' });
    const list = await (await t.get('/api/admin/subscribers', { headers: AUTH })).json();
    const sub = list.rows.find((r) => r.email === 'sub1@example.com');
    const csv = await (await t.get('/api/admin/subscribers.csv', { headers: AUTH })).text();
    assert.ok(csv.includes('sub1@example.com'));
    assert.equal((await fetch(`${t.base}/api/admin/subscribers/${sub.id}`, { method: 'DELETE', headers: AUTH })).status, 204);
  });

  test('backup returns a valid, consistent SQLite file containing the data', async () => {
    const res = await t.get('/api/admin/backup', { headers: AUTH });
    assert.equal(res.status, 200);
    const bytes = Buffer.from(await res.arrayBuffer());
    assert.equal(bytes.subarray(0, 15).toString(), 'SQLite format 3');

    const Database = (await import('better-sqlite3')).default;
    const copy = path.join(os.tmpdir(), `enz-backup-check-${Date.now()}.db`);
    fs.writeFileSync(copy, bytes);
    const db = new Database(copy, { readonly: true });
    assert.ok(db.prepare('SELECT COUNT(*) AS n FROM inquiries').get().n > 0);
    db.close();
    fs.rmSync(copy, { force: true });
  });
});

// ---------------------------------------------------------------------------
describe('abuse controls', () => {
  test('rate-limits form submissions per IP', async () => {
    const t = await boot({ rateLimits: { ...NO_LIMITS, bookings: { windowMs: 60_000, limit: 3 } } });
    try {
      const statuses = [];
      for (let i = 0; i < 5; i++) {
        statuses.push((await t.post('/api/bookings', { name: 'R' + i, email: `r${i}@example.com` })).status);
      }
      assert.deepEqual(statuses, [201, 201, 201, 429, 429]);
      assert.ok((await (await t.post('/api/bookings', { name: 'x', email: 'x@example.com' })).json()).message);
    } finally {
      await t.stop();
    }
  });

  test('locks out repeated wrong admin passwords', async () => {
    const t = await boot({ rateLimits: { ...NO_LIMITS, adminFailures: { windowMs: 60_000, limit: 3 } } });
    try {
      const codes = [];
      for (let i = 0; i < 5; i++) {
        codes.push((await t.get('/api/admin/summary', { headers: { Authorization: basic('admin', 'guess' + i) } })).status);
      }
      assert.deepEqual(codes, [401, 401, 401, 429, 429]);
      // Even the RIGHT password is refused while locked out.
      assert.equal((await t.get('/api/admin/summary', { headers: AUTH })).status, 429);
    } finally {
      await t.stop();
    }
  });

  test('a successful admin session is never throttled', async () => {
    const t = await boot({ rateLimits: { ...NO_LIMITS, adminFailures: { windowMs: 60_000, limit: 3 } } });
    try {
      for (let i = 0; i < 10; i++) assert.equal((await t.get('/api/admin/summary', { headers: AUTH })).status, 200);
    } finally {
      await t.stop();
    }
  });
});

// ---------------------------------------------------------------------------
describe('platform behaviour', () => {
  test('health check answers 200 and touches the database', async () => {
    const t = await boot();
    try {
      const res = await t.get('/api/health');
      assert.equal(res.status, 200);
      assert.deepEqual(await res.json(), { status: 'ok' });
    } finally {
      await t.stop();
    }
  });

  test('unknown API routes are JSON 404s', async () => {
    const t = await boot();
    try {
      const res = await t.get('/api/nope');
      assert.equal(res.status, 404);
      assert.ok((await res.json()).message);
    } finally {
      await t.stop();
    }
  });

  test('CORS is off by default and only opens for listed origins', async () => {
    const off = await boot();
    const on = await boot({ allowedOrigins: ['https://enzinternational.co'] });
    try {
      const plain = await off.post('/api/newsletter', { email: 'c1@example.com' }, { Origin: 'https://enzinternational.co' });
      assert.equal(plain.headers.get('access-control-allow-origin'), null);

      const ok = await on.post('/api/newsletter', { email: 'c2@example.com' }, { Origin: 'https://enzinternational.co' });
      assert.equal(ok.headers.get('access-control-allow-origin'), 'https://enzinternational.co');
      const evil = await on.post('/api/newsletter', { email: 'c3@example.com' }, { Origin: 'https://evil.example' });
      assert.equal(evil.headers.get('access-control-allow-origin'), null);

      const pre = await on.get('/api/bookings', { method: 'OPTIONS', headers: { Origin: 'https://enzinternational.co' } });
      assert.equal(pre.status, 204);
    } finally {
      await off.stop();
      await on.stop();
    }
  });

  test('production redirects http to https and www to the apex domain', async () => {
    const t = await boot({ forceHttps: true, redirectWww: true, isProd: true });
    try {
      const plain = await rawGet(t.base, '/en/equipment/', { 'X-Forwarded-Proto': 'http', Host: 'enzinternational.co' });
      assert.equal(plain.status, 308);
      assert.equal(plain.headers.location, 'https://enzinternational.co/en/equipment/');

      const www = await rawGet(t.base, '/en/equipment/?a=1', { 'X-Forwarded-Proto': 'https', Host: 'www.enzinternational.co' });
      assert.equal(www.status, 301);
      assert.equal(www.headers.location, 'https://enzinternational.co/en/equipment/?a=1');

      // http on the www host: one hop straight to the final https apex URL.
      const both = await rawGet(t.base, '/', { 'X-Forwarded-Proto': 'http', Host: 'www.enzinternational.co' });
      assert.equal(both.status, 308);
      assert.equal(both.headers.location, 'https://enzinternational.co/');

      const hsts = await rawGet(t.base, '/en/', { 'X-Forwarded-Proto': 'https', Host: 'enzinternational.co' });
      assert.equal(hsts.status, 200);
      assert.match(hsts.headers['strict-transport-security'], /max-age=63072000/);

      // Railway's healthcheck arrives over plain HTTP and must not be redirected.
      const health = await rawGet(t.base, '/api/health', { 'X-Forwarded-Proto': 'http', Host: 'healthcheck.railway.app' });
      assert.equal(health.status, 200);
    } finally {
      await t.stop();
    }
  });

  test('data survives a restart (it is a file, not memory)', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'enz-persist-'));
    const overrides = { dbPath: path.join(dir, 'p.db'), uploadDir: path.join(dir, 'u') };
    const quiet = { log() {}, error() {}, warn() {} };
    const config = loadConfig({}, { ...overrides, rateLimits: NO_LIMITS });

    let one = createApp(config, { notifier: fakeNotifier(), log: quiet });
    let s = await new Promise((r) => { const x = one.app.listen(0, '127.0.0.1', () => r(x)); });
    await fetch(`http://127.0.0.1:${s.address().port}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Persist', email: 'persist@example.com' }),
    });
    await new Promise((r) => s.close(r));
    await one.close();

    const two = createApp(config, { notifier: fakeNotifier(), log: quiet });
    assert.equal(two.store.listInquiries({ q: 'persist@example.com' }).total, 1);
    await two.close();
    fs.rmSync(dir, { recursive: true, force: true });
  });
});
