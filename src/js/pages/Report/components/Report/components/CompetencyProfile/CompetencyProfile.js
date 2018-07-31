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

        return (
            <section className={ style.competencyProfile }>
                <h2>{ i18n.report_competency_profile }</h2>

                <Competencies
                    competencies={ competencies }
                    languageId={ languageId }
                    i18n={ i18n }
                />

                { intellectualCapabilityScore && <IntellectualCapabilities
                    slug={ intellectualCapabilityScore.slug }
                    templateSlug={ intellectualCapabilityScore.textFieldTemplateSlug }
                    score={ intellectualCapabilityScore.value }
                    educationLevel={ educationLevel }
                    i18n={ i18n }
                />}

                <PowerToChange/>

            </section>
        );
    }
}
