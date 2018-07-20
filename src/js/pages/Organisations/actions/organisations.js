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
 * Fetch selected competencies action
 * @param {string} projectSlug - slug of the project that has the selected competencies
 * @param {Object} data - data
 * @returns {{type, data: *}} data to populate detail panel
 */
export function fetchSelectedCompetencies(projectSlug, data) {
    return {
        type: actionType.FETCH_SELECTED_COMPETENCIES,
        projectSlug,
        data
    };
}

/**
 * Fetch available competencies action
 * @param {string} organisationSlug - slug of the organisation that has the available competencies
 * @param {Object} data - data
 * @returns {{type, data: *}} data to populate detail panel
 */
export function fetchAvailableCompetencies(organisationSlug, data) {
    return {
        type: actionType.FETCH_AVAILABLE_COMPETENCIES,
        organisationSlug,
        data
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
 * Reset competencies
 * @returns {{}} reset competencies
 */
export function resetCompetencies() {
    return {
        type: actionType.RESET_COMPETENCIES
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
