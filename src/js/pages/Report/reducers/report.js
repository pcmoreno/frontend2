import * as actionType from './../constants/ActionTypes';
import Utils from '../../../utils/utils';
import Logger from '../../../utils/logger';

const initialState = {
    report: null
};

/**
 * Returns the new state
 * @param {Object} state - state
 * @param {Object} action - action
 * @returns {Object} state
 */
export default function reportReducer(state = initialState, action) {
    const newState = Object.assign({}, state);
    const logger = Logger.instance;

    switch (action.type) {

        case actionType.GET_REPORT:

            // reset all report attributes
            newState.report = {
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
            };

            try {
                const account = action.report.accountHasRole.account;
                const product = action.report.project.product;
                const organisation = action.report.project.organisation;
                const consultant = action.report.consultant && action.report.consultant.account;
                const report = action.report.report;

                if (!report) {
                    logger.error({
                        component: 'report',
                        message: `no report data exists: ${action}`
                    });
                }

                // set report id
                newState.report.slug = report.reportSlug;

                // set display name
                if (account.infix) {
                    newState.report.participant.name = `${account.firstName} ${account.infix} ${account.lastName}`;
                } else {
                    newState.report.participant.name = `${account.firstName} ${account.lastName}`;
                }

                // set product name
                newState.report.product.name = product.productName;
                newState.report.product.translationKey = product.translationKey;

                // set organisation name and/or job function
                if (organisation.organisationType.toLowerCase() === 'organisation') {
                    newState.report.organisation.name = organisation.organisationName;
                } else if (organisation.organisationType.toLowerCase() === 'jobfunction') {
                    newState.report.organisation.jobFunction = organisation.organisationName;

                    if (organisation.organisation) {
                        newState.report.organisation.name = organisation.organisation.organisationName;
                    }
                }

                // set appointment date
                newState.report.participant.appointmentDate = Utils.formatDate(action.report.participantSessionAppointmentDate, 'dd mmmm yyyy');

                // set consultant (display) name
                if (consultant) {
                    if (consultant.displayName) {
                        newState.report.consultant.name = consultant.displayName;
                    } else if (consultant.infix) {
                        newState.report.consultant.name = `${consultant.firstName} ${consultant.infix} ${consultant.lastName}`;
                    } else {
                        newState.report.consultant.name = `${consultant.firstName} ${consultant.lastName}`;
                    }
                } else {
                    newState.report.consultant.name = '-';
                }

                // set report texts
                const mappedFieldNames = [];

                report.textFieldsInReports = report.textFieldsInReports || [];

                report.textFieldInReports.forEach(textField => {
                    const mappedTextField = {
                        slug: textField.textFieldInReportSlug
                    };

                    // extract score/text (value)
                    if (textField.textFieldInReportValue) {
                        mappedTextField.value = textField.textFieldInReportValue;
                    }

                    // extract field name
                    if (textField.textField) {
                        mappedTextField.name = textField.textField.textFieldName;
                        mappedFieldNames.push(mappedTextField.name);
                    }

                    newState.report.texts[mappedTextField.name] = mappedTextField;
                });

                // get default text fields in case some where not available on the report
                product.textsTemplate.textFields.forEach(textField => {

                    // add default text field if they were not set
                    if (!~mappedFieldNames.indexOf(textField.textFieldName)) {
                        newState.report.texts[textField.textFieldName] = {
                            slug: null,
                            name: textField.textFieldName,
                            value: null,
                            textFieldTemplateSlug: textField.textFieldSlug
                        };
                    }
                });


                // use a flag in the state to let the component know that the report is loaded
                newState.report.isLoaded = true;

            } catch (e) {

                // todo: log/throw an error. Parsing the response of the report page failed.
            }

            break;

        case actionType.RESET_REPORT:

            // reset all report attributes
            newState.report = null;

            break;

        default:
            return state;
    }

    // return the copied, mutated state
    return newState;
}
