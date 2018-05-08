import { h, Component } from 'preact';
import ReportSection from '../ReportSection/ReportSection';
import ReportColumn from '../ReportSection/components/ReportColumn/ReportColumn';
import TextBlock from '../ReportSection/components/ReportColumn/components/TextBlock/TextBlock';

/** @jsx h */

export default class Introduction extends Component {

    render() {
        const { texts, saveReportText, i18n } = this.props;

        if (!texts || !texts.goal || !texts.validity || !texts.parts || !texts.structure) {
            return null;
        }

        // todo: set translated titles
        texts.goal.title = i18n.about_this_report;
        texts.validity.title = i18n.validity;
        texts.parts.title = i18n.components;
        texts.structure.title = i18n.structure_of_the_report;

        // todo: add default texts when the value is empty
        if (!texts.goal.value) {
            texts.goal.value = i18n.about_this_report_default_text;
        }

        if (!texts.validity.value) {
            texts.validity.value = i18n.validity_default_text;
        }

        if (!texts.parts.value) {
            texts.parts.value = i18n.components_default_text;
        }

        if (!texts.structure.value) {
            texts.structure.value = i18n.structure_of_the_report_default_text;
        }

        return (
            <ReportSection title={i18n.introduction}>
                <ReportColumn>
                    <TextBlock
                        field={texts.goal}
                        editable={true}
                        saveReportText={saveReportText}
                    />
                    <TextBlock
                        field={texts.validity}
                        editable={true}
                        saveReportText={saveReportText}
                    />
                </ReportColumn>
                <ReportColumn>
                    <TextBlock
                        field={texts.parts}
                        editable={true}
                        saveReportText={saveReportText}
                    />
                    <TextBlock
                        field={texts.structure}
                        editable={true}
                        saveReportText={saveReportText}
                    />
                </ReportColumn>
            </ReportSection>
        );
    }
}
