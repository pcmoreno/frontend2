import { h, Component } from 'preact';

/** @jsx h */

export default class Settings extends Component {
    render() {
        const { active, switchTab, i18n } = this.props;

        return (
            <li
                className={ active && 'active' }
                onClick={ () => {
                    switchTab('settings');
                }}
            >
                <span>{ i18n.organisations_detailpanel_label_settings }</span>
            </li>
        );
    }
}
