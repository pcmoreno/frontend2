/**
 * @class Lokaliser
 * @param {string} lang - language id
 * @returns { Object } i18n
 */
export default function lokaliser(lang) {
    let i18n;

    if (lang === 'nl') {
        i18n = require('../../../data/i18n/inbox-nl_NL.js').default;
    }

    return i18n;
}
