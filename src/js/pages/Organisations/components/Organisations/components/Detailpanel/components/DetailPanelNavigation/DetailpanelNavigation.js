import { h, Component } from 'preact';

/** @jsx h */

import Information from './components/Information/Information';
import Settings from './components/Settings/Settings';
import Participants from './components/Participants/Participants';
import style from './style/detailpanelnavigation.scss';

export default class DetailpanelNavigation extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { entity, activeTab, switchTab } = this.props;
        let tabOutput;

        switch (entity.type) {
            case 'organisation':
                if (entity.id === 0) {

                    // just to ensure the root detail panel details have no sub navigation
                    tabOutput = <ul />;
                } else {
                    tabOutput = <ul><Information active={activeTab === 'information'} switchTab={ switchTab }/></ul>;
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
