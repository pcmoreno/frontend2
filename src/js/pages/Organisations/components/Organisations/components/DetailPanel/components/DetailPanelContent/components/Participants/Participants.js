import { h, Component } from 'preact';
import Listview from '../../../../../../../../../../components/Listview';

/** @jsx h */

import style from './style/participants.scss';

export default class Participants extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { i18n, participants } = this.props;

        return (
            <div className={ style.wrapper }>
                {/*<div className="toolbar">*/}
                    {/*<button*/}
                        {/*onClick={ this.props.openModalToAddParticipant }*/}
                        {/*className="action_button left"*/}
                        {/*type="button"*/}
                    {/*>*/}
                        {/*{ i18n.organisations_add_participant }*/}
                    {/*</button>*/}
                {/*</div>*/}
                <div className= { style.scrollable_select_list }>
                    <Listview
                        entities={ participants }
                        i18n={ i18n }
                        defaultSortingKey={ 'firstName' }
                        defaultSortingOrder={ 'asc' }
                    />
                </div>
            </div>
        );
    }
}
