import { h, Component } from 'preact';
import { ScoreFanColor } from '../../../../constants/ScoreColors';
import style from './style/scorefan.scss';
import Utils from 'neon-frontend-utils/src/utils';

/** @jsx h */

/**
 * Score fan widget
 * Only supports a score count of 5!
 *
 * @example
 * <ScoreFan>
 *     score={4}
 *     min={1}
 *     max={5}
 *     leftText={''}
 *     rightText={''}
 * </ScoreFan>
 */
export default class ScoreFan extends Component {
    render() {
        const { min, max, leftText, rightText } = this.props;
        let { score } = this.props;
        let rotation = null;
        let scoreSegment = null;

        score = Utils.parseScore(score, min, max, true);

        const activeStyle = {
            fill: ScoreFanColor
        };

        switch (score) {
            case 1:
                rotation = -60;
                break;
            case 2:
                rotation = -30;
                break;
            case 3:
                rotation = 0;
                break;
            case 4:
                rotation = 30;
                break;
            case 5:
                rotation = 60;
                break;
            default: break;
        }

        if (score && rotation !== null) {
            scoreSegment =
                <g>
                    <path style={ activeStyle }
                        d="M355.3,176.1c-11.5-2.9-23.4-4.4-35.3-4.4s-23.8,1.5-35.3,4.4l-3.9,1L240.9,28.3l1.9-0.5c25.1-6.7,51-10.1,77.1-10.1s52.1,3.4,77.1,10.1l1.9,0.5l-39.9,148.8L355.3,176.1z"
                        transform={`rotate(${rotation},320,315)`}
                    />
                </g>;
        }

        return (
            <section>
                <div className={ style.scoreFanWrapper }>
                    <div className={ style.scoreFanContainer }>
                        <svg version="1.0" x="0px" y="0px" width="320px" viewBox="0 0 640 300">
                            <g>
                                <path d="M320,171.7c11.9,0,23.8,1.5,35.3,4.4l32.9-122.7c-22.2-5.8-45.1-8.7-68.2-8.7s-46,2.9-68.2,8.7l32.9,122.7C296.2,173.2,308.1,171.7,320,171.7z"/>
                                <path d="M129.8,122.6l89.8,89.8c8.5-8.3,18.1-15.5,28.4-21.5c10.3-6,21.4-10.6,32.8-13.9L247.9,54.4c-22.1,6.1-43.4,15.1-63.4,26.6C164.5,92.5,146.1,106.5,129.8,122.6z"/>
                                <path d="M58.7,243.6l122.7,32.9c3.2-11.4,7.9-22.5,13.9-32.8c6-10.3,13.2-19.9,21.5-28.4l-89.8-89.8c-16.1,16.4-30.1,34.8-41.6,54.7C73.8,200.2,64.8,221.5,58.7,243.6z"/>
                                <path d="M359.2,177.1c11.4,3.2,22.5,7.9,32.8,13.9c10.3,6,19.9,13.2,28.4,21.5l89.8-89.8c-16.4-16.1-34.8-30.1-54.7-41.6c-20-11.5-41.3-20.5-63.4-26.6L359.2,177.1z"/>
                                <path d="M423.2,215.3c8.3,8.5,15.5,18.1,21.5,28.4c6,10.3,10.6,21.4,13.9,32.8l122.7-32.9c-6.1-22.1-15.1-43.4-26.6-63.4c-11.5-20-25.5-38.4-41.6-54.7L423.2,215.3z"/>
                            </g>
                            { scoreSegment }
                        </svg>
                        <div>
                            <span className={ style.leftText }>{ leftText }</span>
                            <span className={ style.rightText }>{ rightText }</span>
                        </div>
                    </div>
                </div>
                <h1 className={ style.score }>
                    { score > 0 ? score : '' }
                </h1>
            </section>
        );
    }
}
