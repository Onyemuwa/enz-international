// The admin sign-in page and its session cookie.
import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import { PASSWORD, boot } from './helpers.mjs';

const HTML = { Accept: 'text/html,application/xhtml+xml' };
const XHR = { 'X-ENZ-Admin': '1' };

async function signIn(t, user = 'admin', password = PASSWORD) {
  return t.post('/api/admin/login', { user, password }, XHR);
}
const cookieFrom = (res) => (res.headers.get('set-cookie') || '').split(';')[0];

describe('admin sign-in', () => {
  let t;
  before(async () => (t = await boot()));
  after(() => t.stop());

  test('a browser asking for the admin page is sent to the sign-in form, not a grey popup', async () => {
    const res = await t.get('/admin/', { headers: HTML });
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('location'), '/admin/login');
    assert.equal(res.headers.get('www-authenticate'), null);
  });

  test('the sign-in page and its assets are public', async () => {
    for (const p of ['/admin/login', '/admin/public/login.css', '/admin/public/login.js', '/admin/public/logo.png']) {
      assert.equal((await t.get(p)).status, 200, p);
    }
    const page = await (await t.get('/admin/login')).text();
    assert.match(page, /Sign in/);
    assert.match((await t.get('/admin/login')).headers.get('content-security-policy') ?? '', /script-src 'self'/);
  });

  test('the admin page itself and its API are still closed to everyone else', async () => {
    assert.equal((await t.get('/admin/index.html')).status, 401);
    assert.equal((await t.get('/admin/admin.js')).status, 401);
    assert.equal((await t.get('/api/admin/summary')).status, 401);
  });

  test('the admin page\'s own requests get a plain 401 with no Basic challenge', async () => {
    const res = await t.get('/api/admin/summary', { headers: XHR });
    assert.equal(res.status, 401);
    assert.equal(res.headers.get('www-authenticate'), null);
  });

  test('wrong credentials: 401, a clear message, no cookie', async () => {
    for (const [u, p] of [['admin', 'wrong'], ['root', PASSWORD], ['', ''], ['admin', '']]) {
      const res = await signIn(t, u, p);
      assert.equal(res.status, 401);
      assert.equal(res.headers.get('set-cookie'), null);
      assert.match((await res.json()).message, /Incorrect username or password/);
    }
    const bad = await t.post('/api/admin/login', { user: ['admin'], password: { x: 1 } }, XHR);
    assert.equal(bad.status, 401, 'non-string values are rejected, not coerced');
  });

  test('correct credentials set a hardened session cookie that unlocks the admin', async () => {
    const res = await signIn(t);
    assert.equal(res.status, 200);
    const raw = res.headers.get('set-cookie');
    assert.match(raw, /HttpOnly/);
    assert.match(raw, /SameSite=Strict/);
    assert.match(raw, /Max-Age=43200/);
    const cookie = cookieFrom(res);

    assert.equal((await t.get('/api/admin/summary', { headers: { Cookie: cookie } })).status, 200);
    const page = await t.get('/admin/', { headers: { Cookie: cookie, ...HTML } });
    assert.equal(page.status, 200);
    assert.match(await page.text(), /id="signout"/);
    // Signed in, the login form bounces to the dashboard.
    assert.equal((await t.get('/admin/login', { headers: { Cookie: cookie } })).headers.get('location'), '/admin/');
  });

  test('changes made on a cookie must carry the X-ENZ-Admin header', async () => {
    const cookie = cookieFrom(await signIn(t));
    const made = await t.post('/api/testimonials', {
      name: 'A Client', email: 'a@example.com', display: 'named', consent: true,
      quote: 'They caught a fault at inspection that would have cost me the whole order.',
    });
    assert.equal(made.status, 201);
    const { id } = await made.json();
    const without = await t.patch(`/api/admin/testimonials/${id}`, { status: 'approved' }, { Cookie: cookie });
    assert.equal(without.status, 403);
    assert.equal(t.store.getTestimonial(id).status, 'pending');
    const withHeader = await t.patch(`/api/admin/testimonials/${id}`, { status: 'approved' }, { Cookie: cookie, ...XHR });
    assert.equal(withHeader.status, 200);
  });

  test('a forged, tampered or expired cookie is rejected', async () => {
    const good = cookieFrom(await signIn(t)).split('=')[1];
    const [exp, sig] = good.split('.');
    const forged = [
      'enz_admin=',
      'enz_admin=garbage',
      `enz_admin=${exp}.${sig.slice(0, -2)}xx`,
      `enz_admin=${Number(exp) + 100000}.${sig}`, // signature is for a different expiry
      `enz_admin=${Date.now() - 1000}.${sig}`,
    ];
    for (const c of forged) {
      assert.equal((await t.get('/api/admin/summary', { headers: { Cookie: c } })).status, 401, c);
    }
  });

  test('sign out clears the cookie', async () => {
    const cookie = cookieFrom(await signIn(t));
    const res = await t.post('/api/admin/logout', {}, { Cookie: cookie, ...XHR });
    assert.equal(res.status, 204);
    assert.match(res.headers.get('set-cookie'), /enz_admin=;.*Max-Age=0/);
  });

  test('HTTP Basic still works for scripts', async () => {
    const auth = { Authorization: 'Basic ' + Buffer.from(`admin:${PASSWORD}`).toString('base64') };
    assert.equal((await t.get('/api/admin/summary', { headers: auth })).status, 200);
  });
});

describe('admin sign-in: guarded cases', () => {
  test('a session does not survive a password change', async () => {
    const a = await boot();
    const cookie = cookieFrom(await signIn(a));
    assert.equal((await a.get('/api/admin/summary', { headers: { Cookie: cookie } })).status, 200);
    a.config.adminPassword = 'a-different-password';
    assert.equal((await a.get('/api/admin/summary', { headers: { Cookie: cookie } })).status, 401);
    await a.stop();
  });

  test('with no ADMIN_PASSWORD the form cannot sign anyone in', async () => {
    const off = await boot({ adminPassword: '' });
    const res = await signIn(off, 'admin', '');
    assert.equal(res.status, 503);
    assert.equal(res.headers.get('set-cookie'), null);
    assert.equal((await off.get('/admin/login')).status, 200, 'the page still loads');
    await off.stop();
  });

  test('repeated wrong passwords are throttled on the form too', async () => {
    const limited = await boot({ rateLimits: { adminFailures: { windowMs: 60_000, limit: 3 }, bookings: { windowMs: 60_000, limit: 99 }, newsletter: { windowMs: 60_000, limit: 99 }, careers: { windowMs: 60_000, limit: 99 }, testimonials: { windowMs: 60_000, limit: 99 } } });
    const codes = [];
    for (let i = 0; i < 5; i++) codes.push((await signIn(limited, 'admin', 'nope' + i)).status);
    assert.deepEqual(codes, [401, 401, 401, 429, 429]);
    await limited.stop();
  });
});
