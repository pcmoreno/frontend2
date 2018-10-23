import { h, Component } from 'preact';
import LanguageTypes from '../../../../../../../../constants/LanguageTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './style/usermenufoldout.scss';
import Authorised from 'neon-frontend-utils/src/components/Authorised';
import ApiFactory from 'neon-frontend-utils/src/api/factory';
import HeaderComponents from '../../../../../../constants/HeaderComponents';
import HeaderActions from '../../../../../../constants/HeaderActions';

/** @jsx h */

export default class UserMenuFoldout extends Component {
    constructor() {
        super();

        this.api = ApiFactory.get('neon');
    }

    render() {
        const { logoutAction, switchLanguage, languageId, toggleUserMenu, i18n } = this.props;
        const switchableLanguageId = languageId === LanguageTypes.NL ? LanguageTypes.EN : LanguageTypes.NL;

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
                            <span>{ i18n[`header_${switchableLanguageId}`] }</span>
                        </div>
                    </li>
                    <li>
                        <Authorised api={ this.api } component={ HeaderComponents.HEADER_COMPONENT } action={ HeaderActions.FEATURE_TOGGLE_ACTION }>
                            <span>{ i18n.header_feature_toggles }</span>
                        </Authorised>
                    </li>
                    <li>
                        <div
                            role="button"
                            tabIndex="0"
                            onClick={logoutAction}>
                            <span>
                                <FontAwesomeIcon icon="sign-out-alt" />
                            </span>
                            <span>{ i18n.header_log_out }</span>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}
