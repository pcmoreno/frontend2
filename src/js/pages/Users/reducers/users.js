import * as actionType from './../constants/ActionTypes';

const initialState = {
    users: [],
    forms: []
};

/**
 * Returns the new state
 * @param {Object} state - state
 * @param {Object} action - action
 * @returns {Object} new state
 */
export default function usersReducer(state = initialState, action) {
    const newState = Object.assign({}, state);
    let newForm;

    switch (action.type) {
        case actionType.GET_USERS:

            // clear current items from newState
            newState.users = [];

            // loop through newly retrieved items from the action and add to the newState
            action.users.forEach(user => {

                // todo: remove when all dummy accounts have NAW data
                let userName = '(dummy user)';

                if (user.account && user.account.firstName && user.account.lastName) {
                    let userInfix = ' ';

                    // extract user infix
                    if (user.account.infix) {
                        userInfix = ` ${user.account.infix} `;
                    }

                    // construct user name
                    userName = `${user.account.firstName || ''}${userInfix}${user.account.lastName || ''}`;
                }

                // push all roles to temp array to output later
                const userRoles = [];

                if (user.role) {
                    userRoles.push(user.role.roleName);
                }

                // build user list view
                newState.users.push([
                    {
                        key: 'name',
                        value: userName
                    },
                    {
                        key: 'roles',
                        value: userRoles
                    }
                ]);
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
