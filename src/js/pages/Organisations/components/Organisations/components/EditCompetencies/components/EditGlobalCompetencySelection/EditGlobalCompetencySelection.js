import { h, Component } from 'preact';
import Listview from '../../../../../../../../components/Listview';
import style from './../../style/editcompetencies.scss';

/** @jsx h */

export default class EditGlobalCompetencySelection extends Component {
    render() {
        const { i18n, projectSlug } = this.props;

        // rebuild the global competencies list
        const globalCompetencies = [];

        this.props.availableCompetencies.forEach(competency => {
            competency.forEach(prop => {

                // only add global competencies
                if (prop.type === 'competency_type' && prop.competencyType === 'global') {
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
                            selectedEntities={ this.props.locallySelectedCompetencies }
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
                        className="action_button action_button__secondary"
                        type="button"
                        value="Close"
                        onClick={ () => {
                            this.props.closeModalToEditCompetencies();
                        } }
                    >{ i18n.organisations_close }</button>
                    <button
                        className="action_button"
                        type="button" value="Submit"
                        onClick={ () => {
                            this.props.updateCompetencySelection(projectSlug);
                        } }>{ i18n.organisations_select }</button>
                </footer>
            </div>
        );
    }
}
