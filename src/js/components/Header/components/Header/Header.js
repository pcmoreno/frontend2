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

    /* note you can still access /example to see the example route and page component */
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

        return (<header className={ style.header }>
            <Navigation items={ navigationItems } />
            <UserInfo
                logoutAction={this.props.logoutAction}
            />
            <Indicator />
        </header>);
    }
}

export default Header;
