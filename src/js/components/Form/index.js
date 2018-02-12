import { h, Component } from 'preact';
/** @jsx h */

import Form from './components/Form/Form'

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount() {
        // retrieve formFields if not already loaded
        let formLoaded;

        this.props.forms.map(form => {
            if (form.id === this.props.formId) {
                formLoaded = true;
            }
        });

        if (!formLoaded) {
            this.getFormFields(this.props.formId);
        }
    }

    getFormFields(formId) {
        let url = this.props.baseUrl + formId;
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

    submitForm(changedFields) {
        let urlEncodedString = '';
        changedFields.map(changedField => {
            urlEncodedString += 'form[' + changedField.fieldId + ']=' + changedField.value + '&';
        });

        urlEncodedString = urlEncodedString.substr(0,(urlEncodedString.length-1));

        let url = this.props.baseUrl + 'organisation';
        document.getElementById('fetching-data-indicator').classList.add('visible');

        fetch(url, {
            method: "post",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: urlEncodedString
        }).then(response => {
            document.getElementById('fetching-data-indicator').classList.remove('visible');
            if (response.ok) {
                // response.json() is not available yet. wrap it in a promise:
                response.json().then((response) => {
                    // todo: reset form / state values
                    this.props.afterSubmit();
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
        // pass on formid, ignoredfields, the whole forms collection, the method to retrieve the formfields if they
        // were not in forms[] yet, and the submit- and change methods for the form
        return (<Form
            formId={this.props.formId}
            ignoredFields={this.props.ignoredFields}
            forms={this.props.forms}
            submitForm={this.submitForm}
            changeFormFieldValueForFormId={this.props.changeFormFieldValueForFormId}
            active={this.props.active}
            closeModal={ this.props.closeModal }
        />)
    }
}
