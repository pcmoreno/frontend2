import { h, Component } from 'preact';
import Competency from './components/Competency/Competency';
import style from './style/competencies.scss';

/** @jsx h */

export default class Competencies extends Component {
    render() {
        const competencies = [];

        this.props.competencies.forEach(competency => {
            competencies.push(<Competency
                name={ competency.name }
                definition={ competency.definition }
                score={ competency.score }
                languageId={ this.props.languageId }
                i18n={ this.props.i18n }
                translationKey={ competency.translationKey }
            />);
        });

        if (competencies.length === 0) {
            return null;
        }
        return (
            <ul className={ style.competencies }>
                { competencies }
            </ul>
        );
    }
}
