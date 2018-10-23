import { h, Component } from 'preact';
import Competency from './components/Competency/Competency';
import style from './style/competencies.scss';
import Utils from 'neon-frontend-utils/src/utils';
import CompetencyProperty from '../../../../../../constants/CompetencyProperty';

/** @jsx h */

const TRANSLATION_KEY_PREFIX = 'competencies_';

export default class Competencies extends Component {
    render() {
        const competenciesList = [];

        // clone, translate and sort the competencies. This does not change output values, only the order of the array
        // because the translate method will set a new field (translated_name) to store the translated value
        // instead of overwriting the original value
        const competenciesClone = this.props.competencies.slice(0);
        const translatedCompetencies = Utils.translateFieldInArray(
            competenciesClone,
            CompetencyProperty.NAME,
            CompetencyProperty.TRANSLATED_NAME,
            CompetencyProperty.TRANSLATION_KEY,
            this.props.i18n,
            TRANSLATION_KEY_PREFIX
        );
        const sortedCompetencies = Utils.alphabeticallySortFieldInArray(translatedCompetencies, CompetencyProperty.TRANSLATED_NAME);

        sortedCompetencies.forEach(competency => {
            competenciesList.push(<Competency
                name={ competency.name }
                definition={ competency.definition }
                score={ competency.score }
                languageId={ this.props.languageId }
                i18n={ this.props.i18n }
                translationKey={ competency.translationKey }
            />);
        });

        if (competenciesList.length === 0) {
            return null;
        }
        return (
            <ul className={ style.competencies }>
                { competenciesList }
            </ul>
        );
    }
}
