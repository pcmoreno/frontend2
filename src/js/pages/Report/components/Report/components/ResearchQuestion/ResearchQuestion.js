import { h, Component } from 'preact';
import ReportSection from '../ReportSection/ReportSection';
import ReportColumn from '../ReportSection/components/ReportColumn/ReportColumn';
import TextBlock from '../ReportSection/components/ReportColumn/components/TextBlock/TextBlock';

/** @jsx h */

export default class ResearchQuestion extends Component {

    render() {
        const { texts, saveReportText, i18n } = this.props;

        if (!texts || !texts.researchQuestion) {
            return null;
        }

        // set translated title
        texts.researchQuestion.title = i18n.research_question;

        // add default texts when the value is empty
        if (!texts.researchQuestion.value) {
            texts.researchQuestion.value = i18n.research_question_default_text;
        }

        return (
            <ReportSection title={i18n.research_question}>
                <ReportColumn>
                    <TextBlock
                        field={texts.researchQuestion}
                        hideTitle={true}
                        editable={true}
                        saveReportText={saveReportText}
                    />
                </ReportColumn>
            </ReportSection>
        );
    }
}
