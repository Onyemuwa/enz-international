// Where the forms send their data.
//
// ===========================================================================
// THE SITE NOW HAS ITS OWN BACKEND
// ===========================================================================
// server/ is a small Node app (Express + SQLite) that serves this site AND
// receives the forms, storing every enquiry in a database you can read at
// /admin/ and emailing the team when one arrives. Deployed on Railway, the
// site and the API share one address, so no URL needs configuring:
//
//   API_SAME_ORIGIN: true      forms POST to /api/... on whatever host served the page
//
// See server/README.md for the Railway setup.
//
// ===========================================================================
// HOW DELIVERY IS CHOSEN
// ===========================================================================
// Forms try these in order. The first that succeeds wins, and if one fails the
// next is tried, so a single outage never loses an enquiry:
//
//   1. own backend     API_SAME_ORIGIN: true, or API_BASE_URL for a backend on
//                      another domain (set ALLOWED_ORIGINS on the server too)
//   2. Web3Forms       WEB3FORMS_ACCESS_KEY  (optional, needs a free key)
//   3. FormSubmit      FORMSUBMIT_EMAIL      (optional, needs no key)
//   4. the visitor's own mail app, pre-written — always available, and the only
//      path that cannot fail silently
//
// While the site is still hosted on a static host with no backend (e.g. Vercel),
// step 1 simply fails, and the form carries on to FormSubmit — so this file is
// safe to deploy before the Railway cut-over.
//
// FORMSUBMIT_EMAIL is therefore a BACKUP now. Once the Railway backend is live
// and email notifications are confirmed working, set it to '' to retire it —
// leaving it on means a second, third-party copy of every enquiry is only made
// when the backend is down, which the privacy policy discloses.
//
// FormSubmit note: it will not deliver to an address until that address has been
// confirmed once. Send a test enquiry and click the activation link it emails to
// CONTACT_EMAIL (check spam) if you rely on it.
window.ENZ_CONFIG = {
  API_SAME_ORIGIN: true,
  API_BASE_URL: '',
  WEB3FORMS_ACCESS_KEY: '',
  FORMSUBMIT_EMAIL: 'info@enzinternational.co',
  WHATSAPP_NUMBER: '8613203840456',
  CONTACT_PHONE: '+86 132 0384 0456',
  CONTACT_EMAIL: 'info@enzinternational.co',
};
