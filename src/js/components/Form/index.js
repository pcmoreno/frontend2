import { h, Component } from 'preact';

/** @jsx h */

import Form from './components/Form/Form';
import API from '../../utils/api';
import AppConfig from '../../App.config';

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.submitForm = this.submitForm.bind(this);
        this.api = new API('neon');
        this.apiConfig = AppConfig.api.neon;
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
            this.getFormFields();
        }
    }

    getFormFields() {
        const formId = this.props.formId;

        // show loader
        document.querySelector('#spinner').classList.remove('hidden');

        // execute request
        this.api.options(
            this.apiConfig.baseUrl,
            `${this.apiConfig.endpoints.abstractSection}/${formId}`
        ).then(response => {

            // hide loader and pass the fields to the form
            document.querySelector('#spinner').classList.add('hidden');
            this.props.storeFormDataInFormsCollection(formId, response.fields);

        }).catch((/* error */) => {

            // TODO: Show error message/alert, however, below regular alert is outside the form component.
            // todo: Therefore we should implement a callback method to call the original component that this fetch failed so it can show an error.
            // This is an unexpected API error and the form cannot be loaded
            // this.actions.addAlert({ type: 'error', text: error });
        });
    }

    /**
     * Maps form fields to a payload-ready object
     * [{fieldId: id, value: val}] becomes {id:val}
     *
     * @param {array} fields - changed field array
     * @returns {{fieldId: string, value: string}} key-value pair mapped fields
     */
    mapFormField(fields) {
        const mappedFields = {};

        fields.forEach(field => {
            mappedFields[field.fieldId] = field.value;
        });

        return mappedFields;
    }

    submitForm(changedFields) {
        const formId = this.props.formId;

        return new Promise(resolve => {

            // if changedFields is empty, do nothing
            if (!changedFields || changedFields.length === 0) {
                return resolve();
            }

            // show loader
            document.querySelector('#spinner').classList.remove('hidden');

            // todo: submission can also be a PUT call, this should be configurable somewhere...
            // execute request
            return this.api.post(
                this.apiConfig.baseUrl,
                `${this.apiConfig.endpoints.abstractSection}/${formId}`,
                {
                    payload: {
                        type: 'form',
                        data: this.mapFormField(changedFields)
                    }
                }
            ).then(response => {

                // check for input validation errors form the API
                if (response.errors) {

                    // set default for if there were input validation errors but they are not specified
                    if (response.errors.length === 0) {

                        // todo: translate message
                        return resolve({
                            errors: {
                                form: 'Could not process your request.'
                            }
                        });
                    }

                    // resolve with errors, so the form component can show errors
                    return resolve(response);
                }

                // hide loader
                document.querySelector('#spinner').classList.add('hidden');

                // todo: reset form / state values
                // todo: translate message
                this.props.afterSubmit();

                // resolve with nothing by default (success)
                return resolve();

            }).catch((/* error */) => {

                // todo: translate message
                resolve({
                    errors: {
                        form: 'Could not process your request.'
                    }
                });
            });
        });
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
