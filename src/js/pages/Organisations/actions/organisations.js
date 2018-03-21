import * as actionType from '../constants/ActionTypes';

/**
 * Update path action
 * @param {string} entityId - entityId
 * @param {string} entityName - entityName
 * @param {string} panelId - panelId
 * @returns {{type, path: *}} updated path
 */
export function updatePath(entityId, entityName, panelId) {

    // return action type and the value(s) to be sent to reducer for state mutation

    // todo: an Entity object with an id and name key would be cleaner
    return {
        type: actionType.UPDATE_PATH,
        entityId,
        entityName,
        panelId
    };
}

/**
 * Fetch entities action
 * @param {string} parentId - parentId
 * @param {array} entities - entities
 * @returns {{type, entities: *}} items with action type
 */
export function fetchEntities(parentId, entities) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.FETCH_ENTITIES,
        parentId,
        entities
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
