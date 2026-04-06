/// <reference path="./rrennAIbook.types.js" />
window.rrennAIbook = window.rrennAIbook || {};

/**
 * Internationalization module providing translation lookups.
 * @type {rrennAIbookI18n}
 * @memberof rrennAIbook
 */
rrennAIbook.i18n = (function () {
  // LOCALES
  const locales = {};
  // LOCALES

  /**
   * Get a translated string by key, with optional placeholder substitution.
   * @param {string} key - The translation key.
   * @param {Record<string, string>} [values] - Placeholder values to substitute.
   * @returns {string} The translated string, or the key itself if not found.
   */
  const get = (key, values) => {
    if (!locales[key]) {
      console.warn(
        `Missing translation for key '${key}'`
      );
      return key;
    }

    let translation = locales[key];
    if (values) {
      for (const [key, value] of Object.entries(values)) {
        translation = translation.replace(`{{${key}}}`, value);
      }
    }

    return translation;
  };

  return { get };
})();
