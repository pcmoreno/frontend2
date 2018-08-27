import * as actionType from './../constants/ActionTypes';
import moment from 'moment/moment';

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
                        organisationName: message.organisationName,
                        type: message.type,
                        appointmentDate: message.appointmentDate ? moment(message.appointmentDate).format('DD-MM-YYYY') : null,
                        status: message.status,
                        participantSessionSlug: message.participantSessionSlug
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
