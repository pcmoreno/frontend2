import { h, Component } from 'preact';
/** @jsx h */

import style from './style/usermenu.scss';

export default class UserMenu extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <nav className={ style.user_menu }>
                <ul>
                    <li className={ style.nav_user }>
                        <ul className={ style.user_info }>
                            <li className={ style.user_avatar }>
                                O
                            </li>
                            <li className={ style.user_name }>
                        <span>
                            Robbin van Ooij
                        </span>
                            </li>
                        </ul>
                        <ul className={ style.btn_foldout }>
                            <li>
                                <a href="#">
                                    ^
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        )
    }
}


