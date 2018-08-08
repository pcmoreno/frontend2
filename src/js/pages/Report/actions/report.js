import * as actionType from '../constants/ActionTypes';

/**
 * Get report action
 * @param {array} report - report
 * @returns {{type, report: *}} report with action type
 */
export function getReport(report) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.GET_REPORT,
        report
    };
}

/**
 * updates the given text field
 * @param {Object} textField - report text object
 * @param {string} textField.slug - slug of text field
 * @param {string} textField.name - text field name
 * @param {string} [textField.value] - text field value
 * @returns {{type, textField: null}} textField
 */
export function updateTextField(textField) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.UPDATE_TEXT_FIELD,
        textField
    };
}

/**
 * updates the given competency score field
 * @param {Object} competency - competency object
 * @param {string} competency.slug - slug
 * @param {string} competency.templateSlug - template slug
 * @param {string} competency.name - competency name
 * @param {string} competency.score - score
 * @returns {{type, competency: null}} competency
 */
export function updateCompetencyScore(competency) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.UPDATE_COMPETENCY_SCORE,
        competency
    };
}

/**
 * reset state action
 * @returns {{type, report: null}} report with action type
 */
export function resetReport() {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.RESET_REPORT
    };
}
