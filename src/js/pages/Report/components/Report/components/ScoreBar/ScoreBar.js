import { h, Component } from 'preact';
import ScoreColors from '../../../../constants/ScoreColors';
import style from './style/scorebar.scss';

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
 *     score={4}
 *     count={5}
 * </ScoreBar>
 */
export default class ScoreBar extends Component {

    render() {
        const { count } = this.props;
        const score = Math.floor(this.props.score);
        const elements = [];

        if (score < 0 || !count) {
            return null;
        }

        const activeStyle = {
            fill: ScoreColors[score] || ''
        };

        // build the svg item list
        for (let i = 0; i < count; i++) {
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
                <svg version="1.0" x="0px" y="0px" viewBox="0 0 516 140">
                    <g>
                        { elements }
                    </g>
                </svg>
            </section>
        );
    }
}
