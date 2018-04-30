import * as actionType from '../constants/ActionTypes';

/**
 * Get tasks action
 * @param {array} users - users
 * @returns {{type, users: *}} users with action type
 */
export function getUsers(users) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.GET_USERS,
        users
    };
}

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
