import { h, Component } from 'preact';
import style from './style/intelligence.scss';
import ScoreBar from '../../../ScoreBar/ScoreBar';

/** @jsx h */

const intelligenceScoreCount = 5;

export default class Intelligence extends Component {

    render() {
        const { i18n, score } = this.props;

        // todo: add the missing tested level

        return (
            <div className={ style.intelligence }>
                <section>
                    <h3>{ i18n.report_intellectual_capabilities }</h3>
                    <p>{ i18n.report_intellectual_capabilities_default_text_paragraph_1 }</p>
                    <p>{ `${i18n.report_tested_level} ${'todo: add the education level'}` }</p>
                </section>
                <section className={ style.scoreContainer }>
                    <h2>{ score }</h2>
                    <ScoreBar
                        score={ score }
                        count={ intelligenceScoreCount }
                    />
                </section>
            </div>
        );
    }
}
