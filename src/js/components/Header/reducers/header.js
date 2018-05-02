import * as actionType from './../constants/ActionTypes';

// todo: populate default id from the AppConfig?
const initialState = {
    languageId: 'nl'
};

/**
 * Returns the new state
 * @param {Object} state - state
 * @param {Object} action - action
 * @returns {Object} state
 */
export default function headerReducer(state = initialState, action) {
    let newState = Object.assign({}, state);

    switch (action.type) {

        case actionType.SWITCH_LANGUAGE:

            // console.log('reducer switches to '+action.languageId);

            newState.languageId = action.languageId;
            break;

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
