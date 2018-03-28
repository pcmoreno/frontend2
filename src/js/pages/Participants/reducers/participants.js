import * as actionType from './../constants/ActionTypes';

const initialState = {
    participants: []
};

/**
 * Returns the new state
 * @param {Object} state - state
 * @param {Object} action - action
 * @returns {Object} state
 */
export default function participantsReducer(state = initialState, action) {
    const newState = Object.assign({}, state);

    switch (action.type) {

        case actionType.GET_PARTICIPANTS:

            // clear current items from newState
            newState.participants = [];

            // loop through newly retrieved items from the action and add to the newState
            action.participants.forEach(participant => {
                newState.participants.push(
                    {
                        name: {
                            value: `${participant.firstName} ${participant.infix} ${participant.lastName}`
                        },
                        assessmentdate: {
                            value: participant.participantAppointmentDate
                        },
                        organisation: {
                            value: participant.organisationName
                        },
                        consultant: {
                            value: participant.consultant
                        },
                        status: {
                            value: participant.genericRoleStatus
                        }
                    }
                );
            });

            break;

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
