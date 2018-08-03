import * as actionType from './../constants/ActionTypes';
import moment from 'moment';
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
                texts: {},
                competencies: []
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

                newState.report.participant.educationLevel = participant.educationLevel;

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
                    newState.report.participant.appointmentDate = moment(participant.appointmentDate).format('DD MMMM YYYY');
                }

                // set consultant (display) name
                if (consultant && consultant.consultantName) {
                    newState.report.consultant.name = consultant.consultantName;
                }

                report.textFieldsInReport = report.textFieldsInReport || {};

                report.textFieldsInReport.forEach(textField => {
                    const mappedTextField = {
                        slug: textField.slug,
                        textFieldTemplateSlug: textField.templateSlug,
                        name: textField.name,
                        value: textField.value
                    };

                    // store text field
                    newState.report.texts[mappedTextField.name] = mappedTextField;
                });

                // set competencies
                newState.report.competencies = action.report.report.competencies;

                // use a flag in the state to let the component know that the report is loaded
                newState.report.isLoaded = true;

                newState.report.scores = action.report.report.hnaCategoryScores;

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
