import { h, Component } from 'preact';
import UserMenuFoldout from './components/UserMenuFoldout/UserMenuFoldout';
import UserMenu from './components/UserMenu/UserMenu';
import style from './style/userinfo.scss';

/** @jsx h */

export default class UserInfo extends Component {
    constructor() {
        super();

        this.toggleUserMenu = this.toggleUserMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }

    closeMenu() {
        document.querySelector('#user_menu_foldout').classList.add('hidden');
        document.querySelector('#user_btn_foldout').classList.remove('open');
        window.removeEventListener('click', () => this.closeMenu(), true);
    }

    toggleUserMenu() {
        if (document.querySelector('#user_menu_foldout').classList.contains('hidden')) {
            window.addEventListener('click', () => this.closeMenu(), true);
            document.querySelector('#user_menu_foldout').classList.remove('hidden');
            document.querySelector('#user_btn_foldout').classList.add('open');
        } else {
            this.closeMenu();
        }
    }

    render() {
        const { user, logoutAction, languageId, switchLanguage, i18n } = this.props;

        return (
            <nav className={ style.user_info } onClick={ this.toggleUserMenu }>
                <UserMenu
                    user={user}
                />
                <UserMenuFoldout
                    logoutAction={ logoutAction }
                    languageId={ languageId }
                    switchLanguage={ switchLanguage }
                    toggleUserMenu={ this.toggleUserMenu }
                    i18n={ i18n }
                />
            </nav>
        );
    }
}
