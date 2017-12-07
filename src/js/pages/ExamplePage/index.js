// the container component defines actions, initial data, mapStateToProps, dispatchers

import { h, Component } from 'preact';
/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

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

    render() {
        return (
            <Example
                active={ this.props.active }
                items={ this.props.items }
                addRandomItem={ this.addRandomItem.bind(this) }
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
