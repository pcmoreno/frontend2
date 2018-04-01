import { h, Component } from 'preact';

/** @jsx h */

import Information from './components/Information/Information';
import Settings from './components/Settings/Settings';
import Participants from './components/Participants/Participants';
import AppConfig from './../../../../../../../../App.config';
import style from './style/detailpanelnavigation.scss';

export default class DetailpanelNavigation extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { entity, activeTab, switchTab } = this.props;

        let tabOutput = null;

        switch (entity.type) {
            case 'organisation':
                if (entity.name === AppConfig.global.organisations.rootEntitiesParentName) {
                    tabOutput = <ul />;
                } else {
                    tabOutput = <ul><Information active={activeTab === 'information'} switchTab={switchTab}/></ul>;
                }
                break;
            case 'jobFunction':
                tabOutput = <ul><Information active={ activeTab === 'information' } switchTab={ switchTab } /></ul>;
                break;
            case 'project':
                tabOutput = <ul>
                    <Information active={ activeTab === 'information' } switchTab={ switchTab } />
                    <Settings active={ activeTab === 'settings' } switchTab={ switchTab } />
                    <Participants active={ activeTab === 'participants' } switchTab={ switchTab } />
                </ul>;
                break;
            default:
                tabOutput = <ul />;
        }

        return (
            <nav className={ style.detailpanelnavigation } id="detail_panel_navigation">
                { tabOutput }
            </nav>
        );
    }
}
