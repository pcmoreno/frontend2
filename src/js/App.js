/* global System:true */

// the root component combines reducers, sets up the store and ties routing components together

// unclear if and where this polyfill is required, but this seems to be the most common approach
import 'babel-polyfill';

import { h, render } from 'preact';
import Router from 'preact-router';
import AsyncRoute from 'preact-async-route';
import Alert from './components/Alert';

/** @jsx h */

// import fontawesome and each icon that is used in the application (no longer needed to import the whole FA font set!)
import fontawesome from '@fortawesome/fontawesome';

// you need to import each individual icon (its a bug. do not combine or it'll include the whole library!)
import faSuitcase from '@fortawesome/fontawesome-free-solid/faSuitcase';
import faEye from '@fortawesome/fontawesome-free-solid/faEye';
import faUser from '@fortawesome/fontawesome-free-solid/faUser';
import faAngleDown from '@fortawesome/fontawesome-free-solid/faAngleDown';
import faSignOutAlt from '@fortawesome/fontawesome-free-solid/faSignOutAlt';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import faUsers from '@fortawesome/fontawesome-free-solid/faUsers';
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope';
import faBuilding from '@fortawesome/fontawesome-free-solid/faBuilding';
import faClipboard from '@fortawesome/fontawesome-free-solid/faClipboard';

// add imported icons to global library to make them available wherever the FontAwesomeIcon component is imported
fontawesome.library.add(
    faSuitcase,
    faEye,
    faUser,
    faAngleDown,
    faSignOutAlt,
    faSpinner,
    faUsers,
    faBuilding,
    faEnvelope,
    faClipboard
);

// react-redux: make the store available to all container components in the application without passing it explicitly
import { Provider } from 'react-redux';

// this defines the redux store
import { createStore, combineReducers } from 'redux';

// import all reducers
import exampleReducer from './pages/ExamplePage/reducers/example';
import organisationsReducer from './pages/OrganisationsPage/reducers/organisations';
import alertReducer from './components/Alert/reducers/alert';

// combine into one
const rootReducer = combineReducers({
    exampleReducer,
    organisationsReducer,
    alertReducer
});

// configure redux store with the combined reducers
let store = createStore(rootReducer);

// import common css so it becomes available in all page components. also easier to have client specific css this way!
import style from '../style/global.scss'; // eslint-disable-line no-unused-vars

// Asyncroute ensures the right component' js code is loaded when user requests the route, webpack does the splitting.

/**
 * Returns the example page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} example page
 */
function getExamplePage() {
    return System.import('./pages/ExamplePage').then(module => module.default);
}

/**
 * Returns the inbox page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} inbox page
 */
function getInboxPage() {
    return System.import('./pages/InboxPage').then(module => module.default);
}

/**
 * Returns the organisations page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} organisations page
 */
function getOrganisationsPage() {
    return System.import('./pages/OrganisationsPage').then(module => module.default);
}

/**
 * Returns the tasks page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} tasks page
 */
function getTasksPage() {
    return System.import('./pages/TasksPage').then(module => module.default);
}

/**
 * Returns the users page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} users page
 */
function getUsersPage() {
    return System.import('./pages/UsersPage').then(module => module.default);
}

/**
 * Returns the participants page
 * @returns {any | Promise | * | PromiseLike<T> | Promise<T>} participants page
 */
function getParticipantsPage() {
    return System.import('./pages/ParticipantsPage').then(module => module.default);
}

import Header from './components/Header';

render(
    <Provider store={ store }>
        <section id="layout">
            <Header key="header" />
            <main>
                <Alert />
                <Router>
                    <AsyncRoute path="/example" getComponent={ getExamplePage } />
                    <AsyncRoute path="/inbox" getComponent={ getInboxPage } />
                    <AsyncRoute path="/organisations" getComponent={ getOrganisationsPage } />
                    <AsyncRoute path="/tasks" getComponent={ getTasksPage } />
                    <AsyncRoute path="/users" getComponent={ getUsersPage } />
                    <AsyncRoute path="/participants" getComponent={ getParticipantsPage } />
                </Router>
            </main>
        </section>
    </Provider>,
    document.querySelector('body'),
    document.querySelector('body').firstChild

);

if (process.env.NODE_ENV === 'production') {

    // console.log('running in production mode');
} else {

    // console.log('running in dev mode');
}
