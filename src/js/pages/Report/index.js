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

        // reset state, so old report data is unset, until we get new data
        this.actions.resetReport();
    }

    componentDidMount() {
        updateNavigationArrow();

        // retrieve report data by URL parameters
        this.participantSessionId = this.props.matches.participantSessionId;

        this.reportTextsBeingCreated = [];
        this.reportTextsCreated = {};

        // fetch report data
        this.getReport(this.participantSessionId);
    }

    /**
     * Sends an api call to create or update the given report text
     * ids correspond to the specific textFieldInReportId
     *
     * @param {Object} reportText - report text object
     * @param {string} reportText.slug - slug of text field
     * @param {string} reportText.textFieldTemplateSlug - template slug of text field
     * @param {string} reportText.name - text field name
     * @param {string} [reportText.value] - text field value
     * @param {boolean} stateRefresh - refresh state or not
     * @returns {Promise} promise
     */
    saveReportText(reportText, stateRefresh) {
        const reportSlug = this.props.report.slug;

        reportText.value = reportText.value || '';

        if (!(reportText.slug || reportText.textFieldTemplateSlug) || !reportText.name) {
            Logger.instance.error({
                component: 'Report',
                message: 'Report text field: one of the slugs and name field are required'
            });
            return null;
        }

        const uniqueFieldName = `${reportText.textFieldTemplateSlug}-${reportText.name}`;

        // check if this report text was created before in this session
        if (!reportText.slug && this.reportTextsCreated[uniqueFieldName]) {
            reportText.slug = this.reportTextsCreated[uniqueFieldName];
        }

        // check if report text is existing or should be created
        // in this case, its a new text and we were not creating this one yet...
        if (!reportText.slug && !~this.reportTextsBeingCreated.indexOf(uniqueFieldName)) {
            this.reportTextsBeingCreated.push(uniqueFieldName);

        } else if (~this.reportTextsBeingCreated.indexOf(uniqueFieldName)) {

            // text field is being created, ignore for now
            return null;
        }

        // build up the payload depending on whether we're going to create or update
        let apiMethod = null;
        let apiEndpoint = null;
        let urlParams = null;
        let postData = null;

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

                let textFieldSlug = reportText.slug;

                // hide loader
                document.querySelector('#spinner').classList.add('hidden');

                // check for input validation errors form the API
                if (response.errors) {

                    // show (translated) error message
                    this.actions.addAlert({ type: 'error', text: this.i18n.report_error_save_text });

                    return onRejected(new Error('Could not save report text field'));
                }

                // Update the state with the new id if we just created a text field, do nothing on update
                if (apiMethod === ApiMethod.POST && response.entry.textFieldInReportSlug) {

                    textFieldSlug = response.entry.textFieldInReportSlug;

                    // todo: state changes will interfere with the froala editor, so for now we store the new ids in reportTextsCreated...
                    // store this in the local state for when we try to update the same text field in the same session
                    this.reportTextsCreated[uniqueFieldName] = response.entry.textFieldInReportSlug;

                    // clear stored value that this text was being created
                    this.reportTextsBeingCreated.splice(this.reportTextsBeingCreated.indexOf(uniqueFieldName), 1);
                }

                // don't do this for froala editor texts, only for scores that are text fields
                if (stateRefresh) {
                    this.actions.updateTextField({
                        slug: textFieldSlug,
                        name: reportText.name,
                        value: reportText.value
                    });
                }

                // resolve when the call succeeds
                return onFulfilled({});

            }).catch((/* error */) => {
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
