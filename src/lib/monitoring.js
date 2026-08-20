import { hasAnalyticsConsent, onConsentChange } from './consent';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

let initialized = false;

async function initSentry() {
  if (initialized || !SENTRY_DSN) return;
  initialized = true; // set before the async import so a second call can't race in

  // Dynamic import: @sentry/react is only fetched/parsed if a DSN is configured
  // AND the visitor has consented — most visitors pay zero bundle cost for it.
  const Sentry = await import('@sentry/react');
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    // No session replay / screenshots — keep this to error + basic performance
    // data unless you decide you want richer (and more privacy-sensitive) capture.
  });
}

/**
 * Sentry captures IPs and stack traces (which can incidentally contain user
 * input), so — same as GA4/GTM — it only initializes after cookie consent.
 * Wire this up once (e.g. in main.jsx).
 */
export function watchConsentForMonitoring() {
  if (hasAnalyticsConsent()) initSentry();
  return onConsentChange(() => {
    if (hasAnalyticsConsent()) initSentry();
  });
}
