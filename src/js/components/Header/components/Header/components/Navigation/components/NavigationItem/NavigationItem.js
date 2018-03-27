import { h, Component } from 'preact';

/** @jsx h */

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/navigationitem.scss';

export default class navigationItem extends Component {
    constructor() {
        super();
    }

    render() {
        const { label, link } = this.props;

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
                <a href={ link }><FontAwesomeIcon icon={ iconType } /><span>{ label }</span></a>
            </li>
        );
    }
}
