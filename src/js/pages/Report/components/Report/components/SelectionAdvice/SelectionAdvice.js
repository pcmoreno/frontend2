import { h, Component } from 'preact';
import ReportSection from '../ReportSection/ReportSection';
import ReportColumn from '../ReportSection/components/ReportColumn/ReportColumn';
import TextBlock from '../../components/TextBlock/TextBlock';
import style from './style/selectionadvice.scss';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import SelectionAdviceValues from '../../../../constants/SelectionAdviceValues';

/** @jsx h */

export default class SelectionAdvice extends Component {

    render() {
        const { texts, saveReportText, i18n } = this.props;
        let selectionAdvice = null;
        let bannerStyle = '';
        let bannerIcon = '';

        // only show for selection reports
        if (!texts || !texts.selectionAdvice) {
            return null;
        }

        texts.selectionAdvice.title = i18n.report_selection_advice;

        if (texts.selectionAdviceOutcome && texts.selectionAdviceOutcome.value) {
            selectionAdvice = texts.selectionAdviceOutcome.value.toLowerCase();
        } else {
            selectionAdvice = SelectionAdviceValues.POSITIVE;
        }

        switch (selectionAdvice) {
            case SelectionAdviceValues.POSITIVE:
                bannerStyle = style.positive;
                bannerIcon = <FontAwesomeIcon icon={ 'check' } />;
                break;
            case SelectionAdviceValues.TENTATIVE:
                bannerStyle = style.tentative;
                bannerIcon = <FontAwesomeIcon icon={ 'ellipsis-h' } />;
                break;
            case SelectionAdviceValues.NEGATIVE:
                bannerStyle = style.negative;
                bannerIcon = <FontAwesomeIcon icon={ 'times' } />;
                break;
            default:
                bannerStyle = style.positive;
                bannerIcon = <FontAwesomeIcon icon={ 'check' } />;
                break;
        }

        return (
            <ReportSection title={i18n.report_selection_advice}>
                <ReportColumn>
                    <p>{ i18n.report_selection_advice_default_text }</p>
                    <div className={ `${style.selectionBlock} ${bannerStyle}` }>
                        { bannerIcon }
                        <span>{ i18n[`report_${selectionAdvice}`] }</span>
                    </div>
                    <TextBlock
                        field={texts.selectionAdvice}
                        hideTitle={true}
                        editable={true}
                        saveReportText={saveReportText}
                    />
                </ReportColumn>
            </ReportSection>
        );
    }
}
