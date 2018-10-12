import * as actionType from './../constants/ActionTypes';
import moment from 'moment/moment';
import Logger from 'neon-frontend-utils/src/logger';
import Components from '../../../constants/Components';

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

            try {

                newState.messages = [];

                if (action.messages.length) {
                    action.messages.forEach(message => {
                        newState.messages.push({
                            organisationName: message.organisationName,
                            type: message.type,
                            appointmentDate: message.appointmentDate ? moment(message.appointmentDate).format('DD-MM-YYYY') : null,
                            status: message.status,
                            participantSessionSlug: message.participantSessionSlug,
                            languageId: message.language
                        });
                    });
                }
            } catch (e) {
                Logger.instance.error({
                    message: `Exception in inbox reducer FETCH_MESSAGES: ${e}`,
                    component: Components.INBOX
                });
            }

            break;
        }

        default:
            break;
    }

    return newState;
}
