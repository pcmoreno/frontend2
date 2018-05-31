import { h, Component } from 'preact';

/** @jsx h */

import DetailPanelNavigation from './components/DetailPanelNavigation/DetailPanelNavigation';
import DetailPanelContent from './components/DetailPanelContent/DetailPanelContent';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/detailpanel.scss';

export default class DetailPanel extends Component {
    constructor(props) {
        super(props);

        // keep track of opened tab (defaults to 'information')
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
        const outputTab = <p>name: {data.entity.name} (id: {data.entity.id})<br />type: {data.entity.type}</p>;
        const entity = data.entity;

        return (
            <aside className={`${style.detailpanel} hidden`} id="detailpanel">
                <header>
                    <div className={ style.spinner_container }>
                        <span id="spinner_detail_panel" className={ `${style.spinner} hidden` }>
                            <FontAwesomeIcon icon="spinner"/>
                        </span>
                    </div>
                    <span tabIndex="0" className={ style.button_hide_detailpanel } onClick={ this.closeDetailPanel } role="button">x</span>
                    <span tabIndex="0" className={ style.button_fullwidth_detailpanel } onClick={ this.toggleFullWidthDetailPanel } role="button">&#11013;</span>
                    <h2>{ entity.name }</h2>
                </header>
                <DetailPanelNavigation
                    entity={ entity }
                    activeTab={ this.localState.activeTab }
                    switchTab={ this.switchTab }
                    i18n={i18n}
                />
                <main className={ style.main }>
                    {/*<p id="detailpanel_main_">{ outputTab }</p>*/}
                    <DetailPanelContent
                        openModalToAddParticipant={ this.props.openModalToAddParticipant }
                        closeModalToAddParticipant={ this.props.closeModalToAddParticipant }
                        activeTab={ this.localState.activeTab }
                        participants={ entity.participants }
                        i18n={i18n}
                    />
                </main>
            </aside>
        );
    }
}
