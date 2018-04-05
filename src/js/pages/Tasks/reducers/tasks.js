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

                // do not process consultants
                const account = task.account_has_role.account;
                const project = task.project;
                let participantInfix = ' ';
                let consultantName = '';
                let consultantInfix = ' ';
                let sortvalueForConsultantName = '';

                // extract participant infix
                if (account.hasOwnProperty('infix') && account.infix !== 'undefined') {
                    participantInfix = ` ${account.infix} `;
                }

                const participantName = `${account.first_name}${participantInfix}${account.last_name}`;

                // extract consultant name
                if (task.hasOwnProperty('consultant')) {

                    // extract consultant infix
                    if (task.consultant.hasOwnProperty('infix') && task.consultant.infix !== 'undefined') {
                        consultantInfix = ` ${account.infix} `;
                    }

                    consultantName = `${task.consultant.account.first_name}${consultantInfix}${task.consultant.account.last_name}`;
                    sortvalueForConsultantName = `${task.consultant.account.last_name}${consultantInfix}${task.consultant.account.first_name}`;
                }

                // construct appointment date
                let appointmentDate = '';
                let sortvalueForAppointmentDate = '';

                if (task.hasOwnProperty('participant_appointment_date')) {
                    const tempDate = new Date(task.participant_appointment_date);

                    const month = (tempDate.getMonth() + 1) > 9 ? (tempDate.getMonth() + 1) : `0${(tempDate.getMonth() + 1)}`;
                    const day = tempDate.getDate() > 9 ? tempDate.getDate() : `0${tempDate.getDate()}`;
                    const year = tempDate.getFullYear();
                    const hours = tempDate.getHours() > 9 ? tempDate.getHours() : `0${tempDate.getHours()}`;
                    const minutes = tempDate.getMinutes() > 9 ? tempDate.getMinutes() : `0${tempDate.getMinutes()}`;

                    appointmentDate = `${month}-${day}-${year} ${hours}:${minutes}`;
                    sortvalueForAppointmentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
                }

                // construct startDate based on current Date with hours,minutes,seconds set to 00:00:00
                const nowDate = new Date();
                const startDate = new Date(`${nowDate.getDate()}-${(nowDate.getMonth() + 1)}-${nowDate.getFullYear()} 00:00`);

                // if an appointmentDate was set and the appointmentDate is before today, do not add to state
                if (appointmentDate === '' || (appointmentDate !== '' && new Date(appointmentDate) && new Date(appointmentDate) > startDate)) {
                    newState.tasks.push(
                        {
                            name: {
                                value: participantName
                            },
                            consultant: {
                                value: consultantName,
                                sortingKey: sortvalueForConsultantName
                            },
                            assessmentdate: {
                                value: appointmentDate,
                                sortingKey: sortvalueForAppointmentDate
                            },
                            organisation: {
                                value: project.organisation.organisation_name
                            },
                            results: {
                                value: 'show results',
                                link: '#notimplemented'
                            },
                            report: {
                                value: 'write report',
                                link: '#notimplemented'
                            }
                        }
                    );
                }
            });

            break;

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
