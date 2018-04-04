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
                if (!participant.hasOwnProperty('consultant')) {

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
                        let sortvalueForConsultantName = '';

                        // extract participant infix
                        if (account.hasOwnProperty('infix') && account.infix !== 'undefined') {
                            participantInfix = ` ${account.infix} `;
                        }
                        const participantName = `${account.first_name}${participantInfix}${account.last_name}`;
                        const sortvalueForParticipantName = `${account.last_name}${participantInfix}${account.first_name}`;

                        // extract consultant name
                        if (participant.hasOwnProperty('consultant')) {

                            // extract consultant infix
                            if (participant.consultant.hasOwnProperty('infix') && participant.consultant.infix !== 'undefined') {
                                consultantInfix = ` ${account.infix} `;
                            }
                            consultantName = `${participant.consultant.account.first_name}${consultantInfix}${participant.consultant.account.last_name}`;
                            sortvalueForConsultantName = `${participant.consultant.account.last_name}${consultantInfix}${participant.consultant.account.first_name}`;
                        }

                        // construct appointment date
                        let appointmentDate = '';
                        let sortvalueForAppointmentDate = '';

                        if (participant.hasOwnProperty('participant_appointment_date')) {
                            const tempDate = new Date(participant.participant_appointment_date);

                            const month = (tempDate.getMonth() + 1) > 9 ? (tempDate.getMonth() + 1) : `0${(tempDate.getMonth() + 1)}`;
                            const day = tempDate.getDate() > 9 ? tempDate.getDate() : `0${tempDate.getDate()}`;
                            const year = tempDate.getFullYear();
                            const hours = tempDate.getHours() > 9 ? tempDate.getHours() : `0${tempDate.getHours()}`;
                            const minutes = tempDate.getMinutes() > 9 ? tempDate.getMinutes() : `0${tempDate.getMinutes()}`;

                            appointmentDate = `${day}-${month}-${year} ${hours}:${minutes}`;
                            sortvalueForAppointmentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
                        }

                        // construct startDate based on current Date with hours,minutes,seconds set to 00:00:00
                        const nowDate = new Date();
                        const startDate = new Date(`${nowDate.getDate()}-${(nowDate.getMonth() + 1)}-${nowDate.getFullYear()} 00:00`);

                        // if an appointmentDate was set and the appointmentDate is before today, do not add to state
                        if (appointmentDate !== '' && new Date(appointmentDate) && new Date(appointmentDate) < startDate) {
                            // todo: this doesnt work correctly, could use some help here
                        } else {
                            newState.participants.push(
                                {
                                    name: {
                                        value: participantName,
                                        sortingKey: sortvalueForParticipantName
                                    },
                                    assessmentdate: {
                                        value: appointmentDate,
                                        sortingKey: sortvalueForAppointmentDate
                                    },
                                    organisation: {
                                        value: project.organisation.organisation_name
                                    },
                                    consultant: {
                                        value: consultantName,
                                        sortingKey: sortvalueForConsultantName
                                    },
                                    status: {
                                        value: participantStatus
                                    }
                                }
                            );
                        }
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
