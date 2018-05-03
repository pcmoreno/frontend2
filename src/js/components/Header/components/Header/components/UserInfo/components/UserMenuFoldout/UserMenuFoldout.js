import { h, Component } from 'preact';

/** @jsx h */

import * as languageType from '../../../../../../constants/LanguageTypes';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/usermenufoldout.scss';

export default class UserMenuFoldout extends Component {
    constructor() {
        super();
    }

    render() {
        const { logoutAction, switchLanguage, languageId, toggleUserMenu, i18n } = this.props;
        const switchableLanguageId = languageId === languageType.NL ? languageType.EN : languageType.NL;

        return (
            <div className={ `${style.user_menu_foldout} hidden` } id="user_menu_foldout">
                <ul>
                    <li>
                        <div
                            role="button"
                            tabIndex="0"
                            onClick={ event => {
                                event.preventDefault();
                                switchLanguage(switchableLanguageId);
                                toggleUserMenu();
                            } }>
                            <span>{ i18n[switchableLanguageId] }</span>
                        </div>
                    </li>
                    <li>
                        <div>
                            <span>Feature toggles</span>
                        </div>
                    </li>
                    <li>
                        <div
                            role="button"
                            tabIndex="0"
                            onClick={logoutAction}>
                            <span>
                                <FontAwesomeIcon icon="sign-out-alt" />
                            </span>
                            <span>{ i18n.log_out }</span>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}
