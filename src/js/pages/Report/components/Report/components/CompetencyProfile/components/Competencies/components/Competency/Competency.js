import { h, Component } from 'preact';
import Hypher from 'hypher';
import ScoreBar from '../../../../../ScoreBar/ScoreBar';
import hyphenatePattern from '../../../../../../../../../../utils/hyphenatePattern';
import style from './style/competency.scss';

/** @jsx h */

// how many bars should the scorebar have
const max = 5;
const min = 1;

export default class Competency extends Component {
    constructor(props) {
        super(props);

        this.localState = {
            competencyName: this.props.name,
            competencyDefinition: this.props.definition
        };

        this.hypher = false;
        this.languageId = this.props.languageId;


    }

    hyphenateText(val) {
        return val.split(' ').map(value => this.hypher.hyphenate(value).join('&shy;')).join(' ');
    }

    initHypher() {

        // load the right hyphenation pattern for the current language and start the hyphenation process
        hyphenatePattern(this.languageId).then(result => {

            // instantiate new Hypher object
            this.hypher = new Hypher(result);

            // apply the hyphenations
            this.applyHyphenations();
        });
    }

    applyHyphenations() {
        let name = this.props.name;
        let definition = this.props.definition;

        if (this.props.translationKey) {
            name = this.props.i18n[this.props.translationKey] || this.props.name;
            definition = this.props.i18n[`${this.props.translationKey}_definition`] || this.props.definition;
        }

        // update local state so component re-renders
        this.localState.competencyName = this.hyphenateText(name);
        this.localState.competencyDefinition = this.hyphenateText(definition);
        this.setState(this.localState);
    }

    componentDidMount() {
        this.initHypher();
    }

    componentDidUpdate() {

        // when the languageId changes, ensure the new pattern is loaded and hyphenation is re-initiated
        if (this.props.languageId !== this.languageId) {
            this.languageId = this.props.languageId;
            this.initHypher();
        }
    }

    render() {

        // to prevent jumping of texts, do not render until Hypher is done loading patterns and transforming the text
        if (!this.hypher) {
            return null;
        }

        return (
            <li className={ style.competency }>
                <header>
                    <div className={ style.title_container }>
                        <h2 dangerouslySetInnerHTML={ { __html: this.localState.competencyName } } />
                    </div>
                    <ScoreBar score={ this.props.score } max={ max } min={ min }/>
                </header>
                <article>
                    <p dangerouslySetInnerHTML={ { __html: this.localState.competencyDefinition } } />
                </article>
            </li>
        );
    }
}
