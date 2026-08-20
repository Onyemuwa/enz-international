// ---------------------------------------------------------------------------
// API client — MOCK MODE by default.
//
// No backend exists yet. Every function below either calls a real endpoint
// (when VITE_API_BASE_URL is set) or resolves a realistic mock response after
// a short delay, so the UI is fully demoable without a server.
//
// To connect a real backend: set VITE_API_BASE_URL in .env (see .env.example)
// and implement the endpoints documented above each function. See SETUP.md
// "Backend integration" for the full contract, suggested stack, and payload
// shapes expected by each form in this app.
// ---------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_BASE_URL;
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

/**
 * POST /api/bookings
 * body: { name, email, phone?, company?, date, service, message? }
 * returns: { id, status: 'received' }
 */
export async function submitBooking(data) {
  if (!API_BASE) return mockResolve({ id: `mock_${Date.now()}`, status: 'received' });
  return request('/api/bookings', { method: 'POST', body: JSON.stringify(data) });
}

/**
 * POST /api/newsletter
 * body: { email }
 * returns: { status: 'subscribed' }
 */
export async function subscribeNewsletter(email) {
  if (!API_BASE) return mockResolve({ status: 'subscribed' });
  return request('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
}

/**
 * POST /api/auth/login
 * body: { email, password }
 * returns: { token, user: { name, email } }
 *
 * NOTE: this is a demo-only mock. A real implementation must never accept
 * arbitrary credentials — see SETUP.md for the auth contract (JWT, hashed
 * passwords, rate limiting) required before this can go live.
 */
export async function portalLogin(email, _password) {
  if (!API_BASE) {
    return mockResolve({ token: 'mock-token', user: { name: email.split('@')[0], email } });
  }
  return request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password: _password }) });
}

/**
 * POST /api/careers/applications (multipart/form-data)
 * fields: name, email, message, cv (file)
 * returns: { id, status: 'received' }
 */
export async function submitCvApplication(formData) {
  if (!API_BASE) return mockResolve({ id: `mock_${Date.now()}`, status: 'received' });
  const res = await fetch(`${API_BASE}/api/careers/applications`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

export const isMockMode = !API_BASE;
