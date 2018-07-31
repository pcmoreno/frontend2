/**
 * @class hyphenation
 * @param {string} lang - language id
 * @returns { Object } hyphenation pattern
 */
export default function hyphenation(lang) {
    switch (lang) {
        case 'nl':
            return import('hyphenation.nl');

        case 'en-GB':
        default:
            return import('hyphenation.en-gb');
    }
}
