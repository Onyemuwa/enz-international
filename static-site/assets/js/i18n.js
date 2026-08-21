// Plain-JS translation dictionary — no bundler, no ES modules, just a global.
// Ported 1:1 from the React version's src/i18n/translations.js.
window.ENZ_I18N = (function () {
  var SUPPORTED_LANGUAGES = ['en', 'sw', 'fr', 'zh'];
  var DEFAULT_LANGUAGE = 'en';

  function t(lang, dict, key, vars) {
    var str = (dict[lang] && dict[lang][key]) || dict[DEFAULT_LANGUAGE][key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.replace('{' + k + '}', vars[k]);
      });
    }
    return str;
  }

  return {
    SUPPORTED_LANGUAGES: SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE: DEFAULT_LANGUAGE,
    t: t,
  };
})();
