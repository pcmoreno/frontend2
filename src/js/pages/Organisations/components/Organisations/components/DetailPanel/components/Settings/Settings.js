import { h, Component } from 'preact';
import Listview from '../../../../../../../../components/Listview/index';
import style from './style/settings.scss';

/** @jsx h */

export default class Settings extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { i18n, openModalToEditCompetencies } = this.props;

        return (
            <div>
                <div className={ style.toolbar }>
                    <button
                        onClick={ () => {
                            openModalToEditCompetencies('a', 'b');
                        } }
                        className={ 'action_button left' }
                        type={ 'button' }
                    >Edit competences</button>
                </div>
                <div className={ style.listView }>
                    <Listview
                        entities={ this.props.selectedCompetencies }
                        i18n={ i18n }
                        defaultSortingKey={ 'name' }
                        defaultSortingOrder={ 'asc' }
                    />
                </div>
            </div>
        );
    }
}
