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

export default class InfluencingStyles extends Component {
    render() {
        const { i18n, hnaCategoryScores = [] } = this.props;

        // construct the object required for the TextBlock component to render the text
        const influencingStyles = {
            title: i18n.report_influencing_styles,
            slug: 'influencing_styles',
            name: 'influencing_styles',
            value: `${i18n.report_influencing_styles_default_text}`
        };

        return (
            <ReportSection>
                <ReportColumn>
                    <AttachmentRow intro={ true }>
                        <TextBlock
                            field={ influencingStyles }
                            editable={ false }
                        />
                        <Details title={ i18n.report_questionnaires } i18n={ i18n }>
                            <ul>
                                <li>{ i18n.report_ltp_influencing_styles_test }</li>
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
                        <h4>{i18n.report_manipulative}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.InfluencingStyles.MANIPULATIVE] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.InfluencingStyles.MANIPULATIVE] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_manipulative_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_manipulative_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_straightforward}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.InfluencingStyles.STRAIGHTFORWARD] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.InfluencingStyles.STRAIGHTFORWARD] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_straightforward_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_straightforward_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_assertive}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.InfluencingStyles.ASSERTIVE] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.InfluencingStyles.ASSERTIVE] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_assertive_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_assertive_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_anticipating}</h4>
                        <ScoreBar score={ hnaCategoryScores[HnaCategories.InfluencingStyles.ANTICIPATING] } i18n={ i18n } />
                        <ScoreLabel score={ hnaCategoryScores[HnaCategories.InfluencingStyles.ANTICIPATING] } i18n={ i18n } />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_anticipating_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_anticipating_high_text } } />
                        </BulletList>
                    </AttachmentRow>
                </ReportColumn>
            </ReportSection>
        );
    }
}
