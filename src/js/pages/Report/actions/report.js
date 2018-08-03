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
 * reset state action
 * @returns {{type, report: null}} report with action type
 */
export function resetReport() {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.RESET_REPORT
    };
}
