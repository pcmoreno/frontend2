import { h, Component } from 'preact';
import Listview from '../../../../../../../../components/Listview';
import CompetencyType from './../../../../../../constants/CompetencyType';
import CompetencyPropType from './../../../../../../constants/CompetencyPropType';
import style from './../../style/editcompetencies.scss';

/** @jsx h */

export default class EditCustomCompetencySelection extends Component {
    render() {
        const {
            i18n,
            projectSlug,
            availableCompetencies,
            locallySelectedCompetencies,
            closeModalToEditCompetencies,
            updateCompetencySelection
        } = this.props;

        // rebuild the custom competencies list
        const customCompetencies = [];

        availableCompetencies.forEach(competency => {
            competency.forEach(prop => {

                // only add custom competencies
                if (prop.type === CompetencyPropType.COMPETENCYTYPE && prop.competencyType === CompetencyType.CUSTOM) {
                    customCompetencies.push(competency);
                }
            });
        });

        return (
            <div id="organisations_edit_custom_competency_selection" className={ `${style.editcompetencies} hidden` }>
                <main>
                    { customCompetencies.length > 0
                        ? <Listview
                            entities={ customCompetencies }
                            selectedEntities={ locallySelectedCompetencies }
                            defaultSortingKey={ 'competency_name' }
                            defaultSortingOrder={ 'asc' }
                            i18n={ i18n }
                            translationKeyPrefix={ 'competencies_' }
                        />
                        : i18n.organisations_competencies_modal_loading
                    }
                </main>
                <footer>
                    <button
                        className="action_button action_button__secondary"
                        type="button"
                        value="Close"
                        onClick={ () => {
                            closeModalToEditCompetencies();
                        } }
                    >{ i18n.organisations_cancel }</button>
                    <button
                        className="action_button"
                        type="button" value="Submit"
                        onClick={ () => {
                            updateCompetencySelection(projectSlug);
                        } }>{ i18n.organisations_select }</button>
                </footer>
            </div>
        );
    }
}
