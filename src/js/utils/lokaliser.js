/**
 * @class Lokaliser
 * @param {string} languageId - language id
 * @param {string} componentId - component id
 * @returns { Object } i18n
 */
export default function lokaliser(languageId, componentId) {
    if (languageId && componentId) {
        return require('../../../data/i18n/' + componentId + '-' + languageId).default;
    }

    return false;
}


// // /* set defaults */
// // let langId = 'nl';
// // let comp = null;
// // let translations = null;
//
// /**
//  * set Language
//  * @param {string} languageId - language id
//  * @param {string} component - component
//  * @returns { undefined } nothing
//  */
// function getTranslations(languageId = langId, component = comp) {
//     if (langId !== languageId || comp !== component) {
//         langId = languageId;
//         comp = component;
//
//         if (languageId === 'nl') {
//             translations = require('../../../data/i18n/inbox-nl_NL.js').default;
//         }
//
//         if (languageId === 'en') {
//             translations = require('../../../data/i18n/inbox-en_GB.js').default;
//         }
//     }
// }
// //
// // /**
// //  * set Component
// //  *  @param {string} componentId - component
// //  * @returns { undefined } nothing
// //  */
// // function setComponent(componentId) {
// //     setLanguage(langId, componentId);
// // }
// //
// // /**
// //  * set Language
// //  * @returns { Object } translations
// //  */
// // function getTranslations() {
// //     return translations;
// // }
//
// export { getTranslations };
