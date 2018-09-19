import { h, Component } from 'preact';

/** @jsx h */

export default class Participants extends Component {
    render() {
        const { active, switchTab, i18n } = this.props;

        return (
            <li
                className={ active && 'active' }
                onClick={ () => {
                    switchTab('participants');
                }}
            >
                <span>{ i18n.organisations_detailpanel_label_participants }</span>
            </li>
        );
    }
}
