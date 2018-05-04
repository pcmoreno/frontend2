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
        // texts.goal.title = i18n.goal_title;
        texts.goal.title = 'Goal';
        texts.validity.title = 'Validity';
        texts.parts.title = 'Parts';
        texts.structure.title = 'Structure';

        // todo: add default texts when the value is empty
        if (!texts.goal.value) {
            texts.goal.value = 'Todo: add default translated text here';
        }

        if (!texts.validity.value) {
            texts.validity.value = 'Todo: add default translated text here';
        }

        if (!texts.parts.value) {
            texts.parts.value = 'Todo: add default translated text here';
        }

        if (!texts.structure.value) {
            texts.structure.value = 'Todo: add default translated text here';
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
