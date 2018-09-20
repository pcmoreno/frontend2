import { h, Component } from 'preact';
import Listview from '../../../../../../../../components/Listview';
import style from './../../style/editcompetencies.scss';
import CompetencyTab from '../../../../../../constants/CompetencyTab';

/** @jsx h */

export default class EditGlobalCompetencySelection extends Component {
    render() {
        const {
            i18n,
            projectSlug,
            availableGlobalCompetenciesListView,
            locallySelectedCompetencies,
            closeModalToEditCompetencies,
            updateCompetencySelection
        } = this.props;

        let message = i18n.organisations_competencies_modal_loading;

        if (availableGlobalCompetenciesListView !== null) {
            message = i18n.organisations_competencies_modal_no_results;
        }

        return (
            <div id={ CompetencyTab.EDIT_GLOBAL_COMPETENCY_SELECTION } className={ `${style.editcompetencies} hidden` }>
                <main>
                    { availableGlobalCompetenciesListView !== null && availableGlobalCompetenciesListView.length > 0
                        ? <Listview
                            entities={ availableGlobalCompetenciesListView }
                            selectedEntities={ locallySelectedCompetencies }
                            defaultSortingKey={ 'competency_name' }
                            defaultSortingOrder={ 'asc' }
                            i18n={ i18n }
                            translationKeyPrefix={ 'competencies_' }
                        />
                        : message
                    }
                </main>
                <footer>
                    <button
                        className="action_button action_button__secondary"
                        type="button"
                        onClick={ () => {
                            closeModalToEditCompetencies();
                        } }
                    >{ i18n.organisations_cancel }</button>
                    <button
                        className="action_button"
                        type="button"
                        onClick={ () => {
                            updateCompetencySelection(projectSlug);
                        } }
                    >{ i18n.organisations_select }</button>
                </footer>
            </div>
        );
    }
}
