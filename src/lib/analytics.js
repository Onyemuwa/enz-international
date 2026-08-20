import { hasAnalyticsConsent, onConsentChange } from './consent';

const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;
const GTM_ID = import.meta.env.VITE_GTM_CONTAINER_ID;

let loaded = false;

function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
  return script;
}

function loadGA4() {
  if (!GA4_ID) return;
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`);
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line no-inner-declarations
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;
  window.gtag('js', new Date());
  // send_page_view: false — page views are sent explicitly via trackPageview()
  // on each route change, since this is a client-side-routed SPA.
  window.gtag('config', GA4_ID, { send_page_view: false });
}

function loadGTM() {
  if (!GTM_ID) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  loadScript(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`);
}

/** Call once at app startup, and again whenever consent changes. */
export function initAnalyticsIfConsented() {
  if (loaded || !hasAnalyticsConsent()) return;
  if (!GA4_ID && !GTM_ID) return; // nothing configured yet — see .env.example
  loadGA4();
  loadGTM();
  loaded = true;
}

/** Records a virtual pageview for the given SPA route path. No-op until loaded. */
export function trackPageview(path) {
  if (!loaded || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', { page_path: path });
}

/** Wire this up once (e.g. in main.jsx) to react to the consent banner. */
export function watchConsentForAnalytics() {
  initAnalyticsIfConsented(); // in case consent was already granted in a prior session
  return onConsentChange(() => initAnalyticsIfConsented());
}
