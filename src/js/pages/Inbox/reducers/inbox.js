import * as actionType from './../constants/ActionTypes';

const initialState = {
    items: []
};

/**
 * Returns the new state
 * @param {Object} state - state
 * @param {Object} action - action
 * @returns {{}} new state
 */
export default function inboxReducer(state = initialState, action) {
    let newState = Object.assign({}, state);

    switch (action.type) {

        case actionType.RESET_INBOX:

            newState.items = [];

            break;

        default:
            return state;
    }

    return newState;
}
