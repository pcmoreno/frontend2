import { h, Component } from 'preact';
import style from './style/competencyprofile.scss';
import Competencies from './components/Competencies/Competencies';
import IntellectualCapabilities from './components/Intelligence/IntellectualCapabilities';
import PowerToChange from './components/PowerToChange/PowerToChange';

/** @jsx h */

export default class CompetencyProfile extends Component {

    render() {
        const { i18n, staticScores, educationLevel, competencies, languageId } = this.props;

        const intellectualCapabilityScore = staticScores && staticScores.intelligenceScore;
        const powerToChangeScore = staticScores && staticScores.powerToChangeScore;

        return (
            <section className={ style.competencyProfile }>
                <h2>{ i18n.report_competency_profile }</h2>

                <Competencies
                    competencies={ competencies }
                    languageId={ languageId }
                    i18n={ i18n }
                />

                { intellectualCapabilityScore && <IntellectualCapabilities
                    score={ intellectualCapabilityScore.value }
                    educationLevel={ educationLevel }
                    i18n={ i18n }
                />}

                { powerToChangeScore && <PowerToChange
                    score={ powerToChangeScore.value }
                    i18n={ i18n }
                />}

            </section>
        );
    }
}
