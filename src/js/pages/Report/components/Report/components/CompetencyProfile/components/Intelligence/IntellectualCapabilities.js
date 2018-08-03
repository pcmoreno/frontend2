import { h, Component } from 'preact';
import style from './style/intellectualcapabilities.scss';
import StaticScore from '../../../StaticScore/StaticScore';
import ScoreWidgetType from '../../../../../../constants/ScoreWidgetType';
import StaticScoreValue from '../../../../../../constants/StaticScoreValue';

/** @jsx h */

export default class IntellectualCapabilities extends Component {

    render() {
        const { i18n, score, educationLevel } = this.props;
        const educationLevelTranslation = `report_tested_level_${educationLevel}`;
        let description = i18n.report_intellectual_capabilities_default_text_paragraph_1;

        // append a paragraph with the tested level to the description
        description += `<p>${i18n.report_tested_level} ${i18n[educationLevelTranslation] || ''}</p>`;

        return (
            <div className={ style.intelligence }>
                <StaticScore
                    score={ score }
                    min={ StaticScoreValue.MIN_VALUE }
                    max={ StaticScoreValue.MAX_VALUE }
                    title={ i18n.report_intellectual_capabilities }
                    scoreWidgetType={ ScoreWidgetType.SCORE_BAR }
                    htmlDescription={ description }
                />
            </div>
        );
    }
}
