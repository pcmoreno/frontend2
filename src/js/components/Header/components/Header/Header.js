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
                label: 'example-navigation-item', link:'/example'
            }
        ];

        return (<header className={ style.header }>
                <a href="/"><figure className="logo" /></a>
                <Navigation items={ navigationItems } />
            </header>)
    }
}

export default Header;
