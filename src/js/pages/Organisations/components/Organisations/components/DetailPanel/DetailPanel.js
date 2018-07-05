import { h, Component } from 'preact';

/** @jsx h */

import DetailPanelNavigation from './components/DetailPanelNavigation/DetailPanelNavigation';
import Participants from './components/Participants/Participants';
import Settings from './components/Settings/Settings';
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
        let output = null,
            icon = null;

        // todo: replace ugly selector name detailpanelcontent_p

        switch (this.localState.activeTab.toString()) {

            case 'information': output = <p>information</p>;
                break;

            case 'settings': output = <p className={ style.detailpanelcontent_p }><Settings openModalToEditCompetencies={ this.props.openModalToEditCompetencies } /></p>;
                break;

            case 'participants': output = <p className={ style.detailpanelcontent_p }><Participants
                openModalToAddParticipant={ this.props.openModalToAddParticipant }
                openModalToInviteParticipant={ this.props.openModalToInviteParticipant }
                closeModalToInviteParticipant={ this.props.closeModalToInviteParticipant }
                closeModalToAddParticipant={ this.props.closeModalToAddParticipant }
                selectedParticipants={ this.props.selectedParticipants }
                toggleSelectAllParticipants={ this.props.toggleSelectAllParticipants }
                toggleParticipant = { this.props.toggleParticipant }
                openModalToAmendParticipant={ this.props.openModalToAmendParticipant }
                closeModalToAmendParticipant={ this.props.closeModalToAmendParticipant }
                participantListView={ entity.participantListView }
                i18n={ i18n }
            /></p>;
                break;

            default:
                break;
        }

        // get correct header icon, LTP organisation does not render the icon
        switch (entity.type) {
            case 'jobFunction':
                icon = <FontAwesomeIcon icon='suitcase' />;
                break;
            case 'organisation':
                icon = <FontAwesomeIcon icon='building' />;
                break;
            case 'project':
                icon = <FontAwesomeIcon icon='clipboard-list' />;
                break;
            default:
                break;
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
                    { entity.name !== 'LTP' &&
                        <div className={ style.header_icon }>{ icon }</div>
                    }
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
