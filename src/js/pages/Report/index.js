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

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, reportActions, alertActions),
            dispatch
        );

        this.api = ApiFactory.get('neon');
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

        // fetch report data
        this.getReport(this.participantSessionId);
    }

    /**
     * Sends an api call to create or update the given report text
     * ids correspond to the specific textFieldInReportId
     *
     * @param {string|null} textFieldInReportSlug - id
     * @param {string|null} textFieldTemplateSlug - id
     * @param {string} text - text
     * @returns {Promise} promise
     */
    saveReportText(textFieldInReportSlug, textFieldTemplateSlug, text) {
        const reportSlug = this.props.report.slug;

        // show loader
        document.querySelector('#spinner').classList.remove('hidden');

        return new Promise((onFulfilled, onRejected) => {

            if (textFieldInReportSlug) {

                // execute create/post request for given textFieldInReport
                this.api.put(
                    this.api.getBaseUrl(),
                    this.api.getEndpoints().report.updateTextField,
                    {
                        urlParams: {
                            identifiers: {
                                slug: textFieldInReportSlug
                            }
                        },
                        payload: {
                            type: 'form',
                            data: {
                                textFieldInReportValue: text
                            }
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
                    return onFulfilled({});

                }).catch((/* error */) => {

                    // show (translated) error message
                    this.actions.addAlert({ type: 'error', text: this.i18n.report_error_save_text });

                    return onRejected(new Error('Could not save report text field'));
                });

            } else {

                // execute create/post request for given textFieldInReport
                this.api.post(
                    this.api.getBaseUrl(),
                    this.api.getEndpoints().report.createTextField,
                    {
                        urlParams: {
                            parameters: {
                                fields: 'textFieldInReportSlug'
                            }
                        },
                        payload: {
                            type: 'form',
                            data: {
                                report: reportSlug,
                                textFieldInReportValue: text,
                                textField: textFieldTemplateSlug
                            }
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

                    // resolve with the new textFieldInReport id, to avoid multiple posts on this field.
                    return onFulfilled({
                        slug: response.entry && response.entry.textFieldInReportSlug
                    });

                }).catch((/* error */) => {

                    // show (translated) error message
                    this.actions.addAlert({ type: 'error', text: this.i18n.report_error_save_text });

                    return onRejected(new Error('Could not save report text field'));
                });
            }
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
                saveReportText={this.saveReportText.bind(this)}
                i18n = { this.i18n }
            />
        );
    }
}

const mapStateToProps = state => ({
    report: state.reportReducer.report,
    languageId: state.headerReducer.languageId
});

export default connect(mapStateToProps)(Index);
