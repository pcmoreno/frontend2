import * as actionType from './../constants/ActionTypes';

const initialState = {
    items: [],
    items2: [],
    panels: [],
    forms: []
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

        // case actionType.GET_ITEMS:
        //
        //     // clear current items from newState
        //     newState.items = [];
        //
        //     // loop through newly retrieved items from the action and add to the newState
        //     action.items.forEach(item => {
        //         newState.items.push({ id: item.id, organisationName: item.organisation_name });
        //     });
        //
        //     break;

        case actionType.FETCH_ENTITIES:

            /* todo: here's an example of the new state:
                {
                    parentId: 'some-id',
                    active: false,
                    entities: [{}, {}, {}]
                },
                {
                    parentId: 'some-other-id',
                    active: true,
                    entities: [{}, {}, {}]
                }
             */

            // clear all panels from newState
            newState.panels = [];

            // rebuild panels from state
            state.panels.forEach(panel => {

                // check it doesnt accidently add a panel entry with the id from the payload (ensures it overwrites)
                if (panel.id !== action.parentId) {

                    // take all properties from existing panel, except the active state
                    newState.panels.push({
                        parentId: panel.id,
                        active: false,
                        entities: panel.entities
                    });
                }
            });

            // push the new entities to a new panel id in entities
            newState.panels.push({
                parentId: action.id,
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
