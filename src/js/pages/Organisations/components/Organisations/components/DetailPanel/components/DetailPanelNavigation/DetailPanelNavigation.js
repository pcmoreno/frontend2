import { h, Component } from 'preact';

/** @jsx h */

import AppConfig from './../../../../../../../../App.config';
import Information from './components/Information/Information';
import Settings from './components/Settings/Settings';
import Participants from './components/Participants/Participants';
import style from './style/detailpanelnavigation.scss';

export default class DetailPanelNavigation extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { entity, activeTab, switchTab } = this.props;
        let tabOutput;

        if (entity.id === AppConfig.global.organisations.rootEntity.id) {

            // just to ensure the root detail panel (and other panels while data loads) has no sub navigation
            tabOutput = <ul />;
        } else {
            switch (entity.type) {
                case 'organisation':
                    if (activeTab !== 'information') {
                        switchTab('information');
                    }
                    tabOutput = <ul><Information active={activeTab === 'information'} switchTab={switchTab}/></ul>;
                    break;
                case 'jobFunction':
                    if (activeTab !== 'information') {
                        switchTab('information');
                    }
                    tabOutput = <ul><Information active={activeTab === 'information'} switchTab={switchTab}/></ul>;
                    break;
                case 'project':
                    tabOutput = <ul>
                        <Information active={activeTab === 'information'} switchTab={switchTab}/>
                        <Settings active={activeTab === 'settings'} switchTab={switchTab}/>
                        <Participants active={activeTab === 'participants'} switchTab={switchTab}/>
                    </ul>;
                    break;
                default:
                    tabOutput = <ul/>;
            }
        }

        return (
            <nav className={ style.detailpanelnavigation } id="detail_panel_navigation">
                { tabOutput }
            </nav>
        );
    }
}
