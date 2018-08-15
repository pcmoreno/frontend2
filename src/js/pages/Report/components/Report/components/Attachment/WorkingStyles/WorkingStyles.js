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

export default class WorkingStyles extends Component {
    render() {
        const { i18n, hnaCategoryScores = [] } = this.props;

        // construct the object required for the TextBlock component to render the text
        const workingStyles = {
            title: i18n.report_working_styles,
            slug: 'working_styles',
            name: 'working_styles',
            value: `${i18n.report_working_styles_default_text}`
        };

        return (
            <ReportSection>
                <ReportColumn>
                    <AttachmentRow intro={ true }>
                        <TextBlock
                            field={ workingStyles }
                            editable={ false }
                        />
                        <Details title={ i18n.report_questionnaires } i18n={ i18n }>
                            <ul>
                                <li>{ i18n.report_ltp_working_styles_test }</li>
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
                        <h4>{i18n.report_success_achievement}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.WorkingStyles.SUCCESS_ACHIEVEMENT] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.WorkingStyles.SUCCESS_ACHIEVEMENT] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_success_achievement_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_success_achievement_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_quality_achievement}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.WorkingStyles.QUALITY_ACHIEVEMENT] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.WorkingStyles.QUALITY_ACHIEVEMENT] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_quality_achievement_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_quality_achievement_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_development_orientation}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.WorkingStyles.DEVELOPMENT_ORIENTATION] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.WorkingStyles.DEVELOPMENT_ORIENTATION] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_development_orientation_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_development_orientation_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_performance_uncertainty}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.WorkingStyles.PERFORMANCE_UNCERTAINTY] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.WorkingStyles.PERFORMANCE_UNCERTAINTY] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_performance_uncertainty_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_performance_uncertainty_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_looking_for_challenges}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.WorkingStyles.LOOKING_FOR_CHALLENGES] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.WorkingStyles.LOOKING_FOR_CHALLENGES] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_looking_for_challenges_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_looking_for_challenges_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_decisiveness}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.WorkingStyles.DECISIVENESS] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.WorkingStyles.DECISIVENESS] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_decisiveness_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_decisiveness_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_goal_oriented}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.WorkingStyles.GOAL_ORIENTED] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.WorkingStyles.GOAL_ORIENTED] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_goal_oriented_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_goal_oriented_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_taking_risks}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.WorkingStyles.TAKING_RISKS] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.WorkingStyles.TAKING_RISKS] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_taking_risks_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_taking_risks_high_text } } />
                        </BulletList>
                    </AttachmentRow>
                </ReportColumn>
            </ReportSection>
        );
    }
}
