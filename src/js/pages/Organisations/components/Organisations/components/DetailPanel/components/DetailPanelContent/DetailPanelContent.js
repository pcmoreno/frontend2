import { h, Component } from 'preact';

/** @jsx h */

import Participants from './components/Participants/Participants';

export default class DetailPanelContent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { activeTab, i18n } = this.props;

        let output = <span>content for {activeTab} tab goes here</span>;

        if (activeTab === 'participants') {
            output = <Participants
                openModalToAddParticipant={ this.props.openModalToAddParticipant }
                closeModalToAddParticipant={ this.props.closeModalToAddParticipant }
                i18n={ i18n }
            />;
        }

        return (
            <p>{ output }</p>
        );
    }
}
