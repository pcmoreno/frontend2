import { h, Component } from 'preact';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import DownloadReportGenerationStatus from '../../../../../../constants/DownloadReportGenerationStatus';
import style from './style/downloadreport.scss';
import AppConfig from '../../../../../../../../App.config';

/** @jsx h */

export default class DownloadReport extends Component {
    constructor(props) {
        super(props);

        this.localState = {
            generating: this.props.generatedReport.generationStatus === DownloadReportGenerationStatus.GENERATING
        };
    }

    generateReport() {

        // immediately hide the generate button to prevent bashing
        this.localState.generating = true;
        this.setState(this.localState);

        this.props.generateReport().then(() => {
            this.startReportStatusPolling();
        });
    }

    downloadReport() {
        this.props.downloadReport();
    }

    startReportStatusPolling() {
        this.reportStatusPollingTimeout = window.setTimeout(() => {
            this.reportStatusPollingInterval = window.setInterval(() => {

                // poll the generation status of the report
                this.props.getReportGenerationStatus().then(status => {

                    // the getReportGenerationStatus wil update the state, so only need to cancel the polling here
                    if (status === DownloadReportGenerationStatus.PUBLISHED) {
                        this.localState.generating = false;
                        this.setState(this.localState);
                        this.stopReportStatusPolling();
                    }
                }).catch(() => {
                    this.stopReportStatusPolling();
                });
            }, AppConfig.report.reportPollingInterval);
        }, AppConfig.report.reportPollingStartTimeout);
    }

    stopReportStatusPolling() {
        if (this.reportStatusPollingTimeout) {
            window.clearTimeout(this.reportStatusPollingTimeout);
            this.reportStatusPollingTimeout = null;
            delete this.reportStatusPollingTimeout;
        }

        if (this.reportStatusPollingInterval) {
            window.clearInterval(this.reportStatusPollingInterval);
            this.reportStatusPollingInterval = null;
            delete this.reportStatusPollingInterval;
        }
    }

    componentWillUnmount() {
        this.stopReportStatusPolling();
    }

    render() {
        const { i18n, generatedReport } = this.props;

        // only show the download button when the status is 'published'
        const downloadButton = (generatedReport.generationStatus === DownloadReportGenerationStatus.PUBLISHED
            ? <button
                type="submit"
                className="action_button light_with_dark_hover"
                onClick={ () => {
                    this.downloadReport();
                } }
            >
                <FontAwesomeIcon icon={ 'download' } />
                <span>{`${i18n.report_download_pdf_current_version}: ${generatedReport.generationDate}`}</span>
            </button>
            : null);

        // only show the generate button when the status is not 'generating'
        const generateButton = (this.localState.generating === true
            ? <p>{ i18n.report_download_pdf_explanation }</p>
            : <button
                type="submit"
                className="action_button light_with_dark_hover"
                onClick={ () => {
                    this.generateReport();
                } }
            >
                <FontAwesomeIcon icon={ 'sync-alt' } />
                <span>{ i18n.report_download_pdf_generate }</span>
            </button>
        );

        return (
            <section className={ style.downloadreport }>
                <h4>{ i18n.report_download_pdf_title }</h4>
                { downloadButton }
                { generateButton }
            </section>
        );
    }
}
