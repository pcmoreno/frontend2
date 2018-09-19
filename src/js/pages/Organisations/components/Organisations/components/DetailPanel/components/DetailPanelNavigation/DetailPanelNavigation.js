import { h, Component } from 'preact';
import AppConfig from './../../../../../../../../App.config';
import Information from './components/Information/Information';
import Settings from './components/Settings/Settings';
import Participants from './components/Participants/Participants';
import EntityType from '../../../../../../../../constants/EntityType.js';
import style from './style/detailpanelnavigation.scss';

/** @jsx h */

export default class DetailPanelNavigation extends Component {
    render() {
        const { entity, activeTab, switchTab, i18n } = this.props;
        let tabOutput;

        if (entity.id === AppConfig.global.organisations.rootEntity.id) {

            // just to ensure the root detail panel has no sub navigation
            tabOutput = <ul />;
        } else {
            switch (entity.type) {
                case EntityType.ORGANISATION:
                    if (activeTab !== 'information') {
                        switchTab('information');
                    }
                    tabOutput = <ul><Information active={ activeTab === 'information' } switchTab={ switchTab } i18n={ i18n }/></ul>;
                    break;
                case EntityType.JOB_FUNCTION:
                    if (activeTab !== 'information') {
                        switchTab('information');
                    }
                    tabOutput = <ul><Information active={ activeTab === 'information' } switchTab={ switchTab } i18n={ i18n }/></ul>;
                    break;
                case EntityType.PROJECT:
                    tabOutput = <ul>
                        <Information active={ activeTab === 'information' } switchTab={ switchTab } i18n={ i18n }/>
                        <Settings active={ activeTab === 'settings' } switchTab={ switchTab } i18n={ i18n }/>
                        <Participants active={ activeTab === 'participants' } switchTab={ switchTab } i18n={ i18n }/>
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
