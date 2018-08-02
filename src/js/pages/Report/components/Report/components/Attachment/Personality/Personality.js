import { h, Component } from 'preact';
import ReportSection from '../../ReportSection/ReportSection';
import ReportColumn from '../../ReportSection/components/ReportColumn/ReportColumn';
import TextBlock from '../../../components/TextBlock/TextBlock';
import AttachmentRow from '../AttachmentRow/AttachmentRow';
import Details from '../Details/Details';
import ScoreBar from '../ScoreBar/ScoreBar';
import BulletList from '../BulletList/BulletList';

/** @jsx h */

export default class Personality extends Component {
    render() {
        const { i18n, score = null } = this.props;

        // construct the object required for the TextBlock component to render the text
        const personality = {
            title: i18n.report_personality,
            value: `<p>${i18n.report_personality_default_text}</p>
                    <p>${i18n.report_personality_questionnaire_intro_text}</p>`
        };

        /* todo: score is not properly used/injected into the component */

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

                    <AttachmentRow>
                        <h4>{i18n.report_emotional_stability}</h4>
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

                    <AttachmentRow>
                        <h4>{i18n.report_extraversion}</h4>
                        <ScoreBar score={ score } legend={ false } i18n={ i18n } />
                        <section />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_extraversion_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_extraversion_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_conscientiousness}</h4>
                        <ScoreBar score={ score } legend={ false } i18n={ i18n } />
                        <section />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_conscientiousness_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_conscientiousness_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_open_mindness}</h4>
                        <ScoreBar score={ score } legend={ false } i18n={ i18n } />
                        <section />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_open_mindness_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_open_mindness_high_text } } />
                        </BulletList>
                    </AttachmentRow>

                    <AttachmentRow>
                        <h4>{i18n.report_mildness}</h4>
                        <ScoreBar score={ score } legend={ false } i18n={ i18n } />
                        <section />
                    </AttachmentRow>

                    <AttachmentRow>
                        <section />
                        <BulletList>
                            <header>{i18n.report_low_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_mildness_low_text } } />
                        </BulletList>
                        <BulletList>
                            <header>{i18n.report_high_score}</header>
                            <p dangerouslySetInnerHTML={ { __html: i18n.report_mildness_high_text } } />
                        </BulletList>
                    </AttachmentRow>
                </ReportColumn>
            </ReportSection>
        );
    }
}
