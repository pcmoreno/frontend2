import { h, Component } from 'preact';

/** @jsx h */

import NavigationItem from './components/NavigationItem/NavigationItem';
import style from './style/navigation.scss';

export default class Navigation extends Component {
    constructor() {
        super();
    }

    render() {
        const navigationItems = [];
        const { items } = this.props;

        items.forEach(item => {
            const navigationItem = <NavigationItem
                label = { item.label }
                link = { item.link }
                key = { item.label }
                active = { window.location.pathname === item.link }
            />;

            navigationItems.push(navigationItem);
        });

        return (
            <nav className={ style.app_navigation }>
                <ul>
                    <li className={style.logo} />
                    { navigationItems }
                </ul>
            </nav>
        );
    }
}
