import * as actionType from './../constants/ActionTypes';
import ShownUserRoles from '../constants/ShownUserRoles';
import Logger from 'neon-frontend-utils/src/logger';
import Components from '../../../constants/Components';

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

    switch (action.type) {
        case actionType.GET_USERS:

            try {

                // clear current items from newState
                newState.users = [];

                // loop through newly retrieved items from the action and add to the newState
                action.users.forEach(user => {

                    let userName = '';

                    if (user.firstName && user.lastName) {
                        let userInfix = ' ';

                        // extract user infix
                        if (user.infix) {
                            userInfix = ` ${user.infix} `;
                        }

                        // construct user name
                        userName = `${user.firstName || ''}${userInfix}${user.lastName || ''}`;
                    }

                    // push all roles to temp array to output later
                    const userRoles = [];

                    if (user.accountHasRoles && user.accountHasRoles.length) {

                        // api returns role entity wrapped inside the entries
                        user.accountHasRoles.forEach(role => {
                            if (~ShownUserRoles.indexOf(role.role.uuid)) {
                                userRoles.push(role.role.roleName);
                            }
                        });
                    }

                    // add to user list
                    newState.users.push({
                        name: userName,
                        roles: userRoles
                    });
                });
            } catch (e) {
                Logger.instance.error({
                    message: `Exception in users reducer GET_USERS: ${e}`,
                    component: Components.USERS
                });
            }

            break;

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
