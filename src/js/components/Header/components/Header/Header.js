import { h, Component } from 'preact';

/** @jsx h */

import Navigation from './components/Navigation/Navigation';
import UserInfo from './components/UserInfo/UserInfo';
import Indicator from './components/Indicator/Indicator';
import style from './style/header.scss';

class Header extends Component {
    constructor() {
        super();
    }

    render() {
        const navigationItems = [
            {
                label: 'Inbox', link: '/inbox'
            },
            {
                label: 'Organisations', link: '/organisations'
            },
            {
                label: 'Tasks', link: '/tasks'
            },
            {
                label: 'Users', link: '/users'
            },
            {
                label: 'Participants', link: '/participants'
            }
        ];

        const { user, logoutAction, languageId, switchLanguage, i18n } = this.props;

        return (<header className={style.header}>
            <Navigation items={navigationItems} i18n={i18n} />
            <UserInfo
                user={user}
                logoutAction={logoutAction}
                languageId={languageId}
                switchLanguage={switchLanguage}
                i18n={i18n}
            />
            <Indicator />
        </header>);
    }
}

export default Header;
