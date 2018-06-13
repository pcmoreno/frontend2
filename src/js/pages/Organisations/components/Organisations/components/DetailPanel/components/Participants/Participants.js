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

        // POST http://dev.ltponline.com:8000/app_dev.php/api/v1/participant/invite?invite_participant_form[participants][0]=6b5624cc-0289-43fb-b260-6732ceaac783&invite_participant_form[participants][1]=ad90de92-a2cb-47d4-bf9b-d329fe21b9a8&invite_participant_form[participants][2]=432ade3d-7733-4b3f-a991-7ad1e85ae89a&invite_participant_form[participants][3]=e64a3882-1696-46fc-a23d-5cdd17ab47b6

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
                        onClick={ this.props.openModalToInviteParticipant }
                        className="action_button left"
                        type="button"
                    >
                        { i18n.organisations_invite }
                    </button>
                </div>
                <div>
                    <Listview
                        entities={ participants }
                        selectedEntities = { this.props.selectedParticipants }
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
