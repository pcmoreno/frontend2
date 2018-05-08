import { h, Component } from 'preact';
import ReportSection from '../ReportSection/ReportSection';
import TextBlock from '../ReportSection/components/ReportColumn/components/TextBlock/TextBlock';

/** @jsx h */

export default class DevelopmentAdvice extends Component {

    render() {
        const { texts, saveReportText, i18n } = this.props;

        if (!texts || !texts.developmentAdvice) {
            return null;
        }

        texts.developmentAdvice.title = i18n.development_advice;

        if (!texts.developmentAdvice.value) {

            // note this value is empty by default
            texts.developmentAdvice.value = '';
        }

        return (
            <ReportSection title={i18n.development_advice}>

                <TextBlock
                    field={texts.developmentAdvice}
                    hideTitle={true}
                    editable={true}
                    saveReportText={saveReportText}
                />
            </ReportSection>
        );
    }
}
