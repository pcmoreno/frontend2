import * as actionType from '../constants/ActionTypes';

/**
 * Get participants action
 * @param {array} participants - participants
 * @returns {{type, participants: *}} participants with action type
 */
export function getParticipants(participants) {

    // return action type and the value(s) to be sent to reducer for state mutation

    return {
        type: actionType.GET_PARTICIPANTS,
        participants
    };
}

/**
 * Reset participant
 * @returns {{}} reset participant items
 */
export function resetParticipants() {
    return {
        type: actionType.RESET_PARTICIPANTS
    };
}
