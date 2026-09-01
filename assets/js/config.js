// The ONE place to make forms actually send somewhere.
//
// ===========================================================================
// TO DO NEXT: PASTE A WEB3FORMS KEY INTO WEB3FORMS_ACCESS_KEY BELOW
// ===========================================================================
// This is the one outstanding setup step on the site, and it takes about
// thirty seconds:
//
//   1. Go to https://web3forms.com
//   2. Type info@enzinternational.co into the box and press the button.
//      There is no account and no password — the key is emailed to you.
//   3. Paste that key into WEB3FORMS_ACCESS_KEY below.
//   4. Redeploy (git push).
//
// Nothing else has to change. Web3Forms is checked before FormSubmit, so the
// moment the key is there it takes over on every form automatically.
//
// Why this one, over what is running today:
//   - 250 submissions a month on the free tier, published rather than guessed
//   - keeps 30 days of submission history, so an email lost to a spam filter
//     is not a lost lead — this is the real reason to switch
//   - has a published data-processing agreement and a GDPR section, which
//     matters because you take enquiries from UK and EU buyers and your
//     privacy policy has to be able to name who processes their data
//   - has a paid tier, which means it is a business rather than a side
//     project, and is more likely to still be running next year
//
// ===========================================================================
// HOW DELIVERY IS CHOSEN
// ===========================================================================
// Forms try these in order, and the first one configured wins:
//
//   1. API_BASE_URL         your own backend in ../../server/
//   2. WEB3FORMS_ACCESS_KEY relay to your inbox  <- the intended setup
//   3. FORMSUBMIT_EMAIL     relay to your inbox, no key  <- stopgap, live now
//   4. nothing set          opens the visitor's own mail app to press send
//
// Whichever automatic option is active, a send that fails falls back to 4
// rather than losing the enquiry. See api.js.
//
// FORMSUBMIT_EMAIL is a deliberate stopgap so the forms were not dead while
// the key was being fetched. It works, but it has no documented submission
// limit, keeps no history, and publishes no processing agreement. Once the
// Web3Forms key is in, set FORMSUBMIT_EMAIL to '' to retire it.
//
// ---------------------------------------------------------------------------
// ONE-TIME ACTIVATION — only applies while FormSubmit is the live path
// ---------------------------------------------------------------------------
// FormSubmit will not deliver to an address until it has confirmed that the
// address wants the mail, and that confirmation happens on the first
// submission. If you are relying on it even briefly: send yourself a test
// enquiry from the live site, then click the activation link it emails to
// CONTACT_EMAIL (check spam — it usually lands there). Until you do,
// submissions are held rather than delivered.
//
// Going straight to the Web3Forms key skips this entirely.
//
// ---------------------------------------------------------------------------
// WHERE THE DATA GOES
// ---------------------------------------------------------------------------
// Options 2 and 3 both mean a third party receives what visitors type — name,
// email, phone, company, message — and relays it to you. That is what makes
// automatic email possible on a site with no server, and the privacy policy
// now says so. If you would rather nothing left your own infrastructure, use
// option 1, or a Vercel serverless function with your own SMTP credentials,
// and leave both of these blank.
// ---------------------------------------------------------------------------
window.ENZ_CONFIG = {
  API_BASE_URL: '',
  WEB3FORMS_ACCESS_KEY: '',
  FORMSUBMIT_EMAIL: 'info@enzinternational.co',
  WHATSAPP_NUMBER: '8613203840456',
  CONTACT_PHONE: '+86 132 0384 0456',
  CONTACT_EMAIL: 'info@enzinternational.co',
};
