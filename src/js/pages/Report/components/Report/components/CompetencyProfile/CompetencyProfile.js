import { h, Component } from 'preact';
import style from './style/competencyprofile.scss';
import Competencies from './components/Competencies/Competencies';
import IntellectualCapabilities from './components/Intelligence/IntellectualCapabilities';
import PowerToChange from './components/PowerToChange/PowerToChange';

/** @jsx h */

export default class CompetencyProfile extends Component {

    render() {
        const { i18n, staticScores, educationLevel } = this.props;

        if (!staticScores) {
            return null;
        }

        const intellectualCapabilityScore = staticScores.intelligenceScore;

        return (
            <section className={ style.competencyProfile }>
                <h2>{ i18n.report_competency_profile }</h2>

                { /* todo: add the competency widgets, from within the child widget, check the data, and do not render if unavailable */ }
                <Competencies/>

                <IntellectualCapabilities
                    slug={ intellectualCapabilityScore.slug }
                    templateSlug={ intellectualCapabilityScore.textFieldTemplateSlug }
                    score={ intellectualCapabilityScore.value }
                    educationLevel={ educationLevel }
                    i18n={ i18n }
                />

                <PowerToChange/>

            </section>
        );
    }
}
