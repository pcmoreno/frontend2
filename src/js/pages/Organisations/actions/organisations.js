import * as actionType from '../constants/ActionTypes';

/**
 * Update path action
 * @param {Object} entity - entity
 * @param {string} panelId - panelId
 * @returns {{type, path: *}} updated path
 */
export function updatePath(entity, panelId) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.UPDATE_PATH,
        entity,
        panelId
    };
}

/**
 * Fetch entities action
 * @param {string} parentId - parentId
 * @param {string} parentType - parentType
 * @param {array} entities - entities
 * @returns {{type, entities: *}} items with action type
 */
export function fetchEntities(parentId, parentType, entities) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.FETCH_ENTITIES,
        parentId,
        parentType,
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
 * Store section info in collection action
 * @param {int} sectionId Id of section
 * @param {Object} sectionInfo All relevant section info
 * @returns {Object} Action
 */
export function storeSectionInfoInSectionsCollection(sectionId, sectionInfo) {

    return {
        type: actionType.STORE_SECTION_INFO,
        sectionId,
        sectionInfo
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
 * Fetch entities action
 * @param {Object} entity - entity
 * @param {array} data - data
 * @param {Function} openModalToAmendParticipant - openModalToAmendParticipant
 * @returns {{type, data: *}} data to populate detail panel
 */
export function fetchDetailPanelData(entity, data, openModalToAmendParticipant) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.FETCH_DETAIL_PANEL_DATA,
        entity,
        data,
        openModalToAmendParticipant
    };
}

/**
 * Reset organisations items
 * @returns {{}} reset organisation items
 */
export function resetOrganisations() {
    return {
        type: actionType.RESET_ORGANISATIONS
    };
}

/**
 * Sets the active panel id for the forms
 * @param {number} panelId - panel id
 * @returns {undefined}
 */
export function setFormOpenByPanelId(panelId) {
    return {
        type: actionType.SET_FORM_OPEN_BY_PANEL_ID,
        panelId
    };
}
