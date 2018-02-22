import { h, Component } from 'preact';
/** @jsx h */

import style from './style/usermenu.scss';

export default class UserMenu extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <nav className={ style.usermenu }>
                <ul>
                    <li className="nav-user">
                        <ul className="user-info">
                            <li className="user-avatar">
                                O
                            </li>
                            <li className="user-name">
                        <span>
                            Robbin van Ooij
                        </span>
                            </li>
                        </ul>
                        <ul className="btn-foldout">
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


