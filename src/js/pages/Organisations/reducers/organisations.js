import * as actionType from './../constants/ActionTypes';

const initialState = {
    panels: [],
    forms: [],
    pathNodes: []
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

    switch (action.type) {

        case actionType.UPDATE_PATH:

            newState.pathNodes = [];

            // construct the temporary path that is used to populate the new pathNodes state
            let tempPath;

            if (action.panelId) {

                // user clicked at a certain panel so ensure the pathNodes are sliced up until that point
                tempPath = state.pathNodes.slice(0, action.panelId);
            } else {
                tempPath = state.pathNodes;
            }

            // build up the new pathNodes state
            tempPath.forEach(node => {
                newState.pathNodes.push(node);
            });

            // push the new entry
            newState.pathNodes.push({
                id: action.entity.id,
                name: action.entity.name
            });

            break;

        case actionType.FETCH_ENTITIES:

            // will add a panel entity to the state containing all its children. this is NOT a representation of the
            // panel view since it can contain panels that are no longer visible. this serves as caching only.

            // clear all panels from newState
            newState.panels = [];

            // rebuild panels from state
            state.panels.forEach(panel => {

                // check it doesnt accidently add a panel entry with the id from the payload (ensures it overwrites)
                if (panel.parentId !== action.parentId) {

                    // take all properties from existing panel, except the active state
                    // todo: the active property seems a bit redundant since it can be determined from Path in Panels.js
                    newState.panels.push({
                        parentId: panel.parentId,
                        active: false,
                        entities: panel.entities
                    });
                }
            });

            // push the new entities to a new panel id in entities
            newState.panels.push({
                parentId: action.parentId,
                active: true,
                entities: action.entities
            });

            break;

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

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
