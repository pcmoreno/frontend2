import { h, Component } from 'preact';

/** @jsx h */

import UserMenuFoldout from './components/UserMenuFoldout/UserMenuFoldout';
import UserMenu from './components/UserMenu/UserMenu';
import style from './style/userinfo.scss';

export default class UserInfo extends Component {
    constructor() {
        super();
    }

    toggleUserMenu() {
        if (document.querySelector('#user_menu_foldout').classList.contains('hidden')) {
            document.querySelector('#user_menu_foldout').classList.remove('hidden');
            document.querySelector('#user_btn_foldout').classList.add('open');
        } else {
            document.querySelector('#user_menu_foldout').classList.add('hidden');
            document.querySelector('#user_btn_foldout').classList.remove('open');
        }
    }

    render() {
        const { user } = this.props;

        return (
            <nav className={ style.user_info } onClick={ this.toggleUserMenu }>
                <UserMenu
                    user={user}
                />
                <UserMenuFoldout
                    logoutAction={this.props.logoutAction}
                />
            </nav>
        );
    }
}
