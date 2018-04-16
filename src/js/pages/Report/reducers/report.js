import * as actionType from './../constants/ActionTypes';

const initialState = {
    report: []
};

/**
 * Returns the new state
 * @param {Object} state - state
 * @param {Object} action - action
 * @returns {Object} state
 */
export default function reportReducer(state = initialState, action) {
    const newState = Object.assign({}, state);

    switch (action.type) {

        case actionType.GET_REPORT:

            // clear current items from newState
            newState.report = [];

            break;

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
