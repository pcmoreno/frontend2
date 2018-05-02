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
