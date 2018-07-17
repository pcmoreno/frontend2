import { h, Component } from 'preact';
import Listview from '../../../../../../../../components/Listview';
import style from './../../style/editcompetencies.scss';

/** @jsx h */

export default class EditCustomCompetencies extends Component {
    constructor(props) {
        super(props);

        // keep track of competencies in localState to aid the selecting/deselecting
        this.localState = {
            customCompetencies: [],
            selectedCompetencies: []
        };

        this.setState(this.localState);
    }

    componentWillUpdate() {

        // ensures locally used vars are cleared on each update (also when reducer is cleared for reset_competencies action)
        if (this.localState.customCompetencies !== [] || this.localState.selectedEntities !== []) {
            this.localState.customCompetencies = [];
            this.localState.selectedEntities = [];
            this.setState(this.localState);
        }
    }

    render() {
        const { i18n } = this.props;

        // construct a lookup array with the selected competencies (just the id's will do)
        if (this.props.selectedCompetencies.length > 0) {
            this.props.selectedCompetencies.forEach(selectedCompetency => {
                selectedCompetency.forEach(prop => {

                    // only the id prop is required to check for selected competencies
                    if (prop.key === 'id') {
                        this.localState.selectedEntities.push(prop.value);
                    }
                });
            });
        }

        if (this.props.availableCompetencies.length > 0) {
            this.props.availableCompetencies.forEach(competency => {
                competency.forEach(prop => {

                    // only add global competencies
                    if (prop.type === 'competency_type' && prop.competencyType === 'global') {
                        this.localState.customCompetencies.push(competency);
                    }
                });
            });
        }

        return (
            <div id="organisations_edit_custom_competencies" className={ `${style.editcompetencies} hidden` }>
                <main>
                    { this.localState.customCompetencies.length > 0
                        ? <Listview
                            entities={ this.localState.customCompetencies }
                            selectedEntities={ this.localState.selectedEntities }
                            defaultSortingKey={ 'competency_name' }
                            defaultSortingOrder={ 'desc' }
                            i18n={ i18n }
                            translationKeyPrefix={ 'competencies_' }
                        />
                        : i18n.organisations_competencies_modal_loading
                    }
                </main>
                <footer>
                    <button
                        class="action_button action_button__secondary"
                        type="button"
                        value="Close"
                        onClick={ () => {
                            this.props.closeModalToEditCompetencies();
                        } }
                    >{ i18n.organisations_close }</button>
                    <button
                        class="action_button"
                        type="button" value="Submit"
                        onClick={ () => {
                            this.props.updateCompetencies(i18n.organisations_add_custom_competency_success);
                        } }>{ i18n.organisations_select }</button>
                </footer>
            </div>
        );
    }
}
