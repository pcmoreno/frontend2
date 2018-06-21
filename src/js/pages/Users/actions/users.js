import * as actionType from '../constants/ActionTypes';

/**
 * Get tasks action
 * @param {array} users - users
 * @returns {{type, users: *}} users with action type
 */
export function getUsers(users) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.GET_USERS,
        users
    };
}
