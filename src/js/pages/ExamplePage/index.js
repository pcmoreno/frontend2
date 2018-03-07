// the container component defines actions, initial data, mapStateToProps, dispatchers

import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as exampleActions from './actions/example';

import Example from './components/Example/Example';

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
        this.changeFormFieldValueForFormId = this.changeFormFieldValueForFormId.bind(this);
    }

    storeFormDataInFormsCollection(formId, formFields) {

        // todo: investigate extracting this to helper function since this will be copied to all page components

        // dispatch action to update forms[] state with new form data (will overwrite for this id)
        this.actions.storeFormDataInFormsCollection(formId, formFields);
    }

    changeFormFieldValueForFormId(formId, formInputId, formInputValue) {

        // todo: investigate extracting this to helper function since this will be copied to all page components

        this.actions.changeFormFieldValueForFormId(formId, formInputId, formInputValue);
    }

    componentWillMount() {

        // update the page title for accessibility reasons
        document.title = 'Example';
    }

    componentDidMount() {

        // get items for first time
        this.getItems();
    }

    // note: since this is the container component, everything that deals with data should be defined right here
    // this can be wrapped inside an action, but since its asynchronous you'd need middleware like thunk
    // alternatively define a method that is asynchronous itself and call the action whenever the request is successful:
    getItems() {
        let url = this.props.baseUrl + 'organisation?fields=id,organisationName';

        document.getElementById('spinner').classList.add('visible');

        fetch(url, {
            method: 'get'
        }).then(response => {
            document.getElementById('spinner').classList.remove('visible');
            if (response.ok) {

                // response.json() is not available yet. wrap it in a promise:
                response.json().then(responseData => {
                    this.actions.getItems(responseData);
                }).catch(error => Promise.reject(new Error('JSON error: ' + error.message)));
                return response;
            }
            if (response.status === 404) {
                return Promise.reject(new Error('Endpoint error: '));
            }
            return Promise.reject(new Error('HTTP error: ' + response.status));
        }).catch(error => Promise.reject(new Error('URL error: ' + error.message)));
    }

    render() {
        return (
            <Example
                active={ this.props.active }
                items={ this.props.items }
                forms={this.props.forms}
                baseUrl={ this.props.baseUrl }
                getItems={ this.getItems.bind(this) }
                storeFormDataInFormsCollection={ this.storeFormDataInFormsCollection }
                changeFormFieldValueForFormId={ this.changeFormFieldValueForFormId }
            />
        );
    }
}

const mapStateToProps = state => ({
    active: state.exampleReducer.active,
    items: state.exampleReducer.items,
    forms: state.exampleReducer.forms
});

export default connect(mapStateToProps)(Index);
