import { h, Component } from 'preact';
import ScoreLabels from './constants/ScoreLabels';
import style from './style/scorelabel.scss';

/** @jsx h */

export default class ScoreLabel extends Component {
    render() {
        const { i18n, score, intelligence = false } = this.props;

        if (!score) {
            return null;
        }

        return (
            <section className={ style.scoreLabel }>
                <h4>{ score }</h4>
                <span>{ intelligence === true ? i18n[ScoreLabels.intelligence[score]] || '' : i18n[ScoreLabels.default[score]] || '' }</span>
            </section>
        );
    }
}
