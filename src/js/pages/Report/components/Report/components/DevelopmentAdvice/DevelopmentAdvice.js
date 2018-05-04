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

        // set translated title
        texts.developmentAdvice.title = i18n.development_advice;

        // todo: add default texts when the value is empty
        if (!texts.developmentAdvice.value) {
            texts.developmentAdvice.value = 'Todo: add default translated text here';
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
