// Tests the browser-side client (assets/js/api.js) — the code that actually
// runs on a visitor's device — against the real server.
//
// The client is loaded into a bare vm context with only what a browser would
// give it (window, fetch, AbortController), so this exercises the shipped file,
// not a copy of its logic. What it proves is the promise api.js makes: an
// enquiry is never silently dropped, whichever delivery path fails.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { after, before, describe, test } from 'node:test';
import { createApp } from '../app.js';
import { loadConfig, ROOT } from '../config.js';

const HIGH = { windowMs: 60_000, limit: 10_000 };
const quiet = { log() {}, error() {}, warn() {} };
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

let server, base, store, dir;

before(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'enz-client-'));
  const config = loadConfig({}, {
    dbPath: path.join(dir, 'c.db'),
    uploadDir: path.join(dir, 'u'),
    rateLimits: { bookings: HIGH, newsletter: HIGH, careers: HIGH, adminFailures: HIGH },
  });
  const built = createApp(config, { notifier: { configured: false, async send() { return { status: 'skipped' }; } }, log: quiet });
  store = built.store;
  server = await new Promise((r) => { const s = built.app.listen(0, '127.0.0.1', () => r(s)); });
  base = `http://127.0.0.1:${server.address().port}`;
  server.built = built;
});

after(async () => {
  await new Promise((r) => server.close(r));
  await server.built.close();
  fs.rmSync(dir, { recursive: true, force: true });
});

/**
 * Loads config.js + api.js into a fresh browser-like context.
 * `route` decides what each request does, so a test can make the backend, the
 * FormSubmit relay, or both fail in a specific way.
 */
function loadClient(configOverrides, route = () => null) {
  const calls = [];
  const win = { location: { href: '' } };
  win.window = win;

  const fakeFetch = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    const custom = await route(String(url), init);
    if (custom) return custom;
    if (String(url).startsWith('/')) return fetch(base + url, init); // same-origin: the real server
    throw new TypeError('network unreachable: ' + url);
  };

  const ctx = vm.createContext({
    window: win, fetch: fakeFetch, AbortController, setTimeout, clearTimeout, encodeURIComponent, Date,
  });
  vm.runInContext(read('assets/js/config.js'), ctx);
  Object.assign(win.ENZ_CONFIG, configOverrides);
  vm.runInContext(read('assets/js/api.js'), ctx);
  return { api: win.ENZ_API, win, calls };
}

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const booking = { name: 'Client Test', email: 'client@example.com', phone: '', company: '', date: '', service: '', message: 'hello' };

describe('shipped config', () => {
  test('points the forms at the same-origin backend', () => {
    const { win } = loadClient({});
    assert.equal(win.ENZ_CONFIG.API_SAME_ORIGIN, true);
    assert.equal(win.ENZ_CONFIG.API_BASE_URL, '');
  });
});

describe('with the backend up', () => {
  test('a booking is saved by the server and never touches a third party', async () => {
    const { api, calls, win } = loadClient({});
    const result = await api.submitBooking({ ...booking, message: 'Quote request: Rice/maize milling line\nplease' });
    assert.equal(result.status, 'received');
    assert.ok(!result.handedOffToMailClient);
    assert.equal(win.location.href, '', 'mail app was not opened');
    assert.deepEqual(calls.map((c) => c.url), ['/api/bookings'], 'no FormSubmit call was made');

    const row = store.getInquiry(result.id);
    assert.equal(row.kind, 'quote');
    assert.equal(row.product, 'Rice/maize milling line');
  });

  test('newsletter sign-up is saved', async () => {
    const { api } = loadClient({});
    const result = await api.subscribeNewsletter('client-news@example.com');
    assert.equal(result.status, 'subscribed');
    assert.equal(store.listSubscribers({ q: 'client-news@example.com' }).total, 1);
  });

  test('a CV upload is saved with its file', async () => {
    const { api } = loadClient({});
    const fd = new FormData();
    fd.append('name', 'Cv Client');
    fd.append('email', 'cvclient@example.com');
    fd.append('message', 'hi');
    fd.append('cv', new Blob(['%PDF-1.4 x'], { type: 'application/pdf' }), 'cv.pdf');
    const result = await api.submitCvApplication(fd);
    assert.equal(result.status, 'received');
    assert.ok(store.getApplication(result.id).cv_stored_name.endsWith('.pdf'));
  });
});

describe('failover: an enquiry is never silently dropped', () => {
  const formsubmitOk = (url) =>
    url.startsWith('https://formsubmit.co/') ? json(200, { success: 'true' }) : null;

  test('backend down + FormSubmit up -> delivered by FormSubmit, mail app untouched', async () => {
    let relayed;
    const { api, win, calls } = loadClient({}, (url, init) => {
      if (url.startsWith('/api/')) throw new TypeError('connection refused'); // e.g. static host with no backend
      if (url.startsWith('https://formsubmit.co/')) { relayed = JSON.parse(init.body); return json(200, { success: 'true' }); }
    });
    const result = await api.submitBooking(booking);
    assert.match(result.id, /^fs_/);
    assert.ok(!result.handedOffToMailClient);
    assert.equal(win.location.href, '');
    assert.equal(calls.length, 2);
    assert.equal(calls[0].url, '/api/bookings', 'own backend is tried first');
    assert.ok(calls[1].url.startsWith('https://formsubmit.co/ajax/'), 'then the relay');
    assert.equal(relayed.Name, 'Client Test');
    assert.match(relayed._subject, /Consultation request/);
  });

  test('backend answers 404 (static host has no /api) -> falls through to FormSubmit', async () => {
    const { api } = loadClient({}, (url) => (url.startsWith('/api/') ? json(404, {}) : formsubmitOk(url)));
    assert.match((await api.submitBooking(booking)).id, /^fs_/);
  });

  test('backend answers 500 -> falls through', async () => {
    const { api } = loadClient({}, (url) => (url.startsWith('/api/') ? json(500, { message: 'boom' }) : formsubmitOk(url)));
    assert.match((await api.submitBooking(booking)).id, /^fs_/);
  });

  test('backend HANGS -> times out and fails over instead of freezing the form', async () => {
    const started = Date.now();
    const { api } = loadClient({ BACKEND_TIMEOUT_MS: 150 }, (url, init) => {
      if (!url.startsWith('/api/')) return formsubmitOk(url);
      return new Promise((_, reject) => init.signal.addEventListener('abort', () => reject(new Error('aborted'))));
    });
    const result = await api.submitBooking(booking);
    assert.match(result.id, /^fs_/);
    assert.ok(Date.now() - started < 3000, 'gave up on the hung backend quickly');
  });

  test('everything down -> hands off to the visitor\'s mail app, and says so', async () => {
    const { api, win } = loadClient({}, () => { throw new TypeError('offline'); });
    const result = await api.submitBooking({ ...booking, phone: '+255 1', company: 'Acme' });
    assert.equal(result.handedOffToMailClient, true);
    assert.match(win.location.href, /^mailto:info%40enzinternational\.co\?subject=/);
    const body = decodeURIComponent(win.location.href.split('&body=')[1]);
    assert.match(body, /Name: Client Test/);
    assert.match(body, /Email: client@example\.com/);
    assert.match(body, /Company: Acme/);
  });

  test('everything down + no relays configured -> still the mail app, never a silent success', async () => {
    const { api, win } = loadClient({ FORMSUBMIT_EMAIL: '' }, () => { throw new TypeError('offline'); });
    const result = await api.subscribeNewsletter('x@example.com');
    assert.equal(result.handedOffToMailClient, true);
    assert.match(win.location.href, /^mailto:/);
  });

  test('a CV is never sent to FormSubmit (it cannot take files) -> mail app asks for an attachment', async () => {
    const seen = [];
    const { api, win } = loadClient({}, (url) => { seen.push(url); if (url.startsWith('/api/')) throw new TypeError('down'); });
    const fd = new FormData();
    fd.append('name', 'Cv Person');
    fd.append('email', 'p@example.com');
    fd.append('cv', new Blob(['%PDF-1.4'], { type: 'application/pdf' }), 'cv.pdf');
    const result = await api.submitCvApplication(fd);
    assert.equal(result.handedOffToMailClient, true);
    assert.ok(!seen.some((u) => u.includes('formsubmit')), 'no CV was posted to FormSubmit');
    assert.match(decodeURIComponent(win.location.href), /Please attach: your CV/);
  });
});

describe('static-only hosting (no backend configured)', () => {
  test('behaves as the old client did: FormSubmit, then the mail app', async () => {
    const { api, calls } = loadClient({ API_SAME_ORIGIN: false }, (url) =>
      url.startsWith('https://formsubmit.co/') ? json(200, { success: true }) : null);
    const result = await api.submitBooking(booking);
    assert.match(result.id, /^fs_/);
    assert.ok(!calls.some((c) => c.url.startsWith('/api/')), 'never touched /api');
  });

  test('a backend on another domain is reached through API_BASE_URL', async () => {
    const seen = [];
    const { api } = loadClient({ API_SAME_ORIGIN: false, API_BASE_URL: 'https://api.example.com/' }, (url) => {
      seen.push(url);
      return json(201, { id: 7, status: 'received' });
    });
    const result = await api.submitBooking(booking);
    assert.equal(result.id, 7);
    assert.deepEqual(seen, ['https://api.example.com/api/bookings'], 'trailing slash on the base is normalised');
  });
});
