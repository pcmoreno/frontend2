import { h, Component } from 'preact';
import style from './style/intellectualcapabilities.scss';
import ScoreBar from '../../../ScoreBar/ScoreBar';
import StaticScore from '../../../StaticScore/StaticScore';
import ScoreWidgetType from '../../../../../../constants/ScoreWidgetType';

/** @jsx h */

const intelligenceScoreCount = 5;

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
                    scoreCount={ intelligenceScoreCount }
                    title={ i18n.report_intellectual_capabilities }
                    scoreWidgetType={ ScoreWidgetType.SCORE_BAR }
                    htmlDescription={ description }
                />
            </div>
        );
    }
}
