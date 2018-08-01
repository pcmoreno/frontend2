import { h, Component } from 'preact';
import style from './style/staticscore.scss';
import ScoreBar from '../ScoreBar/ScoreBar';
import ScoreWidgetType from '../../../../constants/ScoreWidgetType';
import ScoreFan from '../ScoreFan/ScoreFan';

/** @jsx h */

export default class StaticScore extends Component {

    render() {
        const { score, scoreCount, title, scoreWidgetType, htmlDescription, leftText, rightText } = this.props;
        let scoreWidget = null;

        switch (scoreWidgetType) {
            case ScoreWidgetType.SCORE_BAR:
                scoreWidget = <ScoreBar
                    score={ score }
                    count={ scoreCount }
                />;
                break;
            case ScoreWidgetType.SCORE_FAN:
                scoreWidget = <ScoreFan
                    score={ score }
                    count={ scoreCount }
                    leftText={ leftText }
                    rightText={ rightText }
                />;
                break;
            default:
                break;
        }

        return (
            <div className={ style.staticScore }>
                <h3>{ title }</h3>
                <section className={ style.scoreContainer }>
                    { scoreWidget }
                </section>
                <section className={ style.textContainer }>
                    <div
                        dangerouslySetInnerHTML={{ __html: htmlDescription }}
                    />
                </section>
            </div>
        );
    }
}
