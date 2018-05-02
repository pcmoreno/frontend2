import * as actionType from '../constants/ActionTypes';

/**
 * Switch language action
 * @param {string} languageId - language Identifier
 * @returns {string} languageId
 */
export function switchLanguage(languageId) {
    return {
        type: actionType.SWITCH_LANGUAGE,
        languageId
    };
}
