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
 * Fetch entities action
 * @param {Object} entity - entity
 * @param {array} data - data
 * @param {Function} openModalToAmendParticipant - openModalToAmendParticipant
 * @param {Function} toggleParticipant - method to select participant in detail panel
 * @returns {{type, data: *}} data to populate detail panel
 */
export function fetchDetailPanelData(entity, data, openModalToAmendParticipant, toggleParticipant) {

    // return action type and the value(s) to be sent to reducer for state mutation
    return {
        type: actionType.FETCH_DETAIL_PANEL_DATA,
        entity,
        data,
        openModalToAmendParticipant,
        toggleParticipant
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
 * Reset detail panel
 * @returns {{}} reset detail panel
 */
export function resetDetailPanel() {
    return {
        type: actionType.RESET_DETAIL_PANEL
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
