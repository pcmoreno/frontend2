import * as actionType from './../constants/ActionTypes';
import Utils from '../../../utils/utils';

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

                // extract participant status and see if it meets the requirements
                const acceptedStatus = [
                    'added',
                    'invited',
                    'started',
                    'waitingForPermission',
                    'invitationAccepted',
                    'finished'
                ];
                const participantStatus = participant.account_has_role.generic_role_status;

                if (acceptedStatus.indexOf(participantStatus) >= 0) {
                    const account = participant.account_has_role.account;
                    const project = participant.project;
                    let participantInfix = ' ';
                    let consultantName = '';
                    let consultantInfix = ' ';
                    let sortValueForConsultantName = '';

                    // extract participant infix
                    if (account.hasOwnProperty('infix') && account.infix !== 'undefined') {
                        participantInfix = ` ${account.infix} `;
                    }

                    // construct participant name
                    const participantName = `${account.first_name}${participantInfix}${account.last_name}`;
                    const sortValueForParticipantName = `${account.last_name}${participantInfix}${account.first_name}`;

                    // extract consultant name
                    if (participant.hasOwnProperty('consultant')) {

                        // extract consultant infix
                        if (participant.consultant.account.hasOwnProperty('infix') && participant.consultant.account.infix !== 'undefined') {
                            consultantInfix = ` ${participant.consultant.account.infix} `;
                        }

                        // construct consultant name
                        consultantName = `${participant.consultant.account.first_name}${consultantInfix}${participant.consultant.account.last_name}`;
                        sortValueForConsultantName = `${participant.consultant.account.last_name}${consultantInfix}${participant.consultant.account.first_name}`;
                    }

                    // extract appointment date
                    let appointmentDate = '';
                    let sortValueForAppointmentDate = '';

                    if (participant.hasOwnProperty('participant_session_appointment_date')) {

                        // construct appointment date
                        appointmentDate = Utils.formatDate(participant.participant_session_appointment_date, 'dd-MM-yyyy HH:mm');
                        sortValueForAppointmentDate = Utils.formatDate(participant.participant_session_appointment_date, 'yyyy-MM-dd HH:mm');
                    }

                    // construct startDate based on current Date with hours,minutes,seconds set to 00:00:00
                    const today = Utils.getTodayDate();

                    // if an appointmentDate was set, only add appointments from today and later to the state
                    if (appointmentDate === '' ||
                        (appointmentDate !== '' && new Date(sortValueForAppointmentDate) && new Date(sortValueForAppointmentDate) > today)) {

                        newState.participants.push(
                            {
                                name: {
                                    value: participantName,
                                    sortingKey: sortValueForParticipantName
                                },
                                assessmentdate: {
                                    value: appointmentDate,
                                    sortingKey: sortValueForAppointmentDate
                                },
                                organisation: {
                                    value: project.organisation.organisation_name
                                },
                                consultant: {
                                    value: consultantName,
                                    sortingKey: sortValueForConsultantName
                                },
                                status: {
                                    value: participantStatus
                                }
                            }
                        );
                    }
                }
            });

            break;

        case actionType.RESET_PARTICIPANTS:

            // reset state so all participants data is refreshed
            newState.participants = [];

            break;

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
