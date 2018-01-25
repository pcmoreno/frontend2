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
import formReducer from './components/Form/reducers/form';

// combine into one
const rootReducer = combineReducers({
    exampleReducer,
    formReducer
});

// configure redux store with the combined reducers
let store = createStore(rootReducer);

// import common css so it becomes available in all page components. also easier to have client specific css this way!
import style from './../style/common.scss';

// Asyncroute ensures the right component' js code is loaded when user requests the route, webpack does the splitting.
function getExamplePage(){
    return System.import('./pages/ExamplePage').then(module => module.default)
}

import Header from './components/Header';

render(
    <Provider store={ store }>
        <section>
            <Header key="header" />
            <main>
                <Router>
                    <AsyncRoute path="/example" getComponent={ getExamplePage } />
                </Router>
            </main>
        </section>
    </Provider>,
    document.getElementById('application')
);

// this will show a console message depending on the environment the assets were built for
if (process.env.NODE_ENV === "production") {
    // console.log('running in production mode');
} else {
    // console.log('running in dev mode');
}
