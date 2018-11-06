import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as reportActions from './actions/report';
import * as alertActions from 'neon-frontend-utils/src/components/Alert/actions/alert';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import ApiFactory from 'neon-frontend-utils/src/api/factory';
import Report from './components/Report/Report';
import translator from 'neon-frontend-utils/src/translator';
import Logger from 'neon-frontend-utils/src/logger';
import ApiMethod from 'neon-frontend-utils/src/api/constants/ApiMethod';
import Utils from 'neon-frontend-utils/src/utils';
import DownloadReportGenerationStatus from './constants/DownloadReportGenerationStatus';
import Components from '../../constants/Components';

/** @jsx h */

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, reportActions, alertActions),
            dispatch
        );

        this.i18n = translator(this.props.languageId, 'report');
        document.title = this.i18n.report_page_title;

        this.api = ApiFactory.get('neon');

        this.saveReportText = this.saveReportText.bind(this);
        this.saveCompetencyScore = this.saveCompetencyScore.bind(this);
        this.generateReport = this.generateReport.bind(this);
        this.downloadReport = this.downloadReport.bind(this);
        this.getReportGenerationStatus = this.getReportGenerationStatus.bind(this);
        this.triggerRetest = this.triggerRetest.bind(this);

        this.loadingPdf = false;
    }

    componentDidUpdate() {
        document.title = this.i18n.report_page_title;
    }

    componentWillUnmount() {

        // reset state, so old report data is unset, until we get new data
        this.actions.resetReport();
    }

    componentDidMount() {
        updateNavigationArrow();

        // retrieve report data by URL parameters
        this.participantSessionId = this.props.matches.participantSessionId;

        // fetch report data
        this.getReport(this.participantSessionId);
    }

    /**
     * Saves a competency score for this report
     *
     * @param {Object} competency - competency props
     * @param {string} competency.templateSlug - competency template slug
     * @param {string} competency.name -  competency name
     * @param {string|null} [competency.slug] - competency slug
     * @param {string|number} competency.score - competency score
     * @param {boolean} stateRefresh - state refresh
     * @returns {Promise<any>} promise
     */
    saveCompetencyScore(competency, stateRefresh) {
        const reportSlug = this.props.report.slug;

        // build up the payload depending on whether we're going to create or update
        let apiMethod = null,
            apiEndpoint = null,
            urlParams = null,
            postData = null;

        if (competency.slug) {
            apiMethod = ApiMethod.PUT;
            apiEndpoint = this.api.getEndpoints().report.updateCompetencyScore;

            urlParams = {
                identifiers: {
                    slug: competency.slug
                }
            };

            postData = {
                scoreOfCompetencyInReport: competency.score
            };
        } else {
            apiMethod = ApiMethod.POST;
            apiEndpoint = this.api.getEndpoints().report.createCompetencyScore;

            urlParams = {
                parameters: {
                    fields: 'competencyScoredInReportSlug'
                }
            };

            postData = {
                report: reportSlug,
                scoreOfCompetencyInReport: competency.score,
                competency: competency.templateSlug
            };
        }

        return new Promise((onFulfilled, onRejected) => {

            // verify template slug upon creation
            if (apiMethod === ApiMethod.POST && !postData.competency) {
                Logger.instance.error({
                    message: 'Template slug of competencyScoredInReport missing upon creation',
                    component: Components.REPORT
                });
                this.actions.addAlert({ type: 'error', text: this.i18n.report_error_save_score });
                return onRejected(new Error('Template slug of competencyScoredInReport missing upon creation'));
            }

            return this.saveReportEntityRelationship({
                apiMethod,
                postData,
                apiEndpoint,
                urlParams
            }).then(response => {
                let slug = competency.slug;

                // extract new slug if this was a post/create call
                if (apiMethod === ApiMethod.POST && response && response.entry && response.entry.competencyScoredInReportSlug) {
                    slug = response.entry.competencyScoredInReportSlug;
                }

                if (!slug) {
                    Logger.instance.error({
                        message: 'Did not receive new competencyScoredInReport slug upon creation',
                        component: Components.REPORT
                    });
                    this.actions.addAlert({ type: 'error', text: this.i18n.report_error_save_score });
                    return onRejected(new Error('Did not receive new competencyScoredInReport slug upon creation'));
                }

                // don't do this for froala editor texts, only for scores that are text fields
                if (stateRefresh) {
                    this.actions.updateCompetencyScore({
                        slug,
                        name: competency.name,
                        score: competency.score,
                        templateSlug: competency.templateSlug
                    });
                }

                return onFulfilled({
                    slug
                });
            }).catch(onRejected);
        });
    }

    /**
     * Sends an api call to create or update the given report text
     *
     * @param {Object} reportText - report text object
     * @param {string|null} [reportText.slug] - slug of text field
     * @param {string} reportText.templateSlug - template slug of text field
     * @param {string} reportText.name - text field name
     * @param {string} reportText.value - text field value
     * @param {boolean} stateRefresh - refresh state or not
     * @returns {Promise} promise
     */
    saveReportText(reportText, stateRefresh) {
        const reportSlug = this.props.report.slug;

        // build up the payload depending on whether we're going to create or update
        let apiMethod = null,
            apiEndpoint = null,
            urlParams = null,
            postData = null;

        if (reportText.slug) {
            apiMethod = ApiMethod.PUT;
            apiEndpoint = this.api.getEndpoints().report.updateTextField;

            urlParams = {
                identifiers: {
                    slug: reportText.slug
                }
            };

            postData = {
                textFieldInReportValue: reportText.value
            };
        } else {
            apiMethod = ApiMethod.POST;
            apiEndpoint = this.api.getEndpoints().report.createTextField;
            urlParams = {
                parameters: {
                    fields: 'textFieldInReportSlug'
                }
            };
            postData = {
                report: reportSlug,
                textFieldInReportValue: reportText.value,
                textField: reportText.templateSlug
            };
        }

        return new Promise((onFulfilled, onRejected) => {

            // verify template slug upon creation
            if (apiMethod === ApiMethod.POST && !postData.textField) {
                Logger.instance.error({
                    message: 'Template slug of textFieldInReport missing upon creation',
                    component: Components.REPORT
                });
                this.actions.addAlert({ type: 'error', text: this.i18n.report_error_save_text });
                return onRejected(new Error('Template slug of textFieldInReport missing upon creation'));
            }

            return this.saveReportEntityRelationship({
                apiMethod,
                postData,
                apiEndpoint,
                urlParams
            }).then(response => {
                let slug = reportText.slug;

                // extract new slug if this was a post/create call
                if (apiMethod === ApiMethod.POST && response && response.entry && response.entry.textFieldInReportSlug) {
                    slug = response.entry.textFieldInReportSlug;
                }

                if (!slug) {
                    Logger.instance.error({
                        message: 'Did not receive new textFieldInReport slug upon creation',
                        component: Components.REPORT
                    });
                    this.actions.addAlert({ type: 'error', text: this.i18n.report_error_save_text });
                    return onRejected(new Error('Did not receive new textFieldInReport slug upon creation'));
                }

                // don't do this for froala editor texts, only for scores that are text fields
                if (stateRefresh) {
                    this.actions.updateTextField({
                        slug,
                        name: reportText.name,
                        value: reportText.value
                    });
                }

                return onFulfilled({
                    slug
                });
            }).catch(onRejected);
        });
    }

    /**
     * Executes an api call (for example for creating or updating report texts and scores)
     *
     * @param {Object} callOptions - call options
     * @param {string} callOptions.apiMethod - api method
     * @param {Object} callOptions.postData - data to be posted
     * @param {string} callOptions.apiEndpoint - api endpoint
     * @param {string} callOptions.urlParams - api url params
     * @returns {Promise<any>} promise
     */
    saveReportEntityRelationship(callOptions) {
        const apiMethod = callOptions.apiMethod;
        const postData = callOptions.postData;
        const apiEndpoint = callOptions.apiEndpoint;
        const urlParams = callOptions.urlParams;

        // show loader
        document.querySelector('#spinner').classList.remove('hidden');

        return new Promise((onFulfilled, onRejected) => {

            // execute create/post request for given textFieldInReport
            this.api[apiMethod](
                this.api.getBaseUrl(),
                apiEndpoint,
                {
                    urlParams,
                    payload: {
                        type: 'form',
                        data: postData
                    }
                }
            ).then(response => {

                // hide loader
                document.querySelector('#spinner').classList.add('hidden');

                // check for input validation errors form the API
                if (response.errors) {

                    // show (translated) error message
                    this.actions.addAlert({ type: 'error', text: this.i18n.report_error_save_text });
                    Logger.instance.error({
                        message: 'Could not save report relationship/field',
                        component: Components.REPORT
                    });
                    return onRejected(new Error('Could not save report relationship/field'));
                }

                // resolve when the call succeeds
                return onFulfilled(response);

            }).catch(() => {
                document.querySelector('#spinner').classList.add('hidden');

                // show (translated) error message
                this.actions.addAlert({ type: 'error', text: this.i18n.report_error_save_text });
                return onRejected(new Error('Could not save report relationship/field'));
            });
        });
    }

    getReport(participantSessionId) {

        // show spinner
        document.querySelector('#spinner').classList.remove('hidden');

        // request report data
        this.api.get(
            this.api.getBaseUrl(),
            this.api.getEndpoints().report.entity,
            {
                urlParams: {
                    identifiers: {
                        slug: participantSessionId
                    }
                }
            }
        ).then(response => {
            document.querySelector('#spinner').classList.add('hidden');

            this.actions.getReport(response);

        }).catch(error => {
            document.querySelector('#spinner').classList.add('hidden');
            this.actions.addAlert({ type: 'error', text: error });
        });
    }

    generateReport() {
        return new Promise((onFulfilled, onRejected) => {

            this.api[ApiMethod.POST](
                this.api.getBaseUrl(),
                this.api.getEndpoints().report.generateReport,
                {
                    urlParams: {
                        identifiers: {
                            slug: this.participantSessionId
                        }
                    }
                }
            ).then(response => {

                if (response.errors) {

                    // show (translated) error message
                    return onRejected(new Error(this.i18n.report_download_pdf_problem_generating));
                }

                // resolve when the call succeeds
                return onFulfilled(response);

            }).catch(() => {
                this.actions.addAlert({ type: 'error', text: this.i18n.report_download_pdf_problem_generating });
                return onRejected(new Error(this.i18n.report_download_pdf_problem_generating));
            });
        });
    }

    getReportGenerationStatus() {
        return new Promise((onFulfilled, onRejected) => {
            this.api.get(
                this.api.getBaseUrl(),
                this.api.getEndpoints().report.reportGenerationStatus,
                {
                    urlParams: {
                        identifiers: {
                            slug: this.props.report.slug
                        }
                    }
                }
            ).then(response => {

                if (response.errors) {

                    // show (translated) error message
                    this.actions.addAlert({ type: 'error', text: this.i18n.report_download_pdf_problem_generating });
                    return onRejected(new Error(this.i18n.report_download_pdf_problem_generating));
                }

                if (response.generatedReport.generationStatus === DownloadReportGenerationStatus.PUBLISHED) {
                    this.actions.updateReportGenerationStatus(DownloadReportGenerationStatus.PUBLISHED, response.generatedReport.reportPublishedOn);
                }

                // resolve when the call succeeds
                return onFulfilled(response.generatedReport.generationStatus);

            }).catch(() => {
                this.actions.addAlert({ type: 'error', text: this.i18n.report_download_pdf_problem_generating });
                return onRejected(new Error(this.i18n.report_download_pdf_problem_generating));
            });
        });
    }

    downloadReport() {
        if (this.loadingPdf) {
            return;
        }

        const api = ApiFactory.get('neon');

        this.loadingPdf = true;

        // show spinner
        document.querySelector('#spinner').classList.remove('hidden');

        api.get(
            api.getBaseUrl(),
            api.getEndpoints().report.downloadReport,
            {
                urlParams: {
                    identifiers: {
                        slug: this.participantSessionId
                    }
                },
                headers: {
                    Accept: 'application/pdf'
                }
            }
        ).then(response => {

            if (!response || response.errors) {
                throw new Error('Could not download report');
            }

            // download the pdf file, exceptions thrown are automatically caught in the promise chain
            Utils.downloadPdfFromBlob(response.blob, {
                fileName: response.fileName
            });

            this.loadingPdf = false;
            document.querySelector('#spinner').classList.add('hidden');
        }).catch(error => {
            this.loadingPdf = false;
            document.querySelector('#spinner').classList.add('hidden');

            this.actions.addAlert({ type: 'error', text: this.i18n.report_download_pdf_problem_downloading });
            Logger.instance.error({
                component: Components.REPORT,
                message: `Could not download report for participantSession: ${this.participantSessionId}`,
                response: error && error.message ? error.message : error || ''
            });
        });
    }

    triggerRetest() {
        this.api.post(
            this.api.getBaseUrl(),
            this.api.getEndpoints().report.triggerRetest,
            {
                urlParams: {
                    identifiers: {
                        slug: this.participantSessionId
                    }
                }
            }
        ).then(response => {

            if (response.errors) {

                // show (translated) error message
                this.actions.addAlert({ type: 'error', text: this.i18n.report_retest_failed });
            } else {
                this.actions.addAlert({ type: 'success', text: this.i18n.report_retest_success });
            }

        }).catch(() => {
            this.actions.addAlert({ type: 'error', text: this.i18n.report_retest_failed });
        });
    }

    render() {
        const { report, languageId } = this.props;

        // ensure i18n is updated when the languageId changes
        this.i18n = translator(this.props.languageId, 'report');

        return (
            <Report
                report={ report }
                saveReportText={ this.saveReportText }
                saveCompetencyScore={ this.saveCompetencyScore }
                i18n={ this.i18n }
                languageId={ languageId }
                generateReport={ this.generateReport }
                downloadReport={ this.downloadReport }
                getReportGenerationStatus={ this.getReportGenerationStatus }
                triggerRetest={ this.triggerRetest }
            />
        );
    }
}

const mapStateToProps = state => ({
    report: state.reportReducer.report,
    languageId: state.headerReducer.languageId
});

export default connect(mapStateToProps)(Index);
