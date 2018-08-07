import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as reportActions from './actions/report';
import * as alertActions from './../../components/Alert/actions/alert';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import ApiFactory from '../../utils/api/factory';
import Report from './components/Report/Report';
import translator from '../../utils/translator';
import Logger from '../../utils/logger';
import ApiMethod from '../../utils/api/constants/ApiMethod';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, reportActions, alertActions),
            dispatch
        );

        this.api = ApiFactory.get('neon');

        this.saveReportText = this.saveReportText.bind(this);
    }

    componentWillMount() {
        document.title = 'Report';
    }

    componentWillUnmount() {
        this.reportTextsBeingCreated = [];
        this.reportTextsCreated = {};

        // reset state, so old report data is unset, until we get new data
        this.actions.resetReport();
    }

    componentDidMount() {
        updateNavigationArrow();

        // retrieve report data by URL parameters
        this.participantSessionId = this.props.matches.participantSessionId;

        // saves format 'templateSlug-fieldName', to keep track of the fields that are being created at this moment
        this.reportTextsBeingCreated = [];

        // saves mapping of key/value 'templateSlug-fieldName': newSlug
        this.reportTextsCreated = {};

        // fetch report data
        this.getReport(this.participantSessionId);
    }

    /**
     * Sends an api call to create or update the given report text
     *
     * @param {Object} reportText - report text object
     * @param {string|null} [reportText.slug] - slug of text field
     * @param {string} reportText.textFieldTemplateSlug - template slug of text field
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
                textField: reportText.textFieldTemplateSlug
            };
        }

        return new Promise((onFulfilled, onRejected) => {

            // verify template slug upon creation
            if (apiMethod === ApiMethod.POST && !postData.textField) {
                Logger.instance.error({
                    message: 'Template slug missing upon creation of report text field',
                    component: 'report'
                });
                this.actions.addAlert({ type: 'error', text: this.i18n.report_error_save_text });
                return onRejected(new Error('Template slug missing upon creation of report text field'));
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
                        message: 'Did not receive new report slug upon creation',
                        component: 'report'
                    });
                    this.actions.addAlert({ type: 'error', text: this.i18n.report_error_save_text });
                    return onRejected(new Error('Did not receive new report slug upon creation'));
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
                    return onRejected(new Error('Could not save report text field'));
                }

                // resolve when the call succeeds
                return onFulfilled(response);

            }).catch(() => {
                document.querySelector('#spinner').classList.add('hidden');

                // show (translated) error message
                this.actions.addAlert({ type: 'error', text: this.i18n.report_error_save_text });
                return onRejected(new Error('Could not save report text field'));
            });
        });
    }

    getReport(participantSessionId) {

        // show spinner
        document.querySelector('#spinner').classList.remove('hidden');

        this.i18n = translator(this.props.languageId, 'report');

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

    render() {
        return (
            <Report
                report = { this.props.report }
                saveReportText={ this.saveReportText }
                i18n = { this.i18n }
                languageId={ this.props.languageId }
            />
        );
    }
}

const mapStateToProps = state => ({
    report: state.reportReducer.report,
    languageId: state.headerReducer.languageId
});

export default connect(mapStateToProps)(Index);
