// The ONE place to make forms actually send somewhere. Two independent options:
//
// - API_BASE_URL: point at the real backend in ../../server/ (full persistence,
//   real portal auth). See ../../server/README.md.
// - WEB3FORMS_ACCESS_KEY: no backend at all — forms POST straight to
//   Web3Forms, which emails the submission to your inbox. Free key in ~30
//   seconds, no account/password: https://web3forms.com. Can't do portal
//   auth (it's a mail relay, not an auth provider) — only API_BASE_URL can.
//
// Leave both empty to run in mock mode: every form works and shows success
// states, but nothing is actually sent anywhere.
window.ENZ_CONFIG = {
  API_BASE_URL: '',
  WEB3FORMS_ACCESS_KEY: '',
  WHATSAPP_NUMBER: '8613203840456',
  CONTACT_PHONE: '+86 132 0384 0456',
  CONTACT_EMAIL: 'info@enzinternational.co',
};
