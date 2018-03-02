import { h, Component } from 'preact';
/** @jsx h */

import NavigationItem from './components/NavigationItem/NavigationItem';
import style from './style/navigation.scss';

export default class Navigation extends Component {
    constructor() {
        super();
    }

    render() {
        let navigationItems = [];
        let { items } = this.props;

        items.map((item) => {
            let navigationItem = <NavigationItem label={ item.label } link={ item.link } key={ item.label } />;

            navigationItems.push(navigationItem);
        });

        return (
            <nav className={ style.app_navigation }>
                <ul>
                    <li className={style.logo} />
                    { navigationItems }
                </ul>
            </nav>
        )
    }
}


