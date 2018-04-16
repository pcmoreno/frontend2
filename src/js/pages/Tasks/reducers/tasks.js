import * as actionType from './../constants/ActionTypes';

const initialState = {
    tasks: []
};

/**
 * Returns the new state
 * @param {Object} state - state
 * @param {Object} action - action
 * @returns {Object} new state
 */
export default function tasksReducer(state = initialState, action) {
    const newState = Object.assign({}, state);

    switch (action.type) {
        case actionType.GET_TASKS:

            // clear current items from newState
            newState.tasks = [];

            // loop through newly retrieved items from the action and add to the newState
            action.tasks.forEach(task => {
                const account = task.account_has_role.account;
                const project = task.project;
                const sessionId = task.uuid;
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
                if (task.hasOwnProperty('consultant')) {

                    // extract consultant infix
                    if (task.consultant.account.hasOwnProperty('infix') && task.consultant.account.infix !== 'undefined') {
                        consultantInfix = ` ${task.consultant.account.infix} `;
                    }

                    // construct consultant name
                    consultantName = `${task.consultant.account.first_name}${consultantInfix}${task.consultant.account.last_name}`;
                    sortValueForConsultantName = `${task.consultant.account.last_name}${consultantInfix}${task.consultant.account.first_name}`;
                }

                // extract appointment date
                let appointmentDate = '';
                let sortValueForAppointmentDate = '';

                if (task.hasOwnProperty('participant_appointment_date')) {

                    // transform appointment date
                    const tempDate = new Date(task.participant_appointment_date);
                    const month = (tempDate.getMonth() + 1) > 9 ? (tempDate.getMonth() + 1) : `0${(tempDate.getMonth() + 1)}`;
                    const day = tempDate.getDate() > 9 ? tempDate.getDate() : `0${tempDate.getDate()}`;
                    const year = tempDate.getFullYear();
                    const hours = tempDate.getHours() > 9 ? tempDate.getHours() : `0${tempDate.getHours()}`;
                    const minutes = tempDate.getMinutes() > 9 ? tempDate.getMinutes() : `0${tempDate.getMinutes()}`;

                    // construct appointment date
                    appointmentDate = `${month}-${day}-${year} ${hours}:${minutes}`;
                    sortValueForAppointmentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
                }

                newState.tasks.push(
                    {
                        name: {
                            value: participantName,
                            sortingKey: sortValueForParticipantName
                        },
                        consultant: {
                            value: consultantName,
                            sortingKey: sortValueForConsultantName
                        },
                        assessmentdate: {
                            value: appointmentDate,
                            sortingKey: sortValueForAppointmentDate
                        },
                        organisation: {
                            value: project.organisation.organisation_name
                        },
                        results: {
                            value: 'show results', // todo: translate message
                            link: '#notimplemented'
                        },
                        report: {
                            value: 'write report', // todo: translate message
                            link: `/report/${sessionId}`
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
