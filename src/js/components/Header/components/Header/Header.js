import { h, Component } from 'preact';

/** @jsx h */

import Navigation from './components/Navigation/Navigation';
import UserInfo from './components/UserInfo/UserInfo';
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
            <UserInfo />
            <span className={ style.indicator }>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 20">
                    <path d="M0,2C26,2,34,13.19,40,22.33,47,13.06,54,2,80,2V0H0Z" />
                    <path d="M0,0C26,0,34,10.19,40,19.33,47,10.06,54,0,80,0Z" />
                </svg>
            </span>
        </header>);
    }
}

export default Header;
