import * as actionType from './../constants/ActionTypes';

const initialState = {
    users: []
};

/**
 * Returns the new state
 * @param {Object} state - state
 * @param {Object} action - action
 * @returns {Object} new state
 */
export default function usersReducer(state = initialState, action) {
    const newState = Object.assign({}, state);

    switch (action.type) {
        case actionType.GET_USERS:

            // clear current items from newState
            newState.users = [];

            // loop through newly retrieved items from the action and add to the newState
            action.users.forEach(user => {
                let userName = '';

                if (user.account.first_name && user.account.last_name) {
                    let userInfix = ' ';

                    // extract participant infix
                    if (user.account.hasOwnProperty('infix') && user.account.infix !== 'undefined') {
                        userInfix = ` ${user.account.infix} `;
                    }

                    // construct participant name
                    userName = `${user.account.first_name}${userInfix}${user.account.last_name}`;
                }

                // do we have roles
                const userRoles = [];

                // if (user.roles) {
                //     user.roles.forEach(role => {
                //         userRoles.push(role.role_name);
                //     });
                // }

                newState.users.push(
                    {
                        name: {
                            value: userName
                        },
                        roles: {
                            value: userRoles
                        }
                    }
                );
            });

            break;

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
