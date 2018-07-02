import * as actionType from './../constants/ActionTypes';

const initialState = {
    messages: []
};

/**
 * Returns the new state
 * @param {Object} state - state
 * @param {Object} action - action
 * @returns {{}} new state
 */
export default function inboxReducer(state = initialState, action) {
    const newState = Object.assign({}, state);

    switch (action.type) {

        case actionType.FETCH_MESSAGES: {

            newState.messages = [];

            if (action.messages.length) {
                action.messages.forEach(message => {
                    newState.messages.push({
                        projectName: message.projectName,
                        type: message.type,
                        ssoLink: message.ssoLink,
                        date: message.appointmentDate,
                        status: message.status
                    });
                });
            }

            break;
        }

        default:
            break;
    }

    return newState;
}
