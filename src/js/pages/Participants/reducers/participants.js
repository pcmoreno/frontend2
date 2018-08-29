import * as actionType from './../constants/ActionTypes';
import ParticipantStatus from '../../../constants/ParticipantStatus';
import moment from 'moment';
import Logger from '../../../utils/logger';
import Components from '../../../constants/Components';

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

            try {

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
                            appointmentDate = moment(participant.participantSessionAppointmentDate).format('DD-MM-YYYY HH:mm');
                            sortValueForAppointmentDate = moment(participant.participantSessionAppointmentDate).format('YYYY-MM-DD HH:mm');
                        }

                        // construct startDate based on current Date with hours,minutes,seconds set to 00:00:00
                        const today = moment().startOf('day');

                        // if an appointmentDate was set, only add appointments from today and later to the state
                        if (appointmentDate === '' ||
                            (appointmentDate !== '' && sortValueForAppointmentDate && moment(sortValueForAppointmentDate).isAfter(today))) {

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
            } catch (e) {
                Logger.instance.error({
                    message: `Exception in participants reducer GET_PARTICIPANTS: ${e}`,
                    component: Components.PARTICIPANTS
                });
            }

            break;

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
