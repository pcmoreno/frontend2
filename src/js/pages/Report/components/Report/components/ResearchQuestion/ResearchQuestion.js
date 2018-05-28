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

        texts.researchQuestion.title = i18n.report_research_question;

        // note that texts that have been altered using the Froala editor, and are thus received over the API, will have
        // a <p> tag wrapped around it. since the default texts no longer have this tag (we removed CDATA and <p> tags
        // in Lokalise) the <p> tag is added here programmatically, to ensure consistency in styling.

        if (!texts.researchQuestion.value) {
            texts.researchQuestion.value = `<p>${i18n.report_research_question_default_text}</p>`;
        }

        return (
            <ReportSection title={i18n.report_research_question}>
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
