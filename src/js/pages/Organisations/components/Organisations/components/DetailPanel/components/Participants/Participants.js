import { h, Component } from 'preact';
import Listview from '../../../../../../../../components/Listview/index';
import style from './style/participants.scss';

/** @jsx h */

export default class Participants extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            i18n,
            participants,
            openModalToAddParticipant,
            selectedParticipants,
            toggleSelectAllParticipants,
            openModalToInviteParticipant
        } = this.props;

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
                    <button
                        onClick={ openModalToInviteParticipant }
                        className={`action_button left ${selectedParticipants.length === 0 ? 'disabled' : ''}`}
                        type="button"
                        disabled={ selectedParticipants.length === 0 }
                    >
                        { i18n.organisations_invite }
                    </button>
                </div>
                <div>
                    <Listview
                        entities={ participants }
                        selectedEntities={ selectedParticipants }
                        toggleSelectAll={ toggleSelectAllParticipants }
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
