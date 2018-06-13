import { h, Component } from 'preact';

/** @jsx h */

import DetailPanelNavigation from './components/DetailPanelNavigation/DetailPanelNavigation';
import Participants from './components/Participants/Participants';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/detailpanel.scss';

export default class DetailPanel extends Component {
    constructor(props) {
        super(props);

        // keep track of opened tab (defaults to 'information') todo: add to constants
        this.localState = {
            activeTab: 'information'
        };

        this.switchTab = this.switchTab.bind(this);
    }

    switchTab(tabName) {
        this.setState(this.localState.activeTab = tabName);
    }

    toggleFullWidthDetailPanel() {
        if (document.querySelector('#panels').classList.contains('hidden')) {
            document.querySelector('#panels').classList.remove('hidden');
            document.querySelector('#panels_container').classList.remove('single_fragment');
        } else {
            document.querySelector('#panels').classList.add('hidden');
            document.querySelector('#panels_container').classList.add('single_fragment');
        }
    }

    closeDetailPanel() {
        document.querySelector('#detailpanel').classList.add('hidden');
    }

    render() {
        const { data, i18n } = this.props;
        const entity = data.entity;

        // todo: turn in a component similar to participants so it also has scrolling etc.
        let output = <p id="detailpanel_main_">name: {data.entity.name} (id: {data.entity.id})<br />type: {data.entity.type}</p>;

        // todo: wrap all possible panels in a switch and use imports for each
        if (this.localState.activeTab.toString() === 'participants') {
            output = <p className={ style.detailpanelcontent_p }> <Participants
                openModalToAddParticipant={ this.props.openModalToAddParticipant }
                openModalToInviteParticipant={ this.props.openModalToInviteParticipant }
                closeModalToInviteParticipant={ this.props.closeModalToInviteParticipant }
                closeModalToAddParticipant={ this.props.closeModalToAddParticipant }
                selectedParticipants={ this.props.selectedParticipants }
                toggleParticipant = { this.props.toggleParticipant }
                openModalToAmendParticipant={ this.props.openModalToAmendParticipant }
                closeModalToAmendParticipant={ this.props.closeModalToAmendParticipant }
                participants={ entity.participants }
                i18n={ i18n }
            /></p>;
        }

        return (
            <aside className={`${style.detailpanel} hidden`} id="detailpanel">
                <header>
                    <div className={ style.spinner_container }>
                        <span id="spinner_detail_panel" className={ `${style.spinner} hidden` }>
                            <FontAwesomeIcon icon="spinner"/>
                        </span>
                    </div>
                    <span
                        tabIndex="0"
                        className={ style.button_hide_detailpanel }
                        onClick={ this.closeDetailPanel }
                        role="button">
                        x
                    </span>
                    <span
                        tabIndex="0"
                        className={ style.button_fullwidth_detailpanel }
                        onClick={ this.toggleFullWidthDetailPanel }
                        role="button">
                        &#11013;
                    </span>
                    <h2>{ entity.name }</h2>
                </header>
                <DetailPanelNavigation
                    entity={ entity }
                    activeTab={ this.localState.activeTab }
                    switchTab={ this.switchTab }
                    i18n={ i18n }
                />
                <main className={ style.modal_invite_participant }>
                    { output }
                </main>
            </aside>
        );
    }
}
