import { h, Component } from 'preact';
/** @jsx h */

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/usermenu.scss';

export default class UserMenu extends Component {
    constructor() {
        super();
    }

    render() {

        /* todo: extract to sub components */
        /* todo: finish user menu rollout  menu */

        return (
            <nav className={ style.user_menu }>
                <ul>
                    <li className={ style.nav_user }>
                        <ul className={ style.user_info }>
                            <li className={ style.user_avatar }>
                                <FontAwesomeIcon icon="user" />
                            </li>
                            <li className={ style.user_name }>
                        <span>
                            Robbin van Ooij
                        </span>
                            </li>
                        </ul>
                        <ul className={ style.btn_foldout }>
                            <li>
                                <span role="button" onClick={ () => {console.log('to do')} } >
                                    <FontAwesomeIcon icon="angle-down" />
                                </span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        )
    }
}


