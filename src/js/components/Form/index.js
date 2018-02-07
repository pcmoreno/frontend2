import { h, Component } from 'preact';
/** @jsx h */

import Form from './components/Form/Form'

export default class Index extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // retrieve formFields for this form using the Promise below
        this.getFormFields(this.props.formId);
    }

    getFormFields(formId) {
        let url = 'http://dev.ltponline.com:8001/api/v1/section/' + formId;
        document.getElementById('fetching-data-indicator').classList.add('visible');

        fetch(url, {
            method: "options"
        }).then(response => {
            document.getElementById('fetching-data-indicator').classList.remove('visible');
            if (response.ok) {
                response.json().then((response) => {
                    // this stores the retrieved form id and fields in the global state via a parent method
                    this.props.storeFormDataInFormsCollection(this.props.formId, response.fields);
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
        // pass on formid, ignoredfields, the whole forms collection, the method to retrieve the formfields if they
        // were not in forms[] yet, and the submit- and change methods for the form
        return (<Form
            formId={this.props.formId}
            ignoredFields={this.props.ignoredFields}
            forms={this.props.forms}
            storeFormDataInFormsCollection={this.props.storeFormDataInFormsCollection}
            submitForm={this.submitForm}
            changeInputValue={this.changeInputValue}
        />)
    }
}
