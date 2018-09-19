import { h, Component } from 'preact';
import ReportSection from '../../ReportSection/ReportSection';
import ReportColumn from '../../ReportSection/components/ReportColumn/ReportColumn';
import TextBlock from '../../../components/TextBlock/TextBlock';
import AttachmentRow from '../AttachmentRow/AttachmentRow';
import Details from '../Details/Details';
import ScoreBar from '../ScoreBar/ScoreBar';
import BulletList from '../BulletList/BulletList';
import HnaCategories from '../../../../../../../constants/HnaCategories';
import ScoreLabel from '../ScoreLabel/ScoreLabel';

/** @jsx h */

export default class Personality extends Component {
    render() {
        const { i18n, hnaCategoryScores = [] } = this.props;

        // construct the object required for the TextBlock component to render the text
        const personality = {
            title: i18n.report_personality,
            slug: 'personality',
            name: 'personality',
            value: `${i18n.report_personality_default_text}`
        };

        return (
            <ReportSection>
                <ReportColumn>
                    <AttachmentRow intro={ true }>
                        <TextBlock
                            field={ personality }
                            editable={ false }
                        />
                        <Details title={ i18n.report_questionnaires } i18n={ i18n }>
                            <ul>
                                <li>{ i18n.report_ltp_personality_test }</li>
                            </ul>
                        </Details>
                    </AttachmentRow>

                    <AttachmentRow intellectualCapabilities={ true }>
                        <section />
                        <legend>
                            <span>{ i18n.report_low }</span>
                            <span>{ i18n.report_high }</span>
                        </legend>
                        <section />
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{ i18n.report_emotional_stability }</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.Personality.EMOTIONAL_STABILITY] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.Personality.EMOTIONAL_STABILITY] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{ i18n.report_low_score }</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_emotional_stability_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{ i18n.report_high_score }</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_emotional_stability_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{ i18n.report_extraversion }</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.Personality.EXTRAVERSION] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.Personality.EXTRAVERSION] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{ i18n.report_low_score }</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_extraversion_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{ i18n.report_high_score }</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_extraversion_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{ i18n.report_conscientiousness }</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.Personality.CONSCIENTIOUSNESS] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.Personality.CONSCIENTIOUSNESS] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{ i18n.report_low_score }</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_conscientiousness_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{ i18n.report_high_score }</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_conscientiousness_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{ i18n.report_open_mindness }</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.Personality.OPEN_MINDNESS] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.Personality.OPEN_MINDNESS] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{ i18n.report_low_score }</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_open_mindness_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{ i18n.report_high_score }</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_open_mindness_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{ i18n.report_mildness }</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.Personality.MILDNESS] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.Personality.MILDNESS] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{ i18n.report_low_score }</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_mildness_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{ i18n.report_high_score }</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_mildness_high_text } } />
                        </BulletList>
                    </AttachmentRow>
                </ReportColumn>
            </ReportSection>
        );
    }
}
