/**
 * @class hyphenatePattern
 * @param {string} lang - language id
 * @returns { Object } hyphenation pattern
 */
export default function hyphenatePattern(lang) {
    switch (lang) {
        case 'nl_NL':
            return import('hyphenation.nl');

        case 'en_GB':
        default:
            return import('hyphenation.en-gb');
    }
}
