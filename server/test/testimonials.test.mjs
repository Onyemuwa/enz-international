// Testimonials: the one feature on the site where a mistake is a credibility
// problem rather than a bug. The rules these tests pin down:
//   - nothing is public until a person approves it
//   - the sender's email and ENZ's notes never leave the server
//   - an anonymous testimonial loses its name and company
//   - a quote is stored and shown exactly as written
//   - consent is required, always
import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import { AUTH, boot, waitFor } from './helpers.mjs';

const REAL = {
  quote: 'Third container of tiles in a year. The second inspection caught a glaze fault that would have cost me the order. They told me straight when a factory was not worth it.',
  name: 'Amina Hassan',
  role: 'Director',
  company: 'Hassan Building Supplies',
  country: 'Tanzania',
  project: 'Ceramic tile line',
  email: 'amina@example.com',
  display: 'named',
  consent: true,
};

const publicList = async (t) => (await (await t.get('/api/testimonials')).json()).testimonials;

describe('submitting a testimonial', () => {
  let t;
  before(async () => (t = await boot()));
  after(() => t.stop());

  test('is stored as PENDING, emails the team, and is not public', async () => {
    const res = await t.post('/api/testimonials', REAL);
    assert.equal(res.status, 201);
    const { id } = await res.json();

    const row = t.store.getTestimonial(id);
    assert.equal(row.status, 'pending');
    assert.equal(row.source, 'form');
    assert.equal(row.consent, 1);

    assert.deepEqual(await publicList(t), [], 'not public until approved');

    await waitFor(() => t.notifier.calls.some((c) => /Testimonial to approve/.test(c.subject)));
    const mail = t.notifier.calls.at(-1);
    assert.match(mail.text, /NOT public yet/);
    assert.equal(mail.replyTo, 'amina@example.com');
    assert.match(mail.text, /third container|Third container/i);
  });

  test('stores the quote exactly as written — no rewording, no polishing', async () => {
    const odd = 'honestly   they were slow on the first sample ,but communication was good...  would use again';
    const { id } = await (await t.post('/api/testimonials', { ...REAL, name: 'Verbatim Vic', quote: odd })).json();
    assert.equal(t.store.getTestimonial(id).quote, odd.trim(), 'internal spacing and punctuation preserved');
  });

  test('requires consent to publish', async () => {
    for (const consent of [false, undefined, '', 'no', 0]) {
      const res = await t.post('/api/testimonials', { ...REAL, name: 'No Consent ' + String(consent), consent });
      assert.equal(res.status, 400, `consent=${JSON.stringify(consent)}`);
      assert.match((await res.json()).message, /tick the box/);
    }
    // And the checkbox values a browser actually sends are accepted.
    for (const consent of [true, 'true', 'on']) {
      const res = await t.post('/api/testimonials', { ...REAL, name: 'Consent ' + String(consent), consent });
      assert.equal(res.status, 201, `consent=${JSON.stringify(consent)}`);
    }
  });

  test('rejects a missing name, a bad email, and a one-liner', async () => {
    const cases = [
      [{ name: '' }, /name is required/i],
      [{ email: 'not-an-email', name: 'Bad Email' }, /valid email/i],
      [{ quote: 'Great!', name: 'Too Short' }, /at least 30/],
      [{ quote: 'x'.repeat(1600), name: 'Too Long' }, /under 1500/],
    ];
    for (const [patch, pattern] of cases) {
      const res = await t.post('/api/testimonials', { ...REAL, ...patch });
      assert.equal(res.status, 400);
      assert.match((await res.json()).message, pattern);
    }
  });

  test('the same testimonial twice is stored once', async () => {
    const dup = { ...REAL, name: 'Double Click Dan' };
    const a = await (await t.post('/api/testimonials', dup)).json();
    const b = await (await t.post('/api/testimonials', dup)).json();
    assert.equal(a.id, b.id);
  });

  test('rate-limits the public form', async () => {
    const limited = await boot({ rateLimits: { bookings: { windowMs: 60_000, limit: 99 }, newsletter: { windowMs: 60_000, limit: 99 }, careers: { windowMs: 60_000, limit: 99 }, adminFailures: { windowMs: 60_000, limit: 99 }, testimonials: { windowMs: 60_000, limit: 2 } } });
    try {
      const codes = [];
      for (let i = 0; i < 4; i++) codes.push((await limited.post('/api/testimonials', { ...REAL, name: 'R' + i })).status);
      assert.deepEqual(codes, [201, 201, 429, 429]);
    } finally {
      await limited.stop();
    }
  });
});

describe('moderation and what the public sees', () => {
  let t;
  before(async () => (t = await boot()));
  after(() => t.stop());

  const submit = async (patch = {}) => (await (await t.post('/api/testimonials', { ...REAL, ...patch })).json()).id;

  test('the admin endpoints are closed without credentials', async () => {
    for (const [method, p] of [['GET', '/api/admin/testimonials'], ['POST', '/api/admin/testimonials'], ['PATCH', '/api/admin/testimonials/1'], ['DELETE', '/api/admin/testimonials/1']]) {
      const res = await fetch(t.base + p, { method, headers: { 'Content-Type': 'application/json' }, body: method === 'GET' || method === 'DELETE' ? undefined : '{}' });
      assert.equal(res.status, 401, `${method} ${p}`);
    }
  });

  test('approving publishes it, and the public copy has NO email or private fields', async () => {
    const id = await submit({ name: 'Approve Me', email: 'private-address@example.com' });
    assert.ok(!(await publicList(t)).some((x) => x.name === 'Approve Me'));

    const res = await t.patch(`/api/admin/testimonials/${id}`, { status: 'approved', notes: 'Checked: ordered Mar 2026' }, AUTH);
    assert.equal(res.status, 200);

    const shown = (await publicList(t)).find((x) => x.name === 'Approve Me');
    assert.ok(shown, 'now public');
    assert.deepEqual(Object.keys(shown).sort(), ['company', 'country', 'name', 'project', 'quote', 'role']);

    const raw = await (await t.get('/api/testimonials')).text();
    assert.ok(!raw.includes('private-address@example.com'), 'email never reaches the public');
    assert.ok(!raw.includes('Checked: ordered'), 'internal notes never reach the public');
    assert.ok(!/consent|source|status|email/.test(raw), 'no bookkeeping fields leak');
  });

  test('hiding takes it down again, deleting removes it', async () => {
    const id = await submit({ name: 'Hide Me' });
    await t.patch(`/api/admin/testimonials/${id}`, { status: 'approved' }, AUTH);
    assert.ok((await publicList(t)).some((x) => x.name === 'Hide Me'));

    await t.patch(`/api/admin/testimonials/${id}`, { status: 'hidden' }, AUTH);
    assert.ok(!(await publicList(t)).some((x) => x.name === 'Hide Me'), 'hidden is not public');

    assert.equal((await t.del(`/api/admin/testimonials/${id}`, AUTH)).status, 204);
    assert.equal(t.store.getTestimonial(id), undefined);
  });

  test('an ANONYMOUS testimonial publishes without name or company', async () => {
    const id = await submit({ name: 'Secret Sam', company: 'Hidden Holdings Ltd', display: 'anonymous', role: 'Procurement lead', country: 'Kenya' });
    await t.patch(`/api/admin/testimonials/${id}`, { status: 'approved' }, AUTH);
    const raw = await (await t.get('/api/testimonials')).text();
    assert.ok(!raw.includes('Secret Sam'), 'name withheld');
    assert.ok(!raw.includes('Hidden Holdings'), 'company withheld');
    const shown = (await publicList(t)).find((x) => x.role === 'Procurement lead');
    assert.equal(shown.name, '');
    assert.equal(shown.country, 'Kenya');
    assert.ok(shown.quote);
  });

  test('rejects an unknown status', async () => {
    const id = await submit({ name: 'Bad Status' });
    assert.equal((await t.patch(`/api/admin/testimonials/${id}`, { status: 'contacted' }, AUTH)).status, 400);
    assert.equal((await t.patch(`/api/admin/testimonials/${id}`, { status: 'published' }, AUTH)).status, 400);
  });

  test('lists, filters by status and searches', async () => {
    const id = await submit({ name: 'Searchable Sue', project: 'Unique-Widget-Press' });
    const all = await (await t.get('/api/admin/testimonials', { headers: AUTH })).json();
    assert.ok(all.total >= 1);
    const found = await (await t.get('/api/admin/testimonials?q=Unique-Widget', { headers: AUTH })).json();
    assert.deepEqual(found.rows.map((r) => r.id), [id]);
    const pending = await (await t.get('/api/admin/testimonials?status=pending', { headers: AUTH })).json();
    assert.ok(pending.rows.every((r) => r.status === 'pending'));
    // The admin DOES see the email — they need it to verify the sender.
    assert.equal(found.rows[0].email, 'amina@example.com');
  });

  test('hostile markup is stored as inert text and returned as JSON data', async () => {
    const xss = '<img src=x onerror=alert(1)> and <script>alert(2)</script> they delivered on time, genuinely';
    const id = await submit({ name: '<b>Mallory</b>', quote: xss });
    await t.patch(`/api/admin/testimonials/${id}`, { status: 'approved' }, AUTH);
    const shown = (await publicList(t)).find((x) => x.name === '<b>Mallory</b>');
    assert.equal(shown.quote, xss, 'stored verbatim; the page renders it with textContent only');
  });

  test('summary counts pending ones so the admin can show a badge', async () => {
    await submit({ name: 'Pending Pat' });
    const s = await (await t.get('/api/admin/summary', { headers: AUTH })).json();
    assert.ok(s.testimonials.pending >= 1);
  });
});

describe('testimonials ENZ adds from a client\'s WhatsApp or email', () => {
  let t;
  before(async () => (t = await boot()));
  after(() => t.stop());

  const add = (body) => t.post('/api/admin/testimonials', body, AUTH);
  const base = { quote: 'Sent over on WhatsApp after the container landed: "everything matched the samples, shipping was on the day they said".', name: 'Joseph Mwangi', role: 'Owner', company: 'JM Hardware', country: 'Kenya', project: 'Steel door line', consent: true };

  test('requires the permission box and a real quote, even from the admin', async () => {
    const noConsent = await add({ ...base, consent: false });
    assert.equal(noConsent.status, 400);
    assert.match((await noConsent.json()).message, /permission/);
    assert.equal((await add({ ...base, quote: 'nice' })).status, 400);
  });

  test('is published straight away (the admin is the moderator) and needs no email', async () => {
    const res = await add(base);
    assert.equal(res.status, 201);
    const row = await res.json();
    assert.equal(row.source, 'admin');
    assert.equal(row.status, 'approved');
    assert.equal(row.email, '');
    assert.ok((await publicList(t)).some((x) => x.name === 'Joseph Mwangi'));
    assert.equal(t.notifier.calls.length, 0, 'no "please approve" email for something ENZ entered itself');
  });
});

describe('the database refuses a testimonial without recorded consent', () => {
  test('even if application code were wrong, the schema says no', async () => {
    const t = await boot();
    try {
      const Database = (await import('better-sqlite3')).default;
      const db = new Database(t.config.dbPath);
      assert.throws(
        () => db.prepare("INSERT INTO testimonials (quote, name, consent) VALUES ('a real sentence from someone', 'X', 0)").run(),
        /CHECK constraint failed/
      );
      db.close();
    } finally {
      await t.stop();
    }
  });
});
