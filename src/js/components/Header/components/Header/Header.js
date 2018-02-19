import { h, Component } from 'preact';
/** @jsx h */

import style from './style/header.scss';
import Navigation from './../Navigation/Navigation';

class Header extends Component {
    constructor() {
        super();
    }

    render() {
        let navigationItems = [
            {
                label: 'example-item', link:'/example'
            },
            {
                label: 'inbox', link:'/inbox'
            },
            {
                label: 'organisations', link:'/organisations'
            },
            {
                label: 'tasks', link:'/tasks'
            },
            {
                label: 'users', link:'/users'
            },
            {
                label: 'participants', link:'/participants'
            }
        ];

        return (<header className={ style.header }>
                <figure alt="LTP"> </figure>
                <Navigation items={ navigationItems } />
            </header>)
    }
}

export default Header;
