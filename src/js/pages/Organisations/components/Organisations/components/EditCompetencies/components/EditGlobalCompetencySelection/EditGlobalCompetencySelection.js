import { h, Component } from 'preact';
import Listview from '../../../../../../../../components/Listview';
import CompetencyType from './../../../../../../constants/CompetencyType';
import style from './../../style/editcompetencies.scss';
import CompetencyPropType from '../../../../../../constants/CompetencyPropType';

/** @jsx h */

export default class EditGlobalCompetencySelection extends Component {
    render() {
        const {
            i18n,
            projectSlug,
            availableCompetencies,
            locallySelectedCompetencies,
            closeModalToEditCompetencies,
            updateCompetencySelection
        } = this.props;

        // rebuild the global competencies list
        const globalCompetencies = [];

        availableCompetencies.forEach(competency => {
            competency.forEach(prop => {

                // only add global competencies
                if (prop.type === CompetencyPropType.COMPETENCYTYPE && prop.competencyType === CompetencyType.GLOBAL) {
                    globalCompetencies.push(competency);
                }
            });
        });

        return (
            <div id="organisations_edit_global_competency_selection" className={ `${style.editcompetencies} hidden` }>
                <main>
                    { globalCompetencies.length > 0
                        ? <Listview
                            entities={ globalCompetencies }
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
                    >{ i18n.organisations_close }</button>
                    <button
                        className="action_button"
                        type="button"
                        value="Submit"
                        onClick={ () => {
                            updateCompetencySelection(projectSlug);
                        } }>{ i18n.organisations_select }</button>
                </footer>
            </div>
        );
    }
}
