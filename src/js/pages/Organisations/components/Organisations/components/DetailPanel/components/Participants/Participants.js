import { h, Component } from 'preact';
import Listview from '../../../../../../../../components/Listview/index';
import style from './style/participants.scss';

/** @jsx h */

export default class Participants extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { i18n, participants, openModalToAddParticipant } = this.props;

        return (
            <div>
                <div className={ style.toolbar }>
                    <button
                        onClick={ openModalToAddParticipant }
                        className={ 'action_button left' }
                        type={ 'button' }
                    >
                        { i18n.organisations_add_participant }
                    </button>
                </div>
                <div>
                    <Listview
                        entities={ participants }
                        i18n={ i18n }
                        defaultSortingKey={ 'name' }
                        defaultSortingOrder={ 'asc' }
                        translationKey={ 'organisations_' }
                    />
                </div>
            </div>
        );
    }
}
