import * as actionType from './../constants/ActionTypes';
import AppConfig from './../../../App.config';

const initialState = {
    languageId: AppConfig.languages.defaultLanguage
};

/**
 * Returns the new state
 * @param {Object} state - state
 * @param {Object} action - action
 * @returns {Object} state
 */
export default function headerReducer(state = initialState, action) {
    const newState = Object.assign({}, state);

    switch (action.type) {

        case actionType.SWITCH_LANGUAGE:

            newState.languageId = action.languageId;
            break;

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
