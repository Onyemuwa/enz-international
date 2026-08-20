// Thin wrapper around the cookie-consent decision CookieConsent.jsx stores in
// localStorage, plus a same-tab event so analytics/monitoring can react
// immediately when the user makes a choice (storage events don't fire in the
// same tab that wrote them).

export const CONSENT_KEY = 'enz_cookie_consent'; // 'all' | 'essential'
export const CONSENT_EVENT = 'enz:consent-change';

export function getConsent() {
  return localStorage.getItem(CONSENT_KEY);
}

export function hasAnalyticsConsent() {
  return getConsent() === 'all';
}

export function setConsent(value) {
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function onConsentChange(handler) {
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}
