import { h, Component } from 'preact';
import ReportSection from '../../ReportSection/ReportSection';
import ReportColumn from '../../ReportSection/components/ReportColumn/ReportColumn';
import TextBlock from '../../../components/TextBlock/TextBlock';
import AttachmentRow from '../AttachmentRow/AttachmentRow';
import Details from '../Details/Details';
import ScoreBar from '../ScoreBar/ScoreBar';
import BulletList from '../BulletList/BulletList';

/** @jsx h */

export default class IntellectualCapabilities extends Component {
    render() {
        const { i18n, score = null } = this.props;

        // construct the object required for the TextBlock component to render the text
        const intellectualCapabilities = {
            title: i18n.report_intellectual_capabilities,
            value: `<p>${i18n.report_intellectual_capabilities_default_text_paragraph_2}</p>`
        };

        /* attachmentRow component was introduced to keep linked parts of each attachment/explanation block together */
        /* especially after collapsing for the responsive view. it also helps aligning. composition was used to keep */
        /* things clear. should attachments ever need to become editable, the TextBlock component can be leveraged */

        return (
            <ReportSection>
                <ReportColumn>
                    <AttachmentRow intro={ true }>
                        <TextBlock
                            field={ intellectualCapabilities }
                            editable={ false }
                        />
                        <Details title={ i18n.report_questionnaires } i18n={ i18n }>
                            <ul>
                                <li>{ i18n.report_abstract_intelligence_test }</li>
                                <li>{ i18n.report_verbal_intelligence_test }</li>
                                <li>{ i18n.report_numeric_intelligence_test }</li>
                            </ul>
                        </Details>
                    </AttachmentRow>
                    <AttachmentRow>
                        <h4>{i18n.report_abstract_intelligence}</h4>
                        <ScoreBar score={ score } legend={ true } i18n={ i18n } />
                        <section />
                    </AttachmentRow>
                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_emotional_stability_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_emotional_stability_high_text } } />
                        </BulletList>
                    </AttachmentRow>
                </ReportColumn>
            </ReportSection>
        );
    }
}
