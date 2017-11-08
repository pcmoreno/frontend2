import { h, Component } from 'preact';
/** @jsx h */

import NavigationItem from './js/NavigationItem/NavigationItem';
import css from './css/navigation';

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
            <nav>
                <ul>
                    { navigationItems }
                </ul>
            </nav>
        )
    }
}


