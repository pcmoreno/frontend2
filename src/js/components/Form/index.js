import { h, Component } from 'preact';

/** @jsx h */

import Form from './components/Form/Form';

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount() {

        // retrieve formFields if not already loaded
        let formLoaded;

        this.props.forms.forEach(form => {
            if (form.id === this.props.formId) {
                formLoaded = true;
            }
        });

        if (!formLoaded) {
            this.getFormFields(this.props.formId);
        }
    }

    getFormFields(formId) {

        // todo: extract to API layer component
        let url = this.props.baseUrl + formId;

        document.querySelector('#spinner').classList.remove('hidden');

        fetch(url, {
            method: 'options'
        }).then(response => {
            document.querySelector('#spinner').classList.add('hidden');
            if (response.ok) {
                response.json().then(responseData => {

                    // this stores the retrieved form id and fields in the global state via a parent method
                    this.props.storeFormDataInFormsCollection(this.props.formId, responseData.fields);
                }).catch(error => Promise.reject((new Error('JSON error: ' + error.message))));
                return response;
            }
            if (response.status === 404) {
                return Promise.reject((new Error('Endpoint error: ')));
            }
            return Promise.reject((new Error('HTTP error: ' + response.status)));
        }).catch(error => Promise.reject((new Error('URL error: ' + error.message))));
    }

    submitForm(changedFields) {

        // todo: extract to API layer component
        let urlEncodedString = '';

        changedFields.forEach(changedField => {
            urlEncodedString += 'form[' + changedField.fieldId + ']=' + changedField.value + '&';
        });

        urlEncodedString = urlEncodedString.slice(0, (urlEncodedString.length - 1));

        const url = this.props.baseUrl + 'organisation';

        document.querySelector('#spinner').classList.remove('hidden');

        fetch(url, {
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: urlEncodedString
        }).then(response => {
            document.querySelector('#spinner').classList.add('hidden');
            if (response.ok) {

                // response.json() is not available yet. wrap it in a promise:
                response.json().then((/* responseData */) => {

                    // todo: reset form / state values
                    this.props.afterSubmit();
                }).catch(error => Promise.reject(new Error('JSON error - ' + error)));
                return response;
            }
            if (response.status === 404) {
                return Promise.reject(new Error('API not available'));
            }
            return Promise.reject(new Error('HTTP error - ' + response.status));
        }).catch(error => Promise.reject(new Error('No such route exists - ' + error)));
    }

    render() {

        // pass on formid, ignoredfields, the whole forms collection, the method to retrieve the formfields if they
        // were not in forms[] yet, and the submit- and change methods for the form. and also the close method.
        return (<Form
            formId={this.props.formId}
            ignoredFields={this.props.ignoredFields}
            forms={this.props.forms}
            submitForm={this.submitForm}
            changeFormFieldValueForFormId={this.props.changeFormFieldValueForFormId}
            closeModal={ this.props.closeModal }
        />);
    }
}
