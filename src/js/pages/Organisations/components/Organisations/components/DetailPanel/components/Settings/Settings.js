import { h, Component } from 'preact';
import Listview from '../../../../../../../../components/Listview/index';
import style from './style/settings.scss';

/** @jsx h */

export default class Settings extends Component {
    render() {
        const { openModalToEditCompetencies, entity, i18n, selectedCompetencies } = this.props;

        return (
            <div>
                <div className={ style.toolbar }>
                    <button
                        onClick={ () => {
                            openModalToEditCompetencies(entity.uuid);
                        } }
                        className={ 'action_button left' }
                        type={ 'button' }
                    >Edit competences</button>
                </div>
                <div className={ style.listView }>
                    <Listview
                        entities={selectedCompetencies}
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
