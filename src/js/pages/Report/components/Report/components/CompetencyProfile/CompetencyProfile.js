import { h, Component } from 'preact';
import style from './style/competencyprofile.scss';
import Competencies from './components/Competencies/Competencies';
import Intelligence from './components/Intelligence/Intelligence';
import PowerToChange from './components/PowerToChange/PowerToChange';

/** @jsx h */

export default class CompetencyProfile extends Component {

    render() {
        const { i18n, competencies, languageId } = this.props;

        // todo: we must check here if some of the required data is available, if nothing: do not render this component

        return (
            <section className={ style.competencyProfile }>
                <h2>{ i18n.report_competency_profile }</h2>

                { /* todo: add the competency widgets, from within the child widget, check the data, and do not render if unavailable */ }
                <Competencies
                    competencies={ competencies }
                    languageId={ languageId }
                    i18n={ this.props.i18n }
                />

                { /* todo: add the IQ and Power to Change widgets, from within the child widget, check the data, and do not render if unavailable */ }
                <Intelligence/>

                <PowerToChange/>

            </section>
        );
    }
}
