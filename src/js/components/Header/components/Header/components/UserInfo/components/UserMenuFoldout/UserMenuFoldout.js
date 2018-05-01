import { h, Component } from 'preact';

/** @jsx h */

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/usermenufoldout.scss';

export default class UserMenuFoldout extends Component {
    constructor() {
        super();
    }

    render() {

        const { logoutAction, switchLanguage } = this.props;

        return (
            <div className={ `${style.user_menu_foldout} hidden` } id="user_menu_foldout">
                <ul>
                    <li>
                        <a href="#notimplemented" onClick={ event => {
                            event.preventDefault();
                            switchLanguage('en');
                        } }>
                            <span>EN</span>
                        </a>
                    </li>
                    <li>
                        <a href="#notimplemented">
                            <span>Feature toggles</span>
                        </a>
                    </li>
                    <li>
                        <a href='#logout' onClick={logoutAction}>
                            <span>
                                <FontAwesomeIcon icon="sign-out-alt" />
                            </span>
                            <span>Uitloggen</span>
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}
