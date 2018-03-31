import { h, Component } from 'preact';

/** @jsx h */

import DetailpanelNavigation from './components/DetailPanelNavigation/DetailPanelNavigation';
import DetailpanelContent from './components/DetailpanelContent/DetailpanelContent';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/detailpanel.scss';

export default class Detailpanel extends Component {
    constructor(props) {
        super(props);

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
        const { data, name } = this.props;
        let outputTab = <p />;
        let entity;

        if (data && data.hasOwnProperty('entity')) {
            outputTab = <p>name: {name} (id: {data.entity.id})<br />type: {data.entity.type}</p>;
            entity = data.entity;
        } else {

            // this is the default todo: I dont like this.
            entity = { name: 'LTP', type: 'organisation' };
        }

        return (
            <aside className={`${style.detailpanel} hidden`} id="detailpanel">
                <header>
                    <div className={ style.spinner_container }>
                        <span id="spinner_detail_panel" className={ `${style.spinner} hidden` }><FontAwesomeIcon icon="spinner"/></span>
                    </div>
                    <span tabIndex="0" className={ style.button_hide_detailpanel } onClick={ this.closeDetailPanel } role="button">x</span>
                    <span tabIndex="0" className={ style.button_fullwidth_detailpanel } onClick={ this.toggleFullWidthDetailPanel } role="button">&#11013;</span>
                    <h2>{ name }</h2>
                </header>
                <DetailpanelNavigation
                    entity={ entity }
                    activeTab={ this.localState.activeTab }
                    switchTab={ this.switchTab }
                />
                <main>
                    <p>(any data below comes from the API)</p>
                    <span className={ style.detailpanel_divider }>some divider</span>
                    <p>{ outputTab }</p>
                    <DetailpanelContent activeTab={ this.localState.activeTab } />
                </main>
            </aside>
        );
    }
}
