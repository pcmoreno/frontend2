/* global System:true */

// the root component combines reducers, sets up the store and ties routing components together

// unclear if and where this polyfill is required, but this seems to be the most common approach
// we dont need full babel polyfill. To enable certain features, look at .babelrc
// import 'babel-polyfill';

import { h, render, Component } from 'preact';
import Router from 'preact-router';
import AsyncRoute from 'preact-async-route';
import Alert from './components/Alert';
import ApiFactory from './utils/api/factory';
import NeonAuthenticator from './utils/authenticator/neon';
import NeonAuthoriser from './utils/authoriser/neon';

/** @jsx h */

// import fontawesome and each icon that is used in the application (no longer needed to import the whole FA font set!)
import fontawesome from '@fortawesome/fontawesome';

// you need to import each individual icon (its a bug. do not combine or it'll include the whole library!)
import faSuitcase from '@fortawesome/fontawesome-free-solid/faSuitcase';
import faEye from '@fortawesome/fontawesome-free-solid/faEye';
import faUser from '@fortawesome/fontawesome-free-solid/faUser';
import faAngleDown from '@fortawesome/fontawesome-free-solid/faAngleDown';
import faChevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft';
import faChevronRight from '@fortawesome/fontawesome-free-solid/faChevronRight';
import faSignOutAlt from '@fortawesome/fontawesome-free-solid/faSignOutAlt';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import faUsers from '@fortawesome/fontawesome-free-solid/faUsers';
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope';
import faBuilding from '@fortawesome/fontawesome-free-solid/faBuilding';
import faClipboardList from '@fortawesome/fontawesome-free-solid/faClipboardList';
import faFileAlt from '@fortawesome/fontawesome-free-regular/faFileAlt';
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faEllipsisH from '@fortawesome/fontawesome-free-solid/faEllipsisH';
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload';
import faSyncAlt from '@fortawesome/fontawesome-free-solid/faSyncAlt';
import faArrowLeft from '@fortawesome/fontawesome-free-solid/faArrowLeft';

// add imported icons to global library to make them available wherever the FontAwesomeIcon component is imported
fontawesome.library.add(
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
import alertReducer from './components/Alert/reducers/alert';
import formReducer from './components/Form/reducers/form';

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
let store = createStore(rootReducer);

// configure the Neon API once, so we can use it in any component from now
// this can be fetched by calling ApiFactory.get('neon')
ApiFactory.create('neon', new NeonAuthenticator(), new NeonAuthoriser());
const api = ApiFactory.get('neon');

import Logger from './utils/logger';
import Components from './constants/Components';

// init logger
Logger.instance.notice({
    component: Components.APPLICATION,
    message: 'Open application'
});

// The authenticated route and component are dependent on the neon api instance
import AuthorisedRoute from './utils/components/AuthorisedRoute';
import Authenticated from './utils/components/Authenticated';
import Redirect from './utils/components/Redirect';

// import common css so it becomes available in all page components. also easier to have client specific css this way!
import style from '../style/global.scss'; // eslint-disable-line no-unused-vars

// Asyncroute ensures the right component' js code is loaded when user requests the route, webpack does the splitting.

/**
 * Returns the login page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} login page
 */
function getLogin() {
    return System.import('./pages/Login').then(module => module.default);
}

/**
 * Returns the inbox page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} inbox page
 */
function getInbox() {
    return System.import('./pages/Inbox').then(module => module.default);
}

/**
 * Returns the organisations page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} organisations page
 */
function getOrganisations() {
    return System.import('./pages/Organisations').then(module => module.default);
}

/**
 * Returns the tasks page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} tasks page
 */
function getTasks() {
    return System.import('./pages/Tasks').then(module => module.default);
}

/**
 * Returns the report page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} report page
 */
function getReport() {
    return System.import('./pages/Report').then(module => module.default);
}

/**
 * Returns the users page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} users page
 */
function getUsers() {
    return System.import('./pages/Users').then(module => module.default);
}

/**
 * Returns the participants page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} participants page
 */
function getParticipants() {
    return System.import('./pages/Participants').then(module => module.default);
}

/**
 * Returns the register page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} register page
 */
function getRegister() {
    return System.import('./pages/Register').then(module => module.default);
}

/**
 * Returns the error page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} error page
 */
function getError() {
    return System.import('./pages/Error').then(module => module.default);
}

/**
 * Returns the forgot password page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} forgot password page
 */
function getForgotPassword() {
    return System.import('./pages/ForgotPassword').then(module => module.default);
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
