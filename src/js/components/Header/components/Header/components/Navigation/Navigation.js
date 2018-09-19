import { h, Component } from 'preact';
import NavigationItem from './components/NavigationItem/NavigationItem';
import style from './style/navigation.scss';

/** @jsx h */

export default class Navigation extends Component {
    render() {
        const navigationItems = [];
        const { items, i18n } = this.props;

        items.forEach(item => {
            const navigationItem = <NavigationItem
                label={ item.label }
                link={ item.link }
                key={ item.label }
                i18n={ i18n }
            />;

            navigationItems.push(navigationItem);
        });

        return (
            <nav className={ style.app_navigation }>
                <ul>
                    <a href="/"><li className={style.logo} /></a>
                    { navigationItems }
                </ul>
            </nav>
        );
    }
}
