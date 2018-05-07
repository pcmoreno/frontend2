import { h, Component } from 'preact';
import ReportSection from '../ReportSection/ReportSection';
import ReportColumn from '../ReportSection/components/ReportColumn/ReportColumn';
import TextBlock from '../ReportSection/components/ReportColumn/components/TextBlock/TextBlock';

/** @jsx h */

export default class Introduction extends Component {

    render() {
        const { texts, saveReportText, i18n } = this.props;

        if (!texts) {
            return null;
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
