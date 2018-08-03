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

        // at minimum the scores are required */
        if (!scores) {
            return null;
        }

        const sections = [
            'IntellectualCapabilities',
            'Personality',
            'WorkingStyles',
            'Motives',
            'InfluencingStyles'
        ];

        sections.forEach(section => {

            const sectionScores = HnaCategories[section];

            scoreCollection.push(<h4>{ i18n[`report_${[Utils.camelCaseToSnakeCase(section)]}`] }</h4>);

            Object.keys(sectionScores).forEach(score => {
                const key = sectionScores[score];

                scoreCollection.push(
                    <ParticipantScoreRow
                        label={`report_${score.toLowerCase()}`}
                        score={parseFloat(scores[key]).toFixed(2) || ''}
                        categoryScore={hnaCategoryScores[key] || ''}
                        i18n={i18n}
                    />
                );
            });

        });

        return (
            <div className={ style.sidebarParticipant }>
                { scoreCollection }
            </div>
        );
    }
}
