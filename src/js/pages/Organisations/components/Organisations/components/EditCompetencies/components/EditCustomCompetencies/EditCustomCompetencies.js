import { h, Component } from 'preact';
import Listview from '../../../../../../../../components/Listview';
import style from './../../style/editcompetencies.scss';

/** @jsx h */

export default class EditCustomCompetencies extends Component {
    render() {
        const { i18n } = this.props;

        // first construct a lookup array with the selected competencies (just the id's will do)
        const selectedEntities = [];

        this.props.selectedCompetencies.forEach(selectedCompetency => {
            selectedCompetency.forEach(prop => {
                if (prop.key === 'id') {
                    selectedEntities.push(prop.value);
                }
            });
        });

        // todo: you'll probably want to move some of this logic to a localState property to be able to do the selecting/deselecting

        const customCompetencies = [];

        this.props.availableCompetencies.forEach(competency => {
            competency.forEach(prop => {

                // only add custom competencies
                if (prop.type === 'competency_type' && prop.competencyType === 'custom') {
                    customCompetencies.push(competency);
                }
            });
        });

        return (
            <div id="organisations_edit_custom_competencies" className={ `${style.editcompetencies} hidden` }>
                <main>
                    <Listview
                        entities={ customCompetencies }
                        defaultSortingKey={ 'competency_name' }
                        defaultSortingOrder={ 'desc' }
                        selectedEntities={ selectedEntities }
                        i18n={ i18n }
                        translationKeyPrefix={ 'competencies_' }
                    />
                </main>
                <footer>
                    <button
                        class="action_button action_button__secondary"
                        type="button"
                        value="Close"
                        onClick={ this.props.closeModal }
                    >{ i18n.organisations_close }</button>
                    <button class="action_button" type="button" value="Submit">
                        { i18n.organisations_select }
                    </button>
                </footer>
            </div>
        );
    }
}
