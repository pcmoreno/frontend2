import { h, Component } from 'preact';

/** @jsx h */

import ReportSection from '../ReportSection/ReportSection';
import ReportColumn from '../ReportSection/components/ReportColumn/ReportColumn';
import TextBlock from '../ReportSection/components/ReportColumn/components/TextBlock/TextBlock';

export default class Introduction extends Component {

    render() {
        const { texts, saveReportText, i18n } = this.props;

        if (!texts || !texts.goal || !texts.validity || !texts.parts || !texts.structure) {
            return null;
        }

        texts.goal.title = i18n.report_about_this_report;
        texts.validity.title = i18n.report_validity;
        texts.parts.title = i18n.report_components;
        texts.structure.title = i18n.report_structure_of_the_report;

        // note that texts that have been altered using the Froala editor, and are thus received over the API, will have
        // a <p> tag wrapped around it. since the default texts no longer have this tag (we removed CDATA and <p> tags
        // in Lokalise) the <p> tag is added here programmatically, to ensure consistency in styling.

        // set default text if there was no text on the report ( no slug )
        if (!texts.goal.slug) {
            texts.goal.value = `<p>${i18n.report_about_this_report_default_text}</p>`;
        }

        // set default text if there was no text on the report ( no slug )
        if (!texts.validity.slug) {
            texts.validity.value = `<p>${i18n.report_validity_default_text}</p>`;
        }

        // set default text if there was no text on the report ( no slug )
        if (!texts.parts.slug) {
            texts.parts.value = `<p>${i18n.report_components_default_text}</p>`;
        }

        // set default text if there was no text on the report ( no slug )
        if (!texts.structure.slug) {
            texts.structure.value = `<p>${i18n.report_structure_of_the_report_default_text}</p>`;
        }

        return (
            <ReportSection title={i18n.report_introduction}>
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
