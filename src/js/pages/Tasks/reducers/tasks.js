import * as actionType from './../constants/ActionTypes';
import ListItemTypes from '../../../components/Listview/constants/ListItemTypes';
import ParticipantStatus from '../../../constants/ParticipantStatus.js';
import moment from 'moment';
import Logger from 'neon-frontend-utils/src/logger';
import Components from '../../../constants/Components';

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

            try {

                // clear current items from newState
                newState.tasks = [];

                // loop through newly retrieved items from the action and add to the newState
                action.tasks.forEach(task => {
                    const account = task.accountHasRole.account;
                    const project = task.project;
                    const sessionId = task.uuid;
                    let participantInfix = ' ';
                    let consultantName = '';
                    let consultantInfix = ' ';
                    let sortValueForConsultantName = '';

                    // extract participant infix
                    if (account && account.infix) {
                        participantInfix = ` ${account.infix} `;
                    }

                    // construct participant name
                    const participantName = `${account.firstName || ''}${participantInfix}${account.lastName || ''}`;
                    const sortValueForParticipantName = `${account.lastName || ''}${participantInfix}${account.firstName || ''}`;

                    // extract consultant name
                    if (task.consultant && task.consultant.account) {

                        // extract consultant infix
                        if (task.consultant.account.infix) {
                            consultantInfix = ` ${task.consultant.account.infix || ''} `;
                        }

                        // construct consultant name
                        consultantName = `${task.consultant.account.firstName || ''}${consultantInfix}${task.consultant.account.lastName || ''}`;
                        sortValueForConsultantName = `${task.consultant.account.lastName || ''}${consultantInfix}${task.consultant.account.firstName || ''}`;
                    }

                    // extract appointment date
                    let appointmentDate = '';
                    let sortValueForAppointmentDate = '';

                    if (task.participantSessionAppointmentDate) {

                        // construct appointment date
                        appointmentDate = moment(task.participantSessionAppointmentDate).format('DD-MM-YYYY HH:mm') || '';
                        sortValueForAppointmentDate = moment(task.participantSessionAppointmentDate).format('YYYY-MM-DD HH:mm') || '';
                    }

                    // extract organisation name
                    let organisationName = project.organisation.organisationName;

                    // when the organisation is a jobfunction, extract parent organisation
                    if (project.organisation.organisationType.toLowerCase() === 'jobfunction' && project.organisation.organisation) {
                        organisationName = project.organisation.organisation.organisationName;
                    }

                    // the button to show intermediate results is only enabled when the participant is at a certain phase
                    const statusesToShowIntermediateReport = [ParticipantStatus.PHASE_ONE_FINISHED, ParticipantStatus.HNA_FINISHED];
                    let downloadIntermediateReportButtonDisabled = true;

                    if (task.accountHasRole.genericRoleStatus && ~statusesToShowIntermediateReport.indexOf(task.accountHasRole.genericRoleStatus)) {
                        downloadIntermediateReportButtonDisabled = false;
                    }

                    // build list view
                    newState.tasks.push([
                        {
                            key: 'name',
                            value: participantName,
                            sortingKey: sortValueForParticipantName
                        },
                        {
                            key: 'consultant',
                            value: consultantName,
                            sortingKey: sortValueForConsultantName
                        },
                        {
                            key: 'assessmentdate',
                            value: appointmentDate,
                            sortingKey: sortValueForAppointmentDate
                        },
                        {
                            key: 'organisation',
                            value: organisationName
                        },
                        {
                            key: 'results',
                            type: ListItemTypes.BUTTON,
                            label: 'show_results',
                            disabled: downloadIntermediateReportButtonDisabled,
                            action: event => {
                                action.downloadIntermediateReport(event, task.participantSessionSlug);
                            }
                        },
                        {
                            key: 'report',
                            type: ListItemTypes.BUTTON,
                            label: 'write_report',
                            link: `/report/${sessionId}`
                        }
                    ]);
                });
            } catch (e) {
                Logger.instance.error({
                    message: `Exception in tasks reducer GET_TASKS: ${e}`,
                    component: Components.TASKS
                });
            }

            break;

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
