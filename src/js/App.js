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

// examples from here: https://github.com/aws/aws-amplify/tree/amazon-cognito-identity-js%402.0.1/packages/amazon-cognito-identity-js
// import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js';

// const poolData = {
//     UserPoolId: 'eu-central-1_eeBtQkabk', // development user pool id
//     ClientId: '7i9ckoogpksm27r7llfagsgfgv' // development client id
// };

// const poolData = {
//     UserPoolId: 'eu-central-1_d9eQcCiqa', // acceptance user pool id
//     ClientId: '5jm7sr5838e4350vnm3oumhagt' // acceptance client id
// };
//
// const poolData = {
//     UserPoolId: 'eu-central-1_vrgRcljuW', // prod user pool id
//     ClientId: '2dhqtd611jq2f2ig5hs47qfvl9' // prod client id
// };

// const userPool = new CognitoUserPool(poolData);
//
// const attributeList = [];
//
// const dataEmail = {
//     Name: 'email',
//     Value: 'email@mydomain.com'
// };
//
// const dataPhoneNumber = {
//     Name: 'phone_number',
//     Value: '+15555555555'
// };
// const attributeEmail = new CognitoUserAttribute(dataEmail);
// const attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
//
// attributeList.push(attributeEmail);
// attributeList.push(attributePhoneNumber);
//
// let cognitoUser;
//
// userPool.signUp('username', 'password', attributeList, null, function(err, result){
//     if (err) {
//         return;
//     }
//     cognitoUser = result.user;
//     console.log('user name is ' + cognitoUser.getUsername());
// });


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
import exampleReducer from './pages/Example/reducers/example';
import organisationsReducer from './pages/Organisations/reducers/organisations';
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
function getExample() {
    return System.import('./pages/Example').then(module => module.default);
}

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

import Header from './components/Header';

render(
    <Provider store={ store }>
        <section id="layout">
            <Header key="header"/>
            <main>
                <Alert />
                <Router>
                    <AsyncRoute path="/example" getComponent={ getExample } />
                    <AsyncRoute path="/login" getComponent={ getLogin } />
                    <AsyncRoute path="/inbox" getComponent={ getInbox } />
                    <AsyncRoute path="/organisations" getComponent={ getOrganisations } />
                    <AsyncRoute path="/tasks" getComponent={ getTasks } />
                    <AsyncRoute path="/users" getComponent={ getUsers } />
                    <AsyncRoute path="/participants" getComponent={ getParticipants } />
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
