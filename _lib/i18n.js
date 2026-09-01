// Translation lookup.
//
// Falls back to English for a missing key rather than rendering nothing, and
// falls back to the key itself if English is missing it too — a visible
// `bookingSubmit` on the page is a bug report; a silently empty button is not.

import dict from '../_content/translations.js';

/**
 * @param {string} lang   'en' | 'sw' | 'fr' | 'zh'
 * @param {string} key    key in _content/translations.js
 * @param {Record<string,string>} [vars]  {name} placeholders to substitute
 */
export function t(lang, key, vars) {
  let str = dict[lang]?.[key] ?? dict.en[key] ?? key;
  if (vars) Object.entries(vars).forEach(([k, v]) => (str = str.replace(`{${k}}`, v)));
  return str;
}
