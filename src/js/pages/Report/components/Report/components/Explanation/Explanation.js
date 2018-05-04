import { h, Component } from 'preact';
import ReportSection from '../ReportSection/ReportSection';
import TextBlock from '../ReportSection/components/ReportColumn/components/TextBlock/TextBlock';

/** @jsx h */

export default class Explanation extends Component {

    render() {
        const { texts, saveReportText /* , i18n */ } = this.props;

        if (!texts || !texts.strongPoints || !texts.pointsOfAttention) {
            return null;
        }

        // todo: set translated title
        // texts.strongPoints.title = i18n.trans_key;
        texts.strongPoints.title = 'Strong points';
        texts.pointsOfAttention.title = 'Points of attention';

        // todo: add default texts when the value is empty
        if (!texts.strongPoints.value) {
            texts.strongPoints.value = 'Todo: add default translated text here';
        }

        if (!texts.pointsOfAttention.value) {
            texts.pointsOfAttention.value = 'Todo: add default translated text here';
        }

        // todo: translate section title
        return (
            <ReportSection title={'Explanation'} fullWidth={true}>
                <TextBlock
                    field={texts.strongPoints}
                    editable={true}
                    saveReportText={saveReportText}
                />
                <TextBlock
                    field={texts.pointsOfAttention}
                    editable={true}
                    saveReportText={saveReportText}
                />
            </ReportSection>
        );
    }
}
