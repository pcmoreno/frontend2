import LanguageTypes from '../constants/LanguageTypes';

/**
 * @class hyphenatePattern
 * @param {string} lang - language id
 * @returns { Object } hyphenation pattern
 */
export default function hyphenatePattern(lang) {
    switch (lang) {
        case LanguageTypes.NL:
            return import('hyphenation.nl');

        case LanguageTypes.EN:
        default:
            return import('hyphenation.en-gb');
    }
}
