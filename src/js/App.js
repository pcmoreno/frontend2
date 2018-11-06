// the root component combines reducers, sets up the store and ties routing components together

import { h, render, Component } from 'preact';
import Router from 'preact-router';
import AsyncRoute from 'preact-async-route';
import Alert from 'neon-frontend-utils/src/components/Alert';
import ApiFactory from 'neon-frontend-utils/src/api/factory';
import NeonAuthenticator from 'neon-frontend-utils/src/authenticator/neon';
import NeonAuthoriser from 'neon-frontend-utils/src/authoriser/neon';
import Logger from 'neon-frontend-utils/src/logger';
import Components from './constants/Components';
import AppConfig from './App.config';

// init logger
const logger = new Logger(AppConfig.logger);

logger.notice({
    component: Components.APPLICATION,
    message: 'Open application'
});

/** @jsx h */

import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faSuitcase, faEye, faUser, faAngleDown, faChevronLeft, faChevronRight,
    faSignOutAlt, faSpinner, faUsers, faEnvelope, faBuilding, faClipboardList,
    faPencilAlt, faPlus, faTimes, faCheck, faEllipsisH, faDownload,
    faSyncAlt, faArrowLeft
} from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons';

// add imported icons to global library to make them available wherever the FontAwesomeIcon component is imported
library.add(
    faSuitcase,
    faEye,
    faUser,
    faAngleDown,
    faChevronLeft,
    faChevronRight,
    faSignOutAlt,
    faSpinner,
    faUsers,
    faBuilding,
    faEnvelope,
    faClipboardList,
    faFileAlt,
    faPencilAlt,
    faPlus,
    faTimes,
    faCheck,
    faEllipsisH,
    faDownload,
    faSyncAlt,
    faArrowLeft
);

// react-redux: make the store available to all container components in the application without passing it explicitly
import { Provider } from 'preact-redux';

// this defines the redux store
import { createStore, combineReducers } from 'redux';

// import all reducers
import headerReducer from './components/Header/reducers/header';
import inboxReducer from './pages/Inbox/reducers/inbox';
import organisationsReducer from './pages/Organisations/reducers/organisations';
import tasksReducer from './pages/Tasks/reducers/tasks';
import reportReducer from './pages/Report/reducers/report';
import usersReducer from './pages/Users/reducers/users';
import participantsReducer from './pages/Participants/reducers/participants';
import alertReducer from 'neon-frontend-utils/src/components/Alert/reducers/alert';
import formReducer from 'neon-frontend-utils/src/components/Form/reducers/form';

// combine into one
const rootReducer = combineReducers({
    headerReducer,
    inboxReducer,
    organisationsReducer,
    tasksReducer,
    reportReducer,
    usersReducer,
    participantsReducer,
    alertReducer,
    formReducer
});

// configure redux store with the combined reducers
const store = createStore(rootReducer);

// configure the Neon API once, so we can use it in any component from now
// this can be fetched by calling ApiFactory.get('neon')
ApiFactory.create(
    'neon',
    AppConfig.api.neon,
    new NeonAuthenticator(AppConfig.authenticator.neon, AppConfig.authenticator.cognito),
    new NeonAuthoriser(AppConfig.authoriser.neon)
);
const api = ApiFactory.get('neon');

// The authenticated route and component are dependent on the neon api instance
import AuthorisedRoute from 'neon-frontend-utils/src/components/AuthorisedRoute';
import Authenticated from 'neon-frontend-utils/src/components/Authenticated';
import Redirect from 'neon-frontend-utils/src/components/Redirect';

// import common css so it becomes available in all page components and eases separation for client specific css.
import style from '../style/global.scss'; // eslint-disable-line no-unused-vars

// Asyncroute ensures the right component' js code is loaded when user requests the route, webpack does the splitting.

/**
 * Returns the login page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} login page
 */
function getLogin() {
    return import('./pages/Login').then(module => module.default);
}

/**
 * Returns the inbox page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} inbox page
 */
function getInbox() {
    return import('./pages/Inbox').then(module => module.default);
}

/**
 * Returns the organisations page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} organisations page
 */
function getOrganisations() {
    return import('./pages/Organisations').then(module => module.default);
}

/**
 * Returns the tasks page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} tasks page
 */
function getTasks() {
    return import('./pages/Tasks').then(module => module.default);
}

/**
 * Returns the report page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} report page
 */
function getReport() {
    return import('./pages/Report').then(module => module.default);
}

/**
 * Returns the users page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} users page
 */
function getUsers() {
    return import('./pages/Users').then(module => module.default);
}

/**
 * Returns the participants page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} participants page
 */
function getParticipants() {
    return import('./pages/Participants').then(module => module.default);
}

/**
 * Returns the register page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} register page
 */
function getRegister() {
    return import('./pages/Register').then(module => module.default);
}

/**
 * Returns the error page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} error page
 */
function getError() {
    return import('./pages/Error').then(module => module.default);
}

/**
 * Returns the forgot password page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} forgot password page
 */
function getForgotPassword() {
    return import('./pages/ForgotPassword').then(module => module.default);
}

import Header from './components/Header';

/**
 * Renders the app
 * @returns {{}} app
 */
class App extends Component {

    constructor() {
        super();

        this.applicationState = {
            user: null
        };
    }

    componentDidMount() {
        this.applicationState.user = this.props.user;
        this.setState(this.applicationState);
    }

    render() {

        // user is NeonUser object or null
        const { user } = this.applicationState;

        return (
            <Provider store={ store }>
                <section id="layout">
                    <Authenticated api={api}>
                        <Header user={user} key="header"/>
                    </Authenticated>
                    <Alert />
                    <Router>
                        <Redirect path="/" to="/inbox" />
                        <AsyncRoute path="/login" getComponent={ getLogin } />
                        <AsyncRoute path="/forgot-password" getComponent={ getForgotPassword }/>

                        { /* requires params: email and token, including /app for persona fit app (legacy endpoint) */ }
                        <AsyncRoute path="/reset-password" getComponent={ getForgotPassword }/>
                        <AsyncRoute path="/reset-password/app" getComponent={ getForgotPassword }/>

                        {/* Register routes: 1st is main route, others are legacy routes */}
                        {/* Keep the legacy endpoints so only dns redirection (cname) will do the job */}
                        <AsyncRoute path="/register/:accountHasRoleSlug" getComponent={ getRegister } />
                        <AsyncRoute path="/invitation/:accountHasRoleSlug" getComponent={ getRegister } />
                        <AsyncRoute path="/terms_and_conditions/:projectId/:participantSessionSlug" getComponent={ getRegister } />
                        <AsyncRoute path="/register/:projectId/:participantSessionSlug" getComponent={ getRegister } />

                        <AsyncRoute path="/error" default getComponent={ getError } />
                        <AuthorisedRoute api={api} path="/report/:participantSessionId" getComponent={ getReport } component="report" />
                        <AuthorisedRoute api={api} path="/inbox" getComponent={ getInbox } component="inbox" />
                        <AuthorisedRoute api={api} path="/organisations" getComponent={ getOrganisations } component="organisations" />
                        <AuthorisedRoute api={api} path="/tasks" getComponent={ getTasks } component="tasks" />
                        <AuthorisedRoute api={api} path="/users" getComponent={ getUsers } component="users" />
                        <AuthorisedRoute api={api} path="/participants" getComponent={ getParticipants } component="participants" />
                    </Router>
                </section>
            </Provider>
        );
    }
}

// todo: before doing anything, redirect auth.ltponline.com to ltponline.com
// todo: this can be removed once legacy invitation links should not be supported anymore
if (~window.location.href.indexOf('//auth.')) {
    window.location.href = window.location.href.replace('//auth.', '//');
}

// before rendering the app, always first fetch the current user (if available)
api.getAuthenticator().refreshAndGetUser().then(user => {
    render(<App user={user} />,
        document.querySelector('body'),
        document.querySelector('body').firstChild);

}).catch(() => {
    render(<App />,
        document.querySelector('body'),
        document.querySelector('body').firstChild);
});
