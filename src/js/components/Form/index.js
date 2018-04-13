import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as alertActions from './../../components/Alert/actions/alert';
import Form from './components/Form/Form';
import ApiFactory from '../../utils/api/factory';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, alertActions),
            dispatch
        );

        this.submitForm = this.submitForm.bind(this);

        this.api = ApiFactory.get('neon');
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

            // disabled retrieving form options, since it is broken right now
            // this.getFormFields();
        }
    }

    getFormFields() {
        const formId = this.props.formId;

        // show loader
        document.querySelector('#spinner').classList.remove('hidden');

        this.api.options(
            this.api.getBaseUrl(),
            `${this.api.getEndpoints().abstractSection}/${formId}`
        ).then(response => {

            // hide loader and pass the fields to the form
            document.querySelector('#spinner').classList.add('hidden');
            this.props.storeFormDataInFormsCollection(formId, response.fields);
        }).catch((/* error */) => {
            // This is an unexpected API error and the form cannot be loaded
            this.actions.addAlert({ type: 'error', text: 'An error occurred while processing your request.' });
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
                this.api.getBaseUrl(),
                `${this.api.getEndpoints().abstractSection}/${formId}`,
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

export default connect()(Index);
