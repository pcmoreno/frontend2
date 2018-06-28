import * as actionType from '../constants/ActionTypes';

/**
 * Fetch inbox messages action
 * @param {Array} messages - messages
 * @returns {Array} messages
 */
export function fetchMessages(messages) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.FETCH_MESSAGES,
        messages
    };
}
