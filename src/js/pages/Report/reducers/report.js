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
                    name: '',
                    translationKey: ''
                },
                organisation: {
                    name: '',
                    jobFunction: ''
                },
                consultant: {
                    name: ''
                },

                // consist of: fieldName = {name: '', value: '', slug: ''}
                texts: {}
            };

            try {
                const participant = action.report.participant;
                const product = action.report.product;
                const organisation = action.report.organisation;
                const consultant = action.report.consultant;
                const report = action.report.report;

                if (!report) {
                    logger.error({
                        component: 'report',
                        message: `no report data exists: ${action}`
                    });
                }

                // set report id
                newState.report.slug = report.slug;

                // set display name
                if (participant.infix) {
                    newState.report.participant.name = `${participant.firstName} ${participant.infix} ${participant.lastName}`;
                } else {
                    newState.report.participant.name = `${participant.firstName} ${participant.lastName}`;
                }

                // set product name
                newState.report.product.name = product.productName;
                newState.report.product.translationKey = product.translationKey;

                // set organisation name and/or job function
                if (organisation.organisationType.toLowerCase() === 'organisation') {
                    newState.report.organisation.name = organisation.organisationName;
                } else if (organisation.organisationType.toLowerCase() === 'jobfunction') {
                    newState.report.organisation.jobFunction = organisation.organisationName;

                    if (organisation.parentOrganisation) {
                        newState.report.organisation.name = organisation.parentOrganisation;
                    }
                }

                // set appointment date
                if (participant.appointmentDate) {
                    newState.report.participant.appointmentDate = Utils.formatDate(participant.appointmentDate, 'dd mmmm yyyy');
                }

                // set consultant (display) name
                if (consultant && consultant.consultantName) {
                    newState.report.consultant.name = consultant.consultantName;
                }

                // set report texts
                const mappedFieldNames = [];

                report.textFieldsInReport = report.textFieldsInReport || {};

                report.textFieldsInReport.forEach(textField => {
                    const mappedTextField = {
                        slug: textField.slug,
                        name: textField.name,
                        value: textField.value
                    };

                    // store field name to keep track of currently added fields
                    mappedFieldNames.push(textField.name);

                    // store text field
                    newState.report.texts[mappedTextField.name] = mappedTextField;
                });

                // get default text fields in case some where not available on the report
                product.textsTemplate.forEach(textField => {

                    // add default text field if they were not set
                    if (!~mappedFieldNames.indexOf(textField.name)) {
                        newState.report.texts[textField.name] = {
                            slug: null,
                            name: textField.name,
                            value: null,
                            textFieldTemplateSlug: textField.slug
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
