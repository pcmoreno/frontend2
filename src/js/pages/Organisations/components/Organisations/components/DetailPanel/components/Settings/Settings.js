import { h, Component } from 'preact';
import Listview from '../../../../../../../../components/Listview/index';
import style from './style/settings.scss';

/** @jsx h */

export default class Settings extends Component {
    render() {
        const { openModalToEditCompetencies } = this.props;

        // todo: extract from the path or something better. perhaps detail panel can always be populated with parent
        // todo: slug? perhaps after the migration from id to slug has been completed.

        const organisationSlug = this.props.pathNodes[1].uuid;

        return (
            <div>
                <div className={ style.toolbar }>
                    <button
                        onClick={ () => {
                            openModalToEditCompetencies(organisationSlug);
                        } }
                        className={ 'action_button left' }
                        type={ 'button' }
                    >Edit competences</button>
                </div>
                <div className={ style.listView }>
                    <Listview
                        entities={ this.props.selectedCompetencies }
                        i18n={ this.props.i18n }
                        defaultSortingKey={ 'competency_name' }
                        defaultSortingOrder={ 'asc' }
                        translationKeyPrefix={ 'competencies_' }
                    />
                </div>
            </div>
        );
    }
}
