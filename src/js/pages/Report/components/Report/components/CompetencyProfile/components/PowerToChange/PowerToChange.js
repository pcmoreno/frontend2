import { h, Component } from 'preact';
import style from './style/powertochange.scss';
import StaticScore from '../../../StaticScore/StaticScore';
import ScoreWidgetType from '../../../../../../constants/ScoreWidgetType';

/** @jsx h */

const intelligenceScoreCount = 5;

export default class PowerToChange extends Component {

    render() {
        const { i18n, score } = this.props;
        let description = i18n.report_power_to_change_default_text_paragraph_1;

        return (
            <div className={ style.powerToChange }>
                <StaticScore
                    score={ score }
                    scoreCount={ intelligenceScoreCount }
                    title={ i18n.report_power_to_change }
                    scoreWidgetType={ ScoreWidgetType.SCORE_FAN }
                    htmlDescription={ description }
                    leftText={ i18n.report_power_to_change_below_average }
                    rightText={ i18n.report_power_to_change_above_average }
                />
            </div>
        );
    }
}
