import { h, Component } from 'preact';

/** @jsx h */

export default class Information extends Component {
    render() {
        const { active, switchTab, i18n } = this.props;

        return (
            <li
                className={ active && 'active' }
                onClick={ () => {
                    switchTab('information');
                }}
            >
                <span>{ i18n.organisations_detailpanel_label_info }</span>
            </li>
        );
    }
}
