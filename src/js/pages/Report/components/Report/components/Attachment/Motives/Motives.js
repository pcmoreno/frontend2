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

export default class Motives extends Component {
    render() {
        const { i18n, hnaCategoryScores = [] } = this.props;

        // construct the object required for the TextBlock component to render the text
        const motives = {
            title: i18n.report_motives,
            slug: 'motives',
            name: 'motives',
            value: `${i18n.report_motives_default_text}`
        };

        return (
            <ReportSection>
                <ReportColumn>
                    <AttachmentRow intro={ true }>
                        <TextBlock
                            field={ motives }
                            editable={ false }
                        />
                        <Details title={ i18n.report_questionnaires } i18n={ i18n }>
                            <ul>
                                <li>{ i18n.report_ltp_motives_test }</li>
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
                        <h4>{i18n.report_performance_motivation}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.Motives.PERFORMANCE_MOTIVATION] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.Motives.PERFORMANCE_MOTIVATION] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_performance_motivation_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_performance_motivation_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_need_to_influence}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.Motives.NEED_TO_INFLUENCE] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.Motives.NEED_TO_INFLUENCE] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_need_to_influence_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_need_to_influence_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_need_for_acceptance}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.Motives.NEED_FOR_ACCEPTANCE] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.Motives.NEED_FOR_ACCEPTANCE] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_need_for_acceptance_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_need_for_acceptance_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    {/* attention! this is a typo coming from the API it should be dve-beaau */}
                    <AttachmentRow>
                        <h4>{i18n.report_need_for_autonomy}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.Motives.NEED_FOR_AUTONOMY] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.Motives.NEED_FOR_AUTONOMY] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_need_for_autonomy_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_need_for_autonomy_high_text } } />
                        </BulletList>
                    </AttachmentRow>
                </ReportColumn>
            </ReportSection>
        );
    }
}
