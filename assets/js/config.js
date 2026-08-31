// The ONE place to make forms actually send somewhere.
//
// Forms are tried in this order, and the first one configured wins:
//
//   1. API_BASE_URL         your own backend in ../../server/ (full
//                           persistence and real portal auth)
//   2. WEB3FORMS_ACCESS_KEY forms POST to Web3Forms, which emails you the
//                           submission. Free key in ~30 seconds, no account:
//                           https://web3forms.com
//   3. FORMSUBMIT_EMAIL     forms POST to FormSubmit, which emails you the
//                           submission. No key and no signup at all — see the
//                           one-time activation note below.
//   4. nothing set          the submission opens the visitor's own mail app
//                           with the enquiry pre-written, and they press send.
//
// Whichever automatic option is active, if the send fails for any reason the
// form falls back to option 4 rather than losing the enquiry.
//
// ---------------------------------------------------------------------------
// ONE-TIME ACTIVATION — DO THIS BEFORE YOU ADVERTISE THE SITE
// ---------------------------------------------------------------------------
// FormSubmit will not deliver to an address until it has confirmed that the
// address wants the mail. That confirmation happens on the first submission:
//
//   1. Open the live site and send yourself a test enquiry through the form.
//   2. FormSubmit emails CONTACT_EMAIL below a one-time activation link.
//      Check spam — it often lands there.
//   3. Click it.
//
// From then on every submission arrives automatically, with nobody pressing
// send. Until you click it, submissions are held rather than delivered, which
// is why this needs doing before real enquiries start arriving.
//
// ---------------------------------------------------------------------------
// A NOTE ON WHERE THE DATA GOES
// ---------------------------------------------------------------------------
// Options 2 and 3 both mean a third party receives and relays what visitors
// type into the form — name, email, phone, company, message. That is normal
// for a static site with no server, and it is what makes the automatic email
// possible without one. If you would rather nothing left your own
// infrastructure, use option 1, or a Vercel serverless function with your own
// SMTP credentials, and leave both of these blank.
//
// To turn the automatic path off and go back to the mail-app handoff, set
// FORMSUBMIT_EMAIL to '' below.
// ---------------------------------------------------------------------------
window.ENZ_CONFIG = {
  API_BASE_URL: '',
  WEB3FORMS_ACCESS_KEY: '',
  FORMSUBMIT_EMAIL: 'info@enzinternational.co',
  WHATSAPP_NUMBER: '8613203840456',
  CONTACT_PHONE: '+86 132 0384 0456',
  CONTACT_EMAIL: 'info@enzinternational.co',
};
