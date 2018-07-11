import Utils from './utils';

/**
 * @class requireThis
 * @param {string} component - component
 * @param {string} languageId - languageId
 * @returns {Object} require object
 */
export function requireThis(component, languageId) {
    return require(`../../../data/i18n/${component}-${languageId}`).default;
}

/**
 * @class translator
 * @param {string} languageId - language id
 * @param {string} componentId - component id
 * @returns { Object } translations
 */
export default function translator(languageId, componentId) {
    if (languageId && componentId) {
        const combinedTranslations = {};

        if (Utils.isArray(componentId)) {
            for (let c = 0; c < componentId.length; c++) {
                const translation = requireThis(componentId[c], languageId);

                Object.keys(translation).forEach(key => {
                    if (translation.hasOwnProperty(key)) {
                        combinedTranslations[key] = translation[key];
                    }
                });
            }

            return combinedTranslations;
        }

        return require(`../../../data/i18n/${componentId}-${languageId}`).default;
    }

    return false;
}
