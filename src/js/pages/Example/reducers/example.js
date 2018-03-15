import * as actionType from './../constants/ActionTypes';

const initialState = {
    active: false,
    items: [],
    forms: []
};

/**
 * Returns the new state
 * @param {Object} state - state
 * @param {Object} action - action
 * @returns {{}} new state
 */
export default function exampleReducer(state = initialState, action) {

    // copy the state (state is an immutable object by JS design)
    let newState = Object.assign({}, state),
        newForm;

    switch (action.type) {

        case actionType.GET_ITEMS:

            // clear current items from newState
            newState.items = [];

            // loop through newly retrieved items from the action and add to the newState
            action.items.forEach(item => {
                newState.items.push({ id: item.id, organisationName: item.organisation_name });
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
