import { h, Component } from 'preact';
import DetailPanelNavigation from './components/DetailPanelNavigation/DetailPanelNavigation';
import Participants from './components/Participants/Participants';
import Settings from './components/Settings/Settings';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import InlineEditableText from './components/InlineEditableText/InlineEditableText';
import DetailPanelTabType from '../../../../constants/DetailPanelTabType';
import EntityType from '../../../../../../constants/EntityType';
import FieldType from '../../../../constants/FieldType';
import style from './style/detailpanel.scss';

/** @jsx h */

export default class DetailPanel extends Component {
    constructor(props) {
        super(props);

        // keep track of opened tab (defaults to 'information')
        this.localState = {
            activeTab: DetailPanelTabType.INFORMATION
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
            icon = null,
            amendFieldType = '',
            amendSectionType = '';

        switch (this.localState.activeTab.toString()) {

            case DetailPanelTabType.INFORMATION: output = null;
                break;

            case DetailPanelTabType.SETTINGS: output = <p className={ style.content_wrapper }>
                <Settings
                    selectedCompetenciesListView={ this.props.selectedCompetenciesListView }
                    openModalToEditCompetencies={ this.props.openModalToEditCompetencies }
                    languageId={ this.props.languageId }
                    pathNodes={ this.props.pathNodes }
                    entity={ entity }
                    i18n={ i18n }
                />
            </p>;
                break;

            case DetailPanelTabType.PARTICIPANTS: output = <p className={ style.content_wrapper }>
                <Participants
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
                />
            </p>;
                break;

            default:
                break;
        }

        // get correct header icon, LTP organisation does not render the icon
        switch (entity.type) {
            case EntityType.JOB_FUNCTION:
                icon = <FontAwesomeIcon icon='suitcase' />;

                // to be able to amend names for entities, specify the correct section and fieldType
                amendFieldType = FieldType.ORGANISATION;
                amendSectionType = EntityType.ORGANISATION;
                break;
            case EntityType.ORGANISATION:
                icon = <FontAwesomeIcon icon='building' />;

                // to be able to amend names for entities, specify the correct section and fieldType
                amendFieldType = FieldType.ORGANISATION;
                amendSectionType = EntityType.ORGANISATION;
                break;
            case EntityType.PROJECT:
                icon = <FontAwesomeIcon icon='clipboard-list' />;

                // to be able to amend names for entities, specify the correct section and fieldType
                amendFieldType = FieldType.PROJECT;
                amendSectionType = EntityType.PROJECT;
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
                        className={ `${style.button_hide_detailpanel}` }
                        onClick={ this.closeDetailPanel }
                        role="button"
                    >
                        x
                    </span>
                    <span
                        tabIndex="0"
                        className={ `${style.button_fullwidth_detailpanel}` }
                        onClick={ this.toggleFullWidthDetailPanel }
                        role="button"
                    >
                        <FontAwesomeIcon icon='long-arrow-alt-left' />
                    </span>
                    { entity.name !== 'LTP' &&
                        <div className={ `${style.header_icon}` }>{ icon }</div>
                    }
                    <h2>
                        <InlineEditableText
                            initialValue={ entity.name }
                            amendFunction={ this.props.amendInlineEditable }
                            amendSectionType={ amendSectionType }
                            slug={ entity.uuid }
                            amendFieldType={ amendFieldType }
                            i18n={ i18n }
                        />
                    </h2>
                </header>
                <DetailPanelNavigation
                    entity={ entity }
                    activeTab={ this.localState.activeTab }
                    switchTab={ this.switchTab }
                    i18n={ i18n }
                />
                <main>
                    { output }
                </main>
            </aside>
        );
    }
}
