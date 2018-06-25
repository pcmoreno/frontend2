import * as actionType from '../constants/ActionTypes';

/**
 * Store form data in collection action
 * @param {string} formId - formId
 * @param {array} formFields - form fields
 * @returns {{type, formId: *, formFields: *}} form data with type
 */
export function storeFormDataInFormsCollection(formId, formFields) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.STORE_FORM_DATA,
        formId,
        formFields
    };
}

/**
 * Change form field action
 * @param {string} formId - formId
 * @param {string} formInputId - form input id
 * @param {array} formInputValue - form input value
 * @returns {{type, formId: *, formInputId: *, formInputValue: *}} form data with type
 */
export function changeFormFieldValueForFormId(formId, formInputId, formInputValue) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.UPDATE_FORM_FIELD,
        formId,
        formInputId,
        formInputValue
    };
}

/**
 * Change form field action
 * @param {string} formId - formId
 * @returns {undefined}
 */
export function resetChangedFieldsForFormId(formId) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.RESET_FORM_FIELDS,
        formId
    };
}

/**
 * Reset forms
 * @returns {{}} reset forms
 */
export function resetForms() {
    return {
        type: actionType.RESET_FORMS
    };
}