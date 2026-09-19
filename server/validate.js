// Input cleaning. The browser already validates, but the API is a public URL:
// anything that can send a POST can send anything, so every field is
// re-checked here and nothing from the request is trusted as-is.

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Trim, normalise newlines, drop control characters, cap the length. */
export function text(value, max) {
  if (value === undefined || value === null) return '';
  return String(value).replace(/\r\n?/g, '\n').replace(CONTROL_CHARS, '').trim().slice(0, max);
}

export function isEmail(value) {
  return value.length <= 254 && /^[^\s@,;<>()[\]\\]+@[^\s@,;<>()[\]\\]+\.[^\s@,;<>()[\]\\]{2,}$/.test(value);
}

/**
 * A quote request from the equipment page arrives as an ordinary consultation
 * whose message begins "Quote request: <product>" (see site.js). Split that
 * first line out so the product is its own column instead of buried in prose.
 */
export function splitQuoteLine(message) {
  const m = /^Quote request: ([^\n]+)\n?/.exec(message);
  if (!m) return { product: '', message };
  return { product: text(m[1], 160), message: message.slice(m[0].length).trim() };
}

export function parseBooking(body) {
  const errors = [];
  const name = text(body?.name, 120);
  const email = text(body?.email, 254).toLowerCase();
  if (!name) errors.push('Name is required.');
  if (!isEmail(email)) errors.push('A valid email address is required.');

  const { product, message } = splitQuoteLine(text(body?.message, 5000));
  const value = {
    kind: product ? 'quote' : 'consultation',
    name,
    email,
    phone: text(body?.phone, 40),
    company: text(body?.company, 160),
    preferred_date: text(body?.date, 40),
    service: text(body?.service, 120),
    product,
    message,
  };
  return { errors, value };
}

export function parseSubscriber(body) {
  const email = text(body?.email, 254).toLowerCase();
  return isEmail(email) ? { errors: [], value: email } : { errors: ['A valid email address is required.'], value: '' };
}

export function parseApplication(body) {
  const errors = [];
  const name = text(body?.name, 120);
  const email = text(body?.email, 254).toLowerCase();
  if (!name) errors.push('Name is required.');
  if (!isEmail(email)) errors.push('A valid email address is required.');
  return { errors, value: { name, email, message: text(body?.message, 5000) } };
}

// A file's extension and MIME type both come from the sender. The first bytes
// of the file are the one thing that says what it actually is.
const SIGNATURES = [
  { ext: '.pdf', bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { ext: '.docx', bytes: [0x50, 0x4b, 0x03, 0x04] }, // zip container
  { ext: '.doc', bytes: [0xd0, 0xcf, 0x11, 0xe0] }, // OLE2
];

export function detectCvType(buffer) {
  for (const sig of SIGNATURES) {
    if (buffer.length >= sig.bytes.length && sig.bytes.every((b, i) => buffer[i] === b)) return sig.ext;
  }
  return null;
}

/** Original file name for display only — never used as a path. */
export function safeDisplayName(name) {
  return text(name, 160).replace(/[\\/:*?"<>|]+/g, '_') || 'cv';
}
