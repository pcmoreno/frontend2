import { h, Component } from 'preact';

/** @jsx h */

import Participants from './components/Participants/Participants';

export default class DetailPanelContent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { activeTab } = this.props;

        let output = <span>content for {activeTab} tab goes here</span>;

        if (activeTab === 'participants') {
            output = <Participants
                openModalToAddParticipant={ this.props.openModalToAddParticipant }
                closeModalToAddParticipant={ this.props.closeModalToAddParticipant }
            />;
        }

        return (
            <p>{ output }</p>
        );
    }
}
