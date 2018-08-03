import { h, Component } from 'preact';
import ReportSection from '../../ReportSection/ReportSection';
import ReportColumn from '../../ReportSection/components/ReportColumn/ReportColumn';
import TextBlock from '../../../components/TextBlock/TextBlock';
import AttachmentRow from '../AttachmentRow/AttachmentRow';
import Details from '../Details/Details';
import ScoreBar from '../ScoreBar/ScoreBar';
import HnaCategories from '../../../../../../../constants/HnaCategories';

/** @jsx h */

export default class IntellectualCapabilities extends Component {
    render() {
        const { i18n, hnaCategoryScores = [], testedLevel = null } = this.props;

        let testedLevelSection = '';

        if (testedLevel) {
            testedLevelSection = `<p>${i18n.report_tested_level} ${testedLevel}</p>`;
        }

        // construct the object required for the TextBlock component to render the text
        const intellectualCapabilities = {
            title: i18n.report_intellectual_capabilities,
            slug: 'intellectual_capabilities',
            name: 'intellectual_capabilities',
            value: `<p>${i18n.report_intellectual_capabilities_default_text_paragraph_2}</p>`
        };

        /* todo: tested level is not properly used/injected into the component */

        return (
            <ReportSection>
                <ReportColumn>
                    <AttachmentRow intro={ true }>
                        <TextBlock
                            field={ intellectualCapabilities }
                            editable={ false }
                        />
                        {testedLevelSection}
                        <Details title={ i18n.report_questionnaires } i18n={ i18n }>
                            <ul>
                                <li>{ i18n.report_abstract_intelligence_test }</li>
                                <li>{ i18n.report_verbal_intelligence_test }</li>
                                <li>{ i18n.report_numeric_intelligence_test }</li>
                            </ul>
                        </Details>
                    </AttachmentRow>

                    <AttachmentRow intellectualCapabilities={ true }>
                        <h4>{i18n.report_abstract_intelligence}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.IntellectualCapabilities.ABSTRACT_INTELLIGENCE] } legend={ true } i18n={ i18n } />
                        <section />
                    </AttachmentRow>

                    <AttachmentRow intellectualCapabilities={ true }>
                        <p>{i18n.report_abstract_intelligence_text}</p>
                        <section />
                        <section />
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_verbal_intelligence}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.IntellectualCapabilities.VERBAL_INTELLIGENCE] } legend={ false } i18n={ i18n } />
                        <section />
                    </AttachmentRow>

                    <AttachmentRow intellectualCapabilities={ true }>
                        <p>{i18n.report_verbal_intelligence_text}</p>
                        <section />
                        <section />
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_numeric_intelligence}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.IntellectualCapabilities.NUMERIC_INTELLIGENCE] } legend={ false } i18n={ i18n } />
                        <section />
                    </AttachmentRow>

                    <AttachmentRow intellectualCapabilities={ true }>
                        <p>{i18n.report_numeric_intelligence_text}</p>
                        <section />
                        <section />
                    </AttachmentRow>
                </ReportColumn>
            </ReportSection>
        );
    }
}
