import { h, Component } from 'preact';
import style from './style/participant.scss';
import HnaCategories from '../../../../../../constants/HnaCategories';
import ParticipantScoreRow from './components/ParticipantScoreRow/ParticipantScoreRow';
import Utils from '../../../../../../utils/utils';

/** @jsx h */

export default class SidebarParticipant extends Component {
    render() {
        const { scores, hnaCategoryScores = [], i18n } = this.props;
        const scoreCollection = [];

        /* at minimum the scores are required */
        if (!scores) {
            return null;
        }

        /* loop through the categories and each key within, to build up a row of label, score, categoryScore */
        Object.keys(HnaCategories).forEach(section => {
            const sectionScores = HnaCategories[section];

            scoreCollection.push(<h4>{ i18n[`report_${[Utils.camelCaseToSnakeCase(section)]}`] || section }</h4>);

            Object.keys(sectionScores).forEach(score => {
                const key = sectionScores[score];
                let scoreNumber = parseFloat(scores[key]).toFixed(2);

                // when the score is ZIJN or WILLEN dont fix to two decimals
                if (HnaCategories.ToBe.hasOwnProperty(score) ||
                    HnaCategories.ToWant.hasOwnProperty(score) ||
                    HnaCategories.Fit.hasOwnProperty(score)) {
                    scoreNumber = scores[key];
                }

                // only if value is valid number, output this row
                if (!isNaN(scoreNumber)) {
                    scoreCollection.push(
                        <ParticipantScoreRow
                            label={ i18n[`report_${score.toLowerCase()}`] || score }
                            score={ scoreNumber }
                            categoryScore={ hnaCategoryScores[key] || '' }
                        />
                    );
                }
            });
        });

        return (
            <div className={ style.sidebarParticipant }>
                { scoreCollection }
            </div>
        );
    }
}
