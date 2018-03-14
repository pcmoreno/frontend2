import { h, Component } from 'preact';

/** @jsx h */

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/usermenu.scss';

export default class UserMenu extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <ul className={ style.user_menu }>
                <li className={ `${style.spinner} hidden` } id="spinner">
                    <FontAwesomeIcon icon="spinner"/>
                </li>
                <li className={ style.user_avatar }>
                    <FontAwesomeIcon icon="user" />
                </li>
                <li className={ style.user_name }>
                    <span>
                        Robbin van Ooij
                    </span>
                </li>
                <li className={ style.btn_foldout } id="user_btn_foldout">
                    <FontAwesomeIcon icon="angle-down" />
                </li>
            </ul>
        );
    }
}



