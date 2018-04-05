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

                let userInfix = ' ';

                // extract participant infix
                if (user.hasOwnProperty('infix') && user.infix !== 'undefined') {
                    userInfix = ` ${user.infix} `;
                }

                // construct participant name
                const userName = `${user.first_name}${userInfix}${user.last_name}`;
                const sortValueForUserName = `${user.last_name}${userInfix}${user.first_name}`;

                newState.users.push(
                    {
                        name: {
                            value: userName,
                            sortingKey: sortValueForUserName
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
