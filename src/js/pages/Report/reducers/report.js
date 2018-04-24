import * as actionType from './../constants/ActionTypes';
import Utils from '../../../utils/utils';

const initialState = {
    report: {
        isLoaded: false,
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
        },

        // consist of: texts.fieldName = {name: '', value: ''}
        texts: {}
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
                const report = action.report.report;

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

                    // todo: in this case we do still need to set the organisation name of our root organisation
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

                // set report texts
                if (report.text_field_in_reports && report.text_field_in_reports.length) {
                    const mappedFieldNames = [];

                    report.text_field_in_reports.forEach(textField => {
                        const mappedTextField = {};

                        // extract score/text (value)
                        if (textField.text_field_in_report_value) {
                            mappedTextField.value = textField.text_field_in_report_value;
                        }

                        // extract field name
                        if (textField.text_field) {
                            mappedTextField.name = textField.text_field.text_field_name;
                            mappedFieldNames.push(mappedTextField.name);
                        }

                        newState.report.texts[mappedTextField.name] = mappedTextField;
                    });

                    // get default text fields in case some where not available on the report
                    product.texts_template.text_fields.forEach(textField => {

                        // add default text field if they were not set
                        if (!~mappedFieldNames.indexOf(textField.text_field_name)) {
                            newState.report.texts[textField.text_field_name] = {
                                name: textField.text_field_name,
                                value: null
                            };
                        }
                    });
                }

                // use a flag in the state to let the component know that the report is loaded
                newState.report.isLoaded = true;

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
