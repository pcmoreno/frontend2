import { h, Component } from 'preact';
import { ScoreColors } from '../../../../constants/ScoreColors';
import style from './style/scorebar.scss';
import Utils from 'neon-frontend-utils/src/utils';

/** @jsx h */

const svgXOffset = 104;
const svgWidth = 100;

const svgHeight = 90;
const svgActiveHeight = 100;

const svgYOffset = 35;
const svgActiveYOffset = 30;

/**
 * Horizontal score bar
 *
 * @example
 * <ScoreBar>
 *     min={1}
 *     score={4}
 *     max={5}
 * </ScoreBar>
 */
export default class ScoreBar extends Component {
    render() {
        const { min, max } = this.props;
        let { score } = this.props;
        const elements = [];

        score = Utils.parseScore(score, min, max, true);

        const activeStyle = {
            fill: ScoreColors[score] || ''
        };

        // build the svg item list
        for (let i = 0; i < max; i++) {
            const active = score >= (i + 1);

            elements.push(
                <rect
                    x={ i * svgXOffset }
                    y={ active ? svgActiveYOffset : svgYOffset }
                    width={ svgWidth }
                    height={ active ? svgActiveHeight : svgHeight }
                    style={ active && activeStyle }
                />
            );
        }

        return (
            <section className={ style.scoreBar }>
                <h1>{ score > 0 ? score : '' }</h1>
                <svg version="1.0" x="0px" y="0px" viewBox="0 0 516 140">
                    <g>
                        { elements }
                    </g>
                </svg>
            </section>
        );
    }
}
