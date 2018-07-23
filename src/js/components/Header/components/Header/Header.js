import { h, Component } from 'preact';

/** @jsx h */

import Navigation from './components/Navigation/Navigation';
import UserInfo from './components/UserInfo/UserInfo';
import Indicator from './components/Indicator/Indicator';
import style from './style/header.scss';
import ApiFactory from '../../../../utils/api/factory';
import AppConfig from '../../../../App.config';
import HeaderActions from '../../constants/HeaderActions';

class Header extends Component {
    constructor() {
        super();

        this.api = ApiFactory.get('neon');
    }

    render() {
        const navigationItems = [];
        const routes = AppConfig.headerRoutes;

        // check if the logged in user is authorised to render this route, only then show the header item
        routes.forEach(route => {
            if (this.api.getAuthoriser().authorise(this.api.getAuthenticator().getUser(), route.component, HeaderActions.ROUTE_ACTION)) {
                navigationItems.push(route);
            }
        });

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
