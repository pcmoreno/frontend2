import { h, Component } from 'preact';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/downloadreport.scss';

/** @jsx h */

export default class DownloadReport extends Component {
    constructor(props) {
        super(props);

        this.localState = {
            generating: false
        };
    }

    handleGenerateReport() {
        this.localState.generating = true;
        this.setState(this.localState);

        this.props.generateReport();
    }

    render() {
        const { i18n } = this.props;

        const generateButton = this.localState.generating === true
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
            </button>;

        return (
            <section className={ style.downloadreport }>
                <h4>{ i18n.report_download_pdf_title }</h4>
                <button
                    type="submit"
                    className="action_button light_with_dark_hover"
                >
                    <FontAwesomeIcon icon={ 'download' } />
                    <span>{ `${i18n.report_download_pdf_current_version}: 12-12-2018` }</span>
                </button>
                { generateButton }
            </section>
        );
    }
}
