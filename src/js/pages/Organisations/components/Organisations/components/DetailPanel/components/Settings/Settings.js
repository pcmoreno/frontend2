import { h, Component } from 'preact';
import Listview from '../../../../../../../../components/Listview/index';
import style from './style/settings.scss';

/** @jsx h */

export default class Settings extends Component {
    render() {
        const { openModalToEditCompetencies, entity, i18n, selectedCompetenciesListView } = this.props;

        return (
            <div>
                <div className={ style.toolbar }>
                    <button
                        onClick={ () => {
                            openModalToEditCompetencies(entity.uuid);
                        } }
                        className={ 'action_button left' }
                        type={ 'button' }
                    >{ selectedCompetenciesListView.length > 0 ? i18n.organisations_edit_competencies : i18n.organisations_add_competencies }</button>
                </div>
                <div className={ style.listView }>
                    <Listview
                        entities={selectedCompetenciesListView}
                        i18n={i18n}
                        defaultSortingKey={'competency_name'}
                        defaultSortingOrder={'asc'}
                        translationKeyPrefix={'competencies_'}
                    />
                </div>
            </div>
        );
    }
}
