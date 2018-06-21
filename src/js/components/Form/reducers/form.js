import * as actionType from './../constants/ActionTypes';

const initialState = {
    forms: []
};

/**
 * Returns the new state
 * @param {Object} state - state
 * @param {Object} action - action
 * @returns {Object} state
 */
export default function formReducer(state = initialState, action) {
    let newState = Object.assign({}, state),
        newForm;

    switch (action.type) {
        case actionType.STORE_FORM_DATA:

            // clear all forms
            newState.forms = [];

            // first build up the forms with data from state
            state.forms.forEach(form => {
                if (action.formId !== form.id) {
                    newState.forms.push(form);
                }
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

                        // in the right field (note that the formId is added here as a prefix in order to compare)
                        if (`${action.formId}_${Object.keys(field)[0]}` === action.formInputId) {

                            // update the changed field if required
                            if (field[Object.keys(field)[0]].value !== action.formInputValue) {

                                // for fields that dont natively have a 'value' property, a property .value is added
                                // and the selected choice is stored in it.
                                field[Object.keys(field)[0]].value = action.formInputValue;
                            }
                        }

                        return field;
                    });
                }

                newState.forms.push(form);
            });

            break;

        case actionType.RESET_FORM_FIELDS:

            // clear current items from newState
            newState.forms = [];

            // build up the forms with data from state
            state.forms.forEach(form => {
                if (form.id === action.formId) {

                    // in the right form
                    form.formFields.forEach(field => {

                        // reset value (note that all field types have a .value property that is leading)
                        // todo: note it currently also clears the hidden field value, which is not what we want
                        // todo: to solve, either get the hiddenfields in here so we can compare and leave it out,
                        // todo: or solve the refres after reset / submit issue in the form component (afterSubmit())
                        field[Object.keys(field)[0]].value = '';
                    });
                }

                newState.forms.push(form);
            });

            break;

        case actionType.RESET_FORMS:

            // reset state so all form data is refreshed
            newState.forms = [];

            break;

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
