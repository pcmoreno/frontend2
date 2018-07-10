import * as actionType from './../constants/ActionTypes';
import Utils from '../../../utils/utils';
import ParticipantStatus from '../../../constants/ParticipantStatus';

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
                    ParticipantStatus.ADDED,
                    ParticipantStatus.INVITED,
                    ParticipantStatus.STARTED,
                    ParticipantStatus.HNA_FINISHED,
                    ParticipantStatus.PERSONA_FIT_FINISHED,
                    ParticipantStatus.INVITATION_ACCEPTED
                ];
                const participantStatus = participant.accountHasRole.genericRoleStatus;

                if (acceptedStatus.indexOf(participantStatus) >= 0) {
                    const account = participant.accountHasRole.account;
                    const project = participant.project;
                    let participantInfix = ' ';
                    let consultantName = '';
                    let consultantInfix = ' ';
                    let sortValueForConsultantName = '';

                    // extract participant infix
                    if (account.infix) {
                        participantInfix = ` ${account.infix} `;
                    }

                    // construct participant name
                    const participantName = `${account.firstName || ''}${participantInfix}${account.lastName || ''}`;
                    const sortValueForParticipantName = `${account.lastName || ''}${participantInfix}${account.firstName || ''}`;

                    // extract consultant name
                    if (participant.consultant && participant.consultant.account) {

                        // extract consultant infix
                        if (participant.consultant.account.infix) {
                            consultantInfix = ` ${participant.consultant.account.infix} `;
                        }

                        // construct consultant name
                        consultantName = `${participant.consultant.account.firstName || ''}${consultantInfix}${participant.consultant.account.lastName || ''}`;
                        sortValueForConsultantName = `${participant.consultant.account.lastName || ''}${consultantInfix}${participant.consultant.account.firstName || ''}`;
                    }

                    // extract appointment date
                    let appointmentDate = '';
                    let sortValueForAppointmentDate = '';

                    if (participant.participantSessionAppointmentDate) {

                        // construct appointment date
                        appointmentDate = Utils.formatDate(participant.participantSessionAppointmentDate, 'dd-MM-yyyy HH:mm');
                        sortValueForAppointmentDate = Utils.formatDate(participant.participantSessionAppointmentDate, 'yyyy-MM-dd HH:mm');
                    }

                    // construct startDate based on current Date with hours,minutes,seconds set to 00:00:00
                    const today = Utils.getTodayDate();

                    // if an appointmentDate was set, only add appointments from today and later to the state
                    if (appointmentDate === '' ||
                        (appointmentDate !== '' && new Date(sortValueForAppointmentDate) && new Date(sortValueForAppointmentDate) > today)) {

                        // build list view
                        newState.participants.push([
                            {
                                key: 'name',
                                value: participantName,
                                sortingKey: sortValueForParticipantName
                            },
                            {
                                key: 'assessmentdate',
                                value: appointmentDate,
                                sortingKey: sortValueForAppointmentDate
                            },
                            {
                                key: 'organisation',
                                value: project.organisation.organisationName
                            },
                            {
                                key: 'consultant',
                                value: consultantName,
                                sortingKey: sortValueForConsultantName
                            },
                            {
                                key: 'status',
                                value: participantStatus
                            }
                        ]);
                    }
                }
            });

            break;

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
