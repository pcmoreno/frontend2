import { h, Component } from 'preact';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import downloadReportGenerationStatus from '../../../../../../constants/downloadReportGenerationStatus';
import style from './style/downloadreport.scss';

/** @jsx h */

export default class DownloadReport extends Component {
    constructor(props) {
        super(props);

        this.localState = {
            generating: this.props.generatedReport.generationStatus === downloadReportGenerationStatus.GENERATING
        };
    }

    handleGenerateReport() {

        // immediately hide the generate button to prevent bashing
        this.localState.generating = true;
        this.setState(this.localState);

        this.props.generateReport();
    }

    handleDownloadReport() {
        this.props.downloadReport();
    }

    render() {
        const { i18n, generatedReport } = this.props;


        // only show the downloadbutton when the status is 'published' todo: add link to report
        const downloadButton = (generatedReport.generationStatus === downloadReportGenerationStatus.PUBLISHED
            ? <button
                type="submit"
                className="action_button light_with_dark_hover"
                onClick={ () => {
                    this.handleDownloadReport();
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
                    this.handleGenerateReport();
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
