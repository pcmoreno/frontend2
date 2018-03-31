import * as actionType from './../constants/ActionTypes';
import Logger from '../../../utils/logger';

const initialState = {
    panels: [],
    forms: [],
    pathNodes: [],
    detailPanelData: []
};

/**
 * Returns the new state
 * @param {Object} state - state
 * @param {Object} action - action
 * @returns {Object} state
 */
export default function organisationsReducer(state = initialState, action) {
    let newState = Object.assign({}, state),
        newForm;

    let logger = Logger.instance;

    switch (action.type) {

        case actionType.UPDATE_PATH: {

            newState.pathNodes = [];

            // construct the temporary path that is used to populate the new pathNodes state
            let tempPath;

            if (action.panelId >= 0) {

                // user clicked at a certain panel so ensure the pathNodes are sliced up until that point
                tempPath = state.pathNodes.slice(0, action.panelId);
            } else {
                logger.error({
                    component: 'UPDATE_PATH',
                    message: 'attempting to update the path without a panelId'
                });
            }

            // build up the new pathNodes state
            tempPath.forEach(node => {
                newState.pathNodes.push(node);
            });

            // push the new entry
            newState.pathNodes.push({
                id: action.entity.id,
                name: action.entity.name,
                type: action.entity.type,
                section: action.entity.section
            });

            break;
        }

        case actionType.FETCH_ENTITIES: {

            // will add a panel entity to the state containing all its children. this is NOT a representation of the
            // panel view since it can contain panels that are no longer visible. this serves as caching only.
            // todo: actually it currently overwrites the requested entity. ensure it skips the API call in such cases.

            // ensure a valid id is received
            if (action.parentId === 'undefined' || action.parentId === null) {
                logger.error({
                    component: 'FETCH_ENTITIES',
                    message: 'encountered pathNode with invalid id'
                });
            }

            // clear all panels from newState
            newState.panels = [];

            // rebuild panels from state
            state.panels.forEach(panel => {

                // check it doesnt accidently add a panel entry with the id from the payload (ensures it overwrites)
                if (panel.parentId !== action.parentId) {

                    // take all properties from existing panel, except the active state
                    newState.panels.push({
                        parentId: panel.parentId,
                        entities: panel.entities
                    });
                }
            });

            // now the entities need to be constructed from the raw entity structure received from the API
            const tempEntities = [];

            // if entities contains organisations, process them
            if (action.entities.child_organisations) {
                action.entities.child_organisations.forEach(entity => {

                    // attempt to extract product name if it exists
                    let productName = null;

                    if (entity.projects[0] && entity.projects[0].product) {
                        productName = entity.projects[0].product.product_name;
                    }

                    // extract type from the entity. this is new and should solve many issues
                    let type;

                    if (entity.organisation_type === 'jobFunction') {
                        type = 'jobFunction';
                    } else {
                        type = 'organisation';
                    }

                    tempEntities.push({
                        name: entity.organisation_name,
                        id: entity.id,
                        type: type,
                        productName
                    });
                });
            }

            // if entities contains projects, process them
            if (action.entities.projects) {
                action.entities.projects.forEach(entity => {

                    // attempt to extract product name if it exists
                    let productName = null;

                    if (entity.product) {
                        productName = entity.product.product_name;
                    }

                    tempEntities.push({
                        name: entity.project_name,
                        id: entity.id,
                        type: 'project',
                        productName
                    });
                });
            }

            // process (remaining?) entities (that are likely to be root entities / organisations)
            if (action.entities.length) {
                action.entities.forEach(entity => {

                    // ensure the entity is a (root) organisation, then extract its properties and push to tempEntities
                    if (entity.id && entity.organisation_name) {
                        tempEntities.push({
                            name: entity.organisation_name,
                            id: entity.id,
                            type: 'organisation'
                        });
                    }
                });
            }

            // sort alphabetically todo: move to utils
            tempEntities.sort((a, b) => {

                if (a.name < b.name) {
                    return -1;
                }

                if (a.name > b.name) {
                    return 1;
                }

                return 0;
            });

            newState.panels.push({
                parentId: action.parentId,
                active: true,
                entities: tempEntities
            });

            break;

        }

        case actionType.STORE_FORM_DATA:

            // clear all forms
            newState.forms = [];

            // first build up the forms with data from state
            state.forms.forEach(form => {
                newState.forms.push(form);
            });

            // now add the new form taken from the action
            newForm = {
                id: action.formId,
                formFields: action.formFields
            };

            newState.forms.push(newForm);

            break;

        case actionType.UPDATE_FORM_FIELD:

            // clear current items from newState
            newState.forms = [];

            // build up the forms with data from state
            state.forms.forEach(form => {
                if (form.id === action.formId) {

                    // in the right form
                    form.formFields.map(field => {

                        // in the right field
                        if (Object.keys(field)[0] === action.formInputId) {

                            // update the changed field
                            field[Object.keys(field)[0]].value = action.formInputValue;
                        }

                        return field;
                    });
                }

                newState.forms.push(form);
            });

            break;

        case actionType.FETCH_DETAIL_PANEL_DATA: {

            // clear all detailPanel data
            newState.detailPanelData = [];

            // first build up the forms with data from state
            state.detailPanelData.forEach(data => {
                data.active = false;
                newState.detailPanelData.push(data);
            });

            // todo: currently it always re-adds the received entry. ensure it skips pushing data for the requested id

            // now add the new data taken from the action
            newState.detailPanelData.push({
                active: true,
                entity: action.entity
            });

            break;
        }

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
