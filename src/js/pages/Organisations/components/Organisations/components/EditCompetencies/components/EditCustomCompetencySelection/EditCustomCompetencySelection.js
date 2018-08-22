import { h, Component } from 'preact';
import Listview from '../../../../../../../../components/Listview';
import CompetencyType from './../../../../../../constants/CompetencyType';
import CompetencyPropType from './../../../../../../constants/CompetencyPropType';
import style from './../../style/editcompetencies.scss';
import ListItemTypes from '../../../../../../../../components/Listview/constants/ListItemTypes';
import CompetencyTab from '../../../../../../constants/CompetencyTab';

/** @jsx h */

export default class EditCustomCompetencySelection extends Component {
    render() {
        const {
            i18n,
            projectSlug,
            availableCompetenciesListView,
            locallySelectedCompetencies,
            closeModalToEditCompetencies,
            updateCompetencySelection
        } = this.props;

        // rebuild the custom competencies list
        const customCompetencies = [];

        availableCompetenciesListView.forEach(competency => {
            competency.forEach(prop => {

                // only add custom competencies
                if (prop.type === CompetencyPropType.COMPETENCYTYPE && prop.competencyType === CompetencyType.CUSTOM) {

                    // todo: find a better way to separate list content and/or hiding certain columns
                    // remove the ltp/custom column
                    const compRow = competency.slice(0, competency.length - 1);

                    compRow.push({
                        key: 'amendParticipantLabel',
                        type: ListItemTypes.PENCIL,
                    });

                    customCompetencies.push(compRow);
                }
            });
        });

        // todo: we need a better solution for forms/modals to show a loading indicator rather than a label
        // todo: as no data might be allowed, like in this modal
        return (
            <div id={ CompetencyTab.EDIT_CUSTOM_COMPETENCY_SELECTION } className={ `${style.editcompetencies} hidden` }>
                <main>
                    { customCompetencies.length > 0 &&
                        <Listview
                            entities={ customCompetencies }
                            selectedEntities={ locallySelectedCompetencies }
                            defaultSortingKey={ 'competency_name' }
                            defaultSortingOrder={ 'asc' }
                            i18n={ i18n }
                            translationKeyPrefix={ 'competencies_' }
                        />
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
