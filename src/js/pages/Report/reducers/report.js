import * as actionType from './../constants/ActionTypes';
import Utils from '../../../utils/utils';

const initialState = {
    report: {
        participant: {
            name: '',
            appointmentDate: ''
        },
        product: {
            name: ''
        },
        organisation: {
            name: '',
            jobFunction: ''
        },
        consultant: {
            name: ''
        }
    }
};

/**
 * Returns the new state
 * @param {Object} state - state
 * @param {Object} action - action
 * @returns {Object} state
 */
export default function reportReducer(state = initialState, action) {
    const newState = Object.assign({}, state);

    switch (action.type) {

        case actionType.GET_REPORT:

            // clear current items from newState
            newState.report = Object.assign({}, initialState.report);

            try {

                // extract objects
                const account = action.report.account_has_role.account;
                const product = action.report.project.product;
                const organisation = action.report.project.organisation;
                const consultant = action.report.consultant.account;

                // set display name
                if (account.infix) {
                    newState.report.participant.name = `${account.first_name} ${account.infix} ${account.last_name}`;
                } else {
                    newState.report.participant.name = `${account.first_name} ${account.last_name}`;
                }

                // set product name
                newState.report.product.name = product.product_name;

                // set organisation name and/or job function
                if (organisation.organisation_type.toLowerCase() === 'organisation') {
                    newState.report.organisation.name = organisation.organisation_name;
                } else if (organisation.organisation_type.toLowerCase() === 'jobfunction') {
                    newState.report.organisation.jobFunction = organisation.organisation_name;
                }

                // set appointment date
                newState.report.participant.appointmentDate = Utils.formatDate(action.report.participant_session_appointment_date, 'dd-MM-yyyy HH:mm');

                // set consultant (display) name
                if (consultant.display_name) {
                    newState.report.consultant.name = consultant.display_name;
                } else if (consultant.infix) {
                    newState.report.consultant.name = `${consultant.first_name} ${consultant.infix} ${consultant.last_name}`;
                } else {
                    newState.report.consultant.name = `${consultant.first_name} ${consultant.last_name}`;
                }

            } catch (e) {

                // todo: log/throw an error. Parsing the response of the report page failed.
            }

            break;

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
