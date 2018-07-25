import { h, Component } from 'preact';
import ReportSection from '../ReportSection/ReportSection';
import ReportColumn from '../ReportSection/components/ReportColumn/ReportColumn';
import TextBlock from '../../components/TextBlock/TextBlock';

/** @jsx h */

export default class SelectionAdvice extends Component {

    render() {
        const { texts, saveReportText, i18n } = this.props;

        if (!texts || !texts.selectionAdvice) {
            return null;
        }

        texts.selectionAdvice.title = i18n.report_selection_advice;

        return (
            <ReportSection title={i18n.report_selection_advice}>
                <ReportColumn>
                    <p>{ i18n.report_selection_advice_default_text }</p>
                    { /* todo: insert dropdown here */ }
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
