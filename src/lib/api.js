// ---------------------------------------------------------------------------
// API client — three modes, tried in this order:
//
// 1. Real backend (VITE_API_BASE_URL set) — talks to ../../server/, full
//    persistence + auth. See server/README.md.
// 2. Web3Forms (VITE_WEB3FORMS_ACCESS_KEY set) — no backend at all. Forms
//    POST straight to Web3Forms, which emails the submission to whatever
//    address you registered the key with. Get a free key in ~30 seconds at
//    https://web3forms.com (no account/password — just email verification).
//    This is the right choice if you don't want to run a backend.
// 3. Mock mode (neither set) — every form works and shows success states,
//    but nothing is sent anywhere. Safe default for local dev/demos.
// ---------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const MOCK_DELAY_MS = 700;

function mockResolve(payload) {
  return new Promise((resolve) => setTimeout(() => resolve(payload), MOCK_DELAY_MS));
}

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  return res.json();
}

async function submitToWeb3Forms(payload) {
  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...payload }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success) throw new Error(body.message || 'Request failed');
  return body;
}

async function submitFileToWeb3Forms(formData) {
  formData.append('access_key', WEB3FORMS_KEY);
  const res = await fetch(WEB3FORMS_ENDPOINT, { method: 'POST', body: formData });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.success) throw new Error(body.message || 'Request failed');
  return body;
}

/**
 * POST /api/bookings
 * body: { name, email, phone?, company?, date, service, message? }
 * returns: { id, status: 'received' }
 */
export async function submitBooking(data) {
  if (API_BASE) return request('/api/bookings', { method: 'POST', body: JSON.stringify(data) });
  if (WEB3FORMS_KEY) {
    await submitToWeb3Forms({
      subject: `New consultation request — ${data.name}`,
      from_name: data.name,
      ...data,
    });
    return { id: `w3f_${Date.now()}`, status: 'received' };
  }
  return mockResolve({ id: `mock_${Date.now()}`, status: 'received' });
}

/**
 * POST /api/newsletter
 * body: { email }
 * returns: { status: 'subscribed' }
 */
export async function subscribeNewsletter(email) {
  if (API_BASE) return request('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
  if (WEB3FORMS_KEY) {
    await submitToWeb3Forms({ subject: 'New newsletter subscriber', from_name: email, email });
    return { status: 'subscribed' };
  }
  return mockResolve({ status: 'subscribed' });
}

/**
 * POST /api/auth/login
 * body: { email, password }
 * returns: { token, user: { name, email } }
 *
 * Client-portal authentication requires the real backend (bcrypt + JWT) —
 * see server/README.md "npm run seed:admin". Web3Forms is a form-to-email
 * relay, not an auth provider, so it isn't a valid substitute here.
 */
export async function portalLogin(email, _password) {
  if (API_BASE) return request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password: _password }) });
  return mockResolve({ token: 'mock-token', user: { name: email.split('@')[0], email } });
}

/**
 * POST /api/careers/applications (multipart/form-data)
 * fields: name, email, message, cv (file)
 * returns: { id, status: 'received' }
 */
export async function submitCvApplication(formData) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/careers/applications`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Request failed');
    return res.json();
  }
  if (WEB3FORMS_KEY) {
    formData.append('subject', `New CV submission — ${formData.get('name')}`);
    await submitFileToWeb3Forms(formData);
    return { id: `w3f_${Date.now()}`, status: 'received' };
  }
  return mockResolve({ id: `mock_${Date.now()}`, status: 'received' });
}

export const isMockMode = !API_BASE && !WEB3FORMS_KEY;
export const isRealBackend = Boolean(API_BASE);
export const isWeb3FormsMode = !API_BASE && Boolean(WEB3FORMS_KEY);
