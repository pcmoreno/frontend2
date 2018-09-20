import { h, Component } from 'preact';
import ReportSection from '../ReportSection/ReportSection';
import TextBlock from '../../components/TextBlock/TextBlock';

/** @jsx h */

export default class Explanation extends Component {
    render() {
        const { texts, saveReportText, i18n } = this.props;

        if (!texts || !texts.strongPoints || !texts.pointsOfAttention) {
            return null;
        }

        texts.strongPoints.title = i18n.report_qualities_and_opportunities;
        texts.pointsOfAttention.title = i18n.report_points_of_attention_and_risks;

        if (!texts.strongPoints.value) {

            // note this value is empty by default
            texts.strongPoints.value = '';
        }

        if (!texts.pointsOfAttention.value) {

            // note this value is empty by default
            texts.pointsOfAttention.value = '';
        }

        return (
            <ReportSection title={ i18n.report_explanation } fullWidth={ true }>
                <TextBlock
                    field={ texts.strongPoints }
                    editable={ true }
                    saveReportText={ saveReportText }
                />
                <TextBlock
                    field={ texts.pointsOfAttention }
                    editable={ true }
                    saveReportText={ saveReportText }
                />
            </ReportSection>
        );
    }
}
