import { h, Component } from 'preact';
import ReportSection from '../ReportSection/ReportSection';
import ReportColumn from '../ReportSection/components/ReportColumn/ReportColumn';
import TextBlock from '../ReportSection/components/ReportColumn/components/TextBlock/TextBlock';

/** @jsx h */

export default class SelectionAdvice extends Component {

    render() {
        const { texts, saveReportText, i18n } = this.props;

        if (!texts || !texts.selectionAdvice) {
            return null;
        }

        // set translated title
        texts.selectionAdvice.title = i18n.selection_advice;

        // add default texts when the value is empty
        if (!texts.selectionAdvice.value) {
            texts.selectionAdvice.value = i18n.selection_advice_default_text;
        }

        return (
            <ReportSection title={i18n.selection_advice}>
                <ReportColumn>
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
