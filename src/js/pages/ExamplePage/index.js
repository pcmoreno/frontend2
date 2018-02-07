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

        // couple local state (including actions) with this method
        this.storeFormDataInFormsCollection = this.storeFormDataInFormsCollection.bind(this);
    }

    componentWillMount() {
        // update the page title for accessibility reasons
        document.title = 'Example';
    }

    componentDidMount() {
        // get items for first time
        this.getItems();
    }

    // pass this on the form
    storeFormDataInFormsCollection(formId, formFields) {
        // dispatch action to update forms[] state with new form data (will overwrite for this id)
        this.actions.storeFormDataInFormsCollection(formId, formFields);
    }

    // note: since this is the container component, everything that deals with data should be defined right here
    // this can be wrapped inside an action, but since its asynchronous you'd need middleware like thunk
    // alternatively define a method that is asynchronous itself and call the action whenever the request was successful

    getItems() {
        let url = 'http://dev.ltponline.com:8001/api/v1/section/organisation?fields=id,organisationName';
        document.getElementById('fetching-data-indicator').classList.add('visible');

        fetch(url, {
            method: "get"
        }).then(response => {
            document.getElementById('fetching-data-indicator').classList.remove('visible');
            if (response.ok) {
                // response.json() is not available yet. wrap it in a promise:
                response.json().then((response) => {
                    this.actions.getItems(response);
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
        document.getElementById('fetching-data-indicator').classList.add('visible');

        fetch(url, {
            method: "post",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'form[organisationName]=TestItem-'+parseInt(Math.random()*100)
        }).then(response => {
            document.getElementById('fetching-data-indicator').classList.remove('visible');
            if (response.ok) {
                // response.json() is not available yet. wrap it in a promise:
                response.json().then((response) => {
                    // no need to trigger a new action (unless we want ghosting) so instead fetch new items:
                    this.getItems();
                }).catch(error => {
                    return Promise.reject(console.log('JSON error - ' + error));
                });
                return response;
            }
            if (response.status === 404) {
                return Promise.reject(console.log('API not available'));
            }
            return Promise.reject(console.log('HTTP error - ' + response.status));
        }).catch(error => {
            return Promise.reject(console.log('No such route exists - ' + error));
        });
    }

    render() {
        return (
            <Example
                active={ this.props.active }
                items={ this.props.items }
                forms={this.props.forms}
                addItem={ this.addItem.bind(this) }
                getItems={ this.getItems.bind(this) }
                storeFormDataInFormsCollection={ this.storeFormDataInFormsCollection }
            />
        )
    }
}

// todo: the forms collection is now closely coupled to the examplepage component. can this be changed so it becomes
// todo: more global and all forms will live in a more global forms: [] collection?
// todo: wait whut. is that even needed since this is an SPA. there is only one store. its just the action
// todo: and reducer set up that needs to be copied across all page components (?)
// todo: investigate how the root component can facilitate in defining the state
const mapStateToProps = (state) => {
    return {
        active: state.exampleReducer.active,
        items: state.exampleReducer.items,
        forms: state.exampleReducer.forms
    }
};

export default connect(mapStateToProps)(Index);

