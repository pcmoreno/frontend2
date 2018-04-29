import * as actionType from '../constants/ActionTypes';

/**
 * Reset inbox
 * @returns {{}} reset inbox items
 */
export function resetInbox() {
    return {
        type: actionType.RESET_INBOX
    };
}
