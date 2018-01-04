// the container component defines actions, initial data, mapStateToProps, dispatchers

import { h, Component } from 'preact';
/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
let qs = require('qs');
import * as exampleActions from './actions/example'

import Example from './components/Example/Example'

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        // binds dispatch with action creators so dispatch or store does not need to be passed down to child components
        this.actions = bindActionCreators(
            Object.assign({}, exampleActions),
            dispatch
        );
    }

    componentWillMount() {
        // update the page title for accessibility reasons
        document.title = 'Example';
    }

    componentDidMount() {
        // fetching initial data for this component (the same function as called when getItems button clicked manually)
        this.getItems();
    }

    // note: since this is the container component, everything that deals with data should be defined right here
    // this can be wrapped inside an action, but since its asynchronous you'd need middleware like thunk
    // alternatively define a method that is asynchronous itself and call the action whenever the request was successful

    addRandomItem() {
        let url = 'https://httpbin.org/uuid';


        fetch(url, {mode: "cors", method: "get"}).then(response => {
            if (response.ok) {
                // response.json() is not available yet. wrap it in a promise:
                response.json().then((response) => {
                    this.actions.addRandomItem(response.uuid);

                }).catch(error => {
                    return Promise.reject(console.log('JSON error: ' + error.message));
                });
                return response;
            }
            if (response.status === 404) {
                return Promise.reject(console.log('Endpoint error: '));
            }
            return Promise.reject(console.log('HTTP error: ' + response.status));
        }).catch(error => {
            return Promise.reject(console.log('URL error: ' + error.message));
        });
    }

    getItems() {
        let url = 'http://dev.ltponline.com:8001/api/v1/section/organisation?fields=id,organisationName';
        console.log('show a spinner');

        fetch(url, {mode: "cors", method: "get"}).then(response => {
            if (response.ok) {
                // response.json() is not available yet. wrap it in a promise:
                response.json().then((response) => {
                    this.actions.getItems(response);
                    console.log('hide the spinner');
                }).catch(error => {
                    return Promise.reject(console.log('JSON error: ' + error.message));
                });
                return response;
            }
            if (response.status === 404) {
                return Promise.reject(console.log('Endpoint error: '));
            }
            return Promise.reject(console.log('HTTP error: ' + response.status));
        }).catch(error => {
            return Promise.reject(console.log('URL error: ' + error.message));
        });
    }

    addItem() {
        let url = 'http://dev.ltponline.com:8001/api/v1/section/organisation';
        let form = [];
        form['organisationName'] = 'nieuwe-organisatie-' + Math.round(Math.random()*100);

        // todo: figure out how to pass on option 'credentials: "include"' for better security

        fetch(url, {
            mode: "cors",
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
            referrer: "http://127.0.0.1:9002",
            referrerPolicy: "origin-when-cross-origin",
            body: qs.stringify(form)
        }).then(response => {
            console.log(response);

            if (response.ok) {
                // response.json() is not available yet. wrap it in a promise:
                response.json().then((response) => {
                    console.log('calling the action');

                    this.actions.addItem(response.uuid);
                }).catch(error => {
                    return Promise.reject(console.log('JSON error: ' + error));
                });
                return response;
            }
            if (response.status === 404) {
                return Promise.reject(console.log('Endpoint error'));
            }
            return Promise.reject(console.log('HTTP error: ' + response.status));
        }).catch(error => {
            return Promise.reject(console.log('URL error: ' + error));
        });
    }

    render() {
        return (
            <Example
                active={ this.props.active }
                items={ this.props.items }
                addRandomItem={ this.addRandomItem.bind(this) }
                addItem={ this.addItem.bind(this) }
                getItems={ this.getItems.bind(this) }
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        active: state.exampleReducer.active,
        items: state.exampleReducer.items
    }
};

export default connect(mapStateToProps)(Index);

