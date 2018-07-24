import { h, Component } from 'preact';
import Listview from '../../../../../../../../components/Listview';
import style from './../../style/editcompetencies.scss';

/** @jsx h */

export default class EditCustomCompetencies extends Component {
    render() {
        const { i18n, projectSlug } = this.props;

        // rebuild the custom competencies list
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
                    { customCompetencies.length > 0
                        ? <Listview
                            entities={ customCompetencies }
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
