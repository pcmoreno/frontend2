import { h, Component } from 'preact';
/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as formActions from './actions/form'

import Form from './components/Form/Form'

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        // binds dispatch with action creators so dispatch or store does not need to be passed down to child components
        this.actions = bindActionCreators(
            Object.assign({}, formActions),
            dispatch
        );

        // introduce a local state to keep track of the form fields and input given by users
        // why local? there can be multiple forms loaded and they will overwrite values in a global state
        // the only other option would be to introduce a global state.forms collection, but that is equally troublesome
        // todo: not sure about formInputValues yet. this could be stored in formFields aswell.
        this.state = {
            formFields: [],
            formInputValues: [],
            formId: null
        }
    }

    componentDidMount() {
        this.getFormFields(this.props.formId);
    }

    getFormFields(formId) {
        let url = 'http://dev.ltponline.com:8001/api/v1/section/' + formId;
        document.getElementById('fetching-data-indicator').classList.add('visible');
        document.getElementById('fetching-data-indicator').classList.remove('visible');

        fetch(url, {
            method: "options"
        }).then(response => {
            document.getElementById('fetching-data-indicator').classList.remove('visible');
            if (response.ok) {
                response.json().then((response) => {
                    // update local state with retrieved form fields. this will reload child component that builds form.
                    this.setState({
                        formFields: response.fields
                    });
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

    submitForm(event) {
        // controlled component pattern
        // todo: add method / API call that submits the form. the URL can be build up from the formID
        console.log('form submitted', event.target);
    }

    changeInputValue(event) {
        // controlled component pattern
        // todo: add handler for changes in form input. this is by design of the controlled component pattern
        console.log('input value changed', event.target);
    }

    render() {
        return (<Form
            formId={this.props.formId}
            ignoredFields={this.props.ignoredFields}
            submitForm={this.submitForm}
            changeInputValue={this.changeInputValue}
            formFields={this.state.formFields}
        />)
    }
}

// todo: is this still needed? We dont call this action/reducer anymore and certainly dont put form config in the store
const mapStateToProps = (state) => {
    return {
        formFields: state.formReducer.formFields
    }
};

// todo: this can be ordinary output, too, if the action/reducer flow is removed
export default connect(mapStateToProps)(Index);
