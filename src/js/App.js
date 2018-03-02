// the root component combines reducers, sets up the store and ties routing components together

// unclear if and where this polyfill is required, but this seems to be the most common approach
import 'babel-polyfill';

import { h, render } from 'preact';
import Router from 'preact-router';
import AsyncRoute from 'preact-async-route';
/** @jsx h */

// react-redux: make the store available to all container components in the application without passing it explicitly
import { Provider } from 'react-redux'

// this defines the redux store
import { createStore, combineReducers } from 'redux'

// import all reducers
import exampleReducer from './pages/ExamplePage/reducers/example';
import organisationsReducer from './pages/OrganisationsPage/reducers/organisations';

// import app modules/utils/configs
import Logger from './utils/logger';
import AppConfig from './App.config';

// combine into one
const rootReducer = combineReducers({
    exampleReducer,
    organisationsReducer
});

// configure redux store with the combined reducers
let store = createStore(rootReducer);

// import common css so it becomes available in all page components. also easier to have client specific css this way!
import style from './../style/common.scss';

// Asyncroute ensures the right component' js code is loaded when user requests the route, webpack does the splitting.
function getExamplePage(){
    return System.import('./pages/ExamplePage').then(module => module.default)
}

function getInboxPage(){
    return System.import('./pages/InboxPage').then(module => module.default)
}

function getOrganisationsPage(){
    return System.import('./pages/OrganisationsPage').then(module => module.default)
}

function getTasksPage(){
    return System.import('./pages/TasksPage').then(module => module.default)
}

function getUsersPage(){
    return System.import('./pages/UsersPage').then(module => module.default)
}

function getParticipantsPage(){
    return System.import('./pages/ParticipantsPage').then(module => module.default)
}

import Header from './components/Header';

// not the best place, I admit. but until we know how many url's we will have. otherwise this goes to each component' state
let baseUrl = 'http://dev.ltponline.com:8001/api/v1/section/';

render(
    <Provider store={ store }>
        <section>
            <Header key="header" />
            <main>
                <Router>
                    <AsyncRoute path="/example" getComponent={ getExamplePage } baseUrl = { baseUrl } />
                    <AsyncRoute path="/inbox" getComponent={ getInboxPage } baseUrl = { baseUrl } />
                    <AsyncRoute path="/organisations" getComponent={ getOrganisationsPage } baseUrl = { baseUrl } />
                    <AsyncRoute path="/tasks" getComponent={ getTasksPage } baseUrl = { baseUrl } />
                    <AsyncRoute path="/users" getComponent={ getUsersPage } baseUrl = { baseUrl } />
                    <AsyncRoute path="/participants" getComponent={ getParticipantsPage } baseUrl = { baseUrl } />
                </Router>
            </main>
        </section>
    </Provider>,
    document.getElementById('application')
);

if (process.env.NODE_ENV === "production") {
    // console.log('running in production mode');
} else {
    // console.log('running in dev mode');
}
