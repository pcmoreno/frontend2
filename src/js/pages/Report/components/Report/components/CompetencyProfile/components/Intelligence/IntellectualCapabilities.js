import { h, Component } from 'preact';
import style from './style/intellectualcapabilities.scss';
import ScoreBar from '../../../ScoreBar/ScoreBar';

/** @jsx h */

const intelligenceScoreCount = 5;

export default class IntellectualCapabilities extends Component {

    render() {
        const { i18n, score, educationLevel } = this.props;

        const educationLevelTranslation = `report_tested_level_${educationLevel}`;

        return (
            <div className={ style.intelligence }>
                <h3>{ i18n.report_intellectual_capabilities }</h3>
                <section className={ style.scoreContainer }>
                    <h3 className="hidden">{ i18n.report_intellectual_capabilities }</h3>
                    <h2>{ score }</h2>
                    <ScoreBar
                        score={ score }
                        count={ intelligenceScoreCount }
                    />
                </section>
                <section className={ style.textContainer }>
                    <div
                        dangerouslySetInnerHTML={{ __html: i18n.report_intellectual_capabilities_default_text_paragraph_1 }}
                    />
                    <p>{ `${i18n.report_tested_level} ${i18n[educationLevelTranslation] || ''}` }</p>
                </section>
            </div>
        );
    }
}
