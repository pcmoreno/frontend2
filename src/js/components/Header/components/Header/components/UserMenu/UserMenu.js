import { h, Component } from 'preact';

/** @jsx h */

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/usermenu.scss';

export default class UserMenu extends Component {
    constructor() {
        super();
    }

    toggleUserMenu() {
        if (document.querySelector('#user_foldout').classList.contains('hidden')) {
            document.querySelector('#user_foldout').classList.remove('hidden');
            document.querySelector('#user_btn_foldout').classList.add('open');
        } else {
            document.querySelector('#user_foldout').classList.add('hidden');
            document.querySelector('#user_btn_foldout').classList.remove('open');
        }
    }

    render() {

        /* todo: extract to sub components */
        /* todo: missing half-width navigation style where only the active item has text */

        return (
            <nav className={ style.user_menu } onClick={ this.toggleUserMenu }>
                <ul className={ style.nav_user }>
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
                <div className={ `${style.user_foldout} hidden` } id="user_foldout">
                    <ul>
                        <li>
                            <a href="#notimplemented">
                                <span>EN</span>
                            </a>
                        </li>
                        <li>
                            <a href="#notimplemented">
                                <span>Feature toggles</span>
                            </a>
                        </li>
                        <li>
                            <a href="#notimplemented">
                                <span>
                                    <FontAwesomeIcon icon="sign-out-alt" />
                                </span>
                                <span>Uitloggen</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}
