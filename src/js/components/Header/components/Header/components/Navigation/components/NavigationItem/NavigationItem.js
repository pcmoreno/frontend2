import { h, Component } from 'preact';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './style/navigationitem.scss';

/** @jsx h */

export default class navigationItem extends Component {
    render() {
        const { label, link, i18n } = this.props;

        let iconType;

        switch (label) {
            case 'Inbox':
                iconType = 'envelope';
                break;
            case 'Organisations':
                iconType = 'building';
                break;
            case 'Tasks':
                iconType = 'clipboard-list';
                break;
            case 'Users':
                iconType = 'users';
                break;
            case 'Participants':
                iconType = 'users';
                break;

            default:
                iconType = 'users';
        }

        return (
            <li className={ `${style.navigation_item}` } id={ label.toLowerCase() }>
                <a href={ link }>
                    <FontAwesomeIcon icon={ iconType } />
                    <span>{ i18n[`header_${label.toLowerCase()}`] }</span>
                </a>
            </li>
        );
    }
}
