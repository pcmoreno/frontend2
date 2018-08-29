import * as actionType from './../constants/ActionTypes';
import downloadReportGenerationStatus from '../constants/DownloadReportGenerationStatus';
import moment from 'moment-timezone';
import Logger from '../../../utils/logger';
import DateTimeZone from '../../../constants/DateTimeZone';
import Components from '../../../constants/Components';

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
    let templateSlug = null;

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
                competencies: [],
                generatedReport: {}
            };

            try {
                const participant = action.report.participant;
                const product = action.report.product;
                const organisation = action.report.organisation;
                const consultant = action.report.consultant;
                const report = action.report.report;
                const generatedReport = action.report.generatedReport;

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
                        templateSlug: textField.templateSlug,
                        name: textField.name,
                        value: textField.value
                    };

                    // store text field
                    newState.report.texts[mappedTextField.name] = mappedTextField;
                });

                // set competencies
                newState.report.competencies = [];

                report.competencies.forEach(competency => {
                    newState.report.competencies.push({
                        definition: competency.definition,
                        name: competency.name,
                        score: competency.score,
                        slug: competency.slug,
                        templateSlug: competency.templateSlug,
                        translationKey: competency.translationKey
                    });
                });

                // use a flag in the state to let the component know that the report is loaded
                newState.report.isLoaded = true;

                // set scores
                if (report.scores) {
                    newState.report.scores = report.scores;
                }

                // set hnaCategoryScores
                if (report.hnaCategoryScores) {
                    newState.report.hnaCategoryScores = report.hnaCategoryScores;
                }

                // set downloadReport generation status
                newState.report.generatedReport.generationStatus = generatedReport.generationStatus;

                // if generationStatus is 'published', set the last generated date
                if (generatedReport.generationStatus === downloadReportGenerationStatus.PUBLISHED) {
                    if (generatedReport.reportPublishedOn.timezone.toUpperCase() === DateTimeZone.UTC) {

                        // remove incompatible timezone offset. For UTC normally a Z is returned
                        if (~generatedReport.reportPublishedOn.date.indexOf('.000000')) {
                            generatedReport.reportPublishedOn.date = generatedReport.reportPublishedOn.date.replace('.000000', 'Z');
                        }

                        newState.report.generatedReport.generationDate = moment(generatedReport.reportPublishedOn.date).utc().tz(DateTimeZone.AMSTERDAM).format('DD-MM-YYYY HH:mm');
                    } else {
                        newState.report.generatedReport.generationDate = moment(generatedReport.reportPublishedOn.date).format('DD-MM-YYYY HH:mm');
                    }
                }

                // get participant language for the report
                newState.report.language = participant.language;

            } catch (e) {
                Logger.instance.error({
                    message: `Exception in report reducer GET_REPORT: ${e}`,
                    component: Components.REPORT
                });
            }

            break;

        case actionType.UPDATE_TEXT_FIELD:

            try {
                templateSlug = newState.report.texts[action.textField.name].templateSlug;

                // clone all levels of the state of objects that needs to be changed (to trigger re-rendering)
                newState.report = Object.assign({}, state.report);
                newState.report.texts = Object.assign({}, state.report.texts);

                newState.report.texts[action.textField.name] = {
                    slug: action.textField.slug,
                    templateSlug,
                    name: action.textField.name,
                    value: action.textField.value
                };
            } catch (e) {
                Logger.instance.error({
                    message: `Exception in report reducer UPDATE_TEXT_FIELD: ${e}`,
                    component: Components.REPORT
                });
            }

            break;

        case actionType.UPDATE_COMPETENCY_SCORE:

            try {
                newState.report = Object.assign({}, state.report);
                newState.report.competencies = [];

                state.report.competencies.forEach(competency => {
                    if (competency.name === action.competency.name && competency.templateSlug === action.competency.templateSlug) {
                        competency.slug = action.competency.slug;
                        competency.score = action.competency.score;
                    }

                    newState.report.competencies.push(competency);
                });
            } catch (e) {
                Logger.instance.error({
                    message: `Exception in report reducer UPDATE_COMPETENCY_SCORE: ${e}`,
                    component: Components.REPORT
                });
            }

            break;

        case actionType.UPDATE_REPORT_GENERATION_STATUS:

            try {
                newState.report = Object.assign({}, state.report);
                newState.report.generatedReport = Object.assign({}, state.report.generatedReport);

                // update report generation status
                newState.report.generatedReport.generationStatus = action.status;

                if (action.reportPublishedOn.timezone.toUpperCase() === DateTimeZone.UTC) {

                    // remove incompatible timezone offset. For UTC normally a Z is returned
                    if (~action.reportPublishedOn.date.indexOf('.000000')) {
                        action.reportPublishedOn.date = action.reportPublishedOn.date.replace('.000000', 'Z');
                    }

                    newState.report.generatedReport.generationDate = moment(action.reportPublishedOn.date).utc().tz(DateTimeZone.AMSTERDAM).format('DD-MM-YYYY HH:mm');
                } else {
                    newState.report.generatedReport.generationDate = moment(action.reportPublishedOn.date).format('DD-MM-YYYY HH:mm');
                }
            } catch (e) {
                Logger.instance.error({
                    message: `Exception in report reducer UPDATE_REPORT_GENERATION_STATUS: ${e}`,
                    component: Components.REPORT
                });
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
