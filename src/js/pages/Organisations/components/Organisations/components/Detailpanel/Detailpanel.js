import { h, Component } from 'preact';

/** @jsx h */

import DetailpanelNavigation from './components/DetailPanelNavigation/DetailPanelNavigation';
import DetailpanelContent from './components/DetailpanelContent/DetailpanelContent';
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
        //const { entity } = this.props;

        const entity = {
            id: 2,
            name: 'some name',
            type: 'project'
        };

        let entityName = 'loading';

        if (entity) {
            // todo: use entity.name in the jsx instead
            entityName = entity.name;
        }

        // todo: finish styling for detail panel NEON-3255
        return (
            <aside className={`${style.detailpanel} hidden_DISABLED`} id="detailpanel">
                <header>
                    <span tabIndex="0" className={ style.button_hide_detailpanel } onClick={ this.closeDetailPanel } role="button">x</span>
                    <span tabIndex="0" className={ style.button_fullwidth_detailpanel } onClick={ this.toggleFullWidthDetailPanel } role="button">&#11013;</span>
                    <h2>{ entityName }</h2>
                </header>
                <DetailpanelNavigation
                    entity={ entity }
                    activeTab={ this.localState.activeTab }
                    switchTab={ this.switchTab }
                />
                <main>
                    <p>some bla bla</p>
                    <span className={ style.detailpanel_divider }>some divider</span>
                    <p>some bla bla</p>
                    <DetailpanelContent activeTab={ this.localState.activeTab } />
                </main>
            </aside>
        );
    }
}
