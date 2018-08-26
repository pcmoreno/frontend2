import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as alertActions from './../../components/Alert/actions/alert';
import * as formActions from './actions/form';
import Form from './components/Form/Form';
import ApiFactory from '../../utils/api/factory';
import FormMethod from './components/Form/constants/FormMethod';
import translator from '../../utils/translator';
import FormErrors from './constants/FormErrors';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, alertActions, formActions),
            dispatch
        );

        this.submitForm = this.submitForm.bind(this);
        this.changeFormFieldValueForFormId = this.changeFormFieldValueForFormId.bind(this);
        this.resetChangedFieldsForFormId = this.resetChangedFieldsForFormId.bind(this);

        this.api = ApiFactory.get('neon');
        this.i18n = translator(this.props.languageId, 'form');
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
        let slug;

        changedFields.forEach((field, index) => {
            if (field.fieldId === 'uuid') {
                slug = field.value;

                // since the uuid will now be part of the endpoint call, it can be removed from changedFields
                // note that if the (first) submit didnt work it will automatically return to changeFields
                changedFields.splice(index, 1);
            }
        });

        const sectionId = this.props.sectionId;
        const method = this.props.method;

        // only post, put and delete calls for now
        if (method !== FormMethod.CREATE_SECTION &&
            method !== FormMethod.UPDATE_SECTION &&
            method !== FormMethod.DELETE_SECTION) {
            return null;
        }

        return new Promise(resolve => {

            // if changedFields is empty, do nothing
            if (!changedFields || changedFields.length === 0) {
                return resolve();
            }

            // show loader
            document.querySelector('#spinner').classList.remove('hidden');

            let endpoint = `${this.api.getEndpoints().abstractSection}/${sectionId}`;

            if (slug) {
                endpoint = this.api.getEndpoints().updateAbstractSection;
            }

            // execute request
            return this.api[method](
                this.api.getBaseUrl(),
                endpoint,
                {
                    payload: {
                        type: 'form',
                        data: this.mapFormField(changedFields)
                    },
                    urlParams: {
                        identifiers: {
                            section: sectionId,
                            slug
                        },
                        parameters: {
                            fields: 'id,uuid'
                        }
                    }
                }
            ).then(response => {

                // check for input validation errors form the API
                if (response.errors) {

                    // set default for if there were input validation errors but they are not specified
                    if (response.errors.length === 0) {

                        return resolve({
                            errors: {
                                form: FormErrors.COULD_NOT_PROCESS_REQUEST
                            }
                        });
                    }

                    // resolve with errors, so the form component can show errors
                    return resolve(response);
                }

                // hide loader
                document.querySelector('#spinner').classList.add('hidden');
                this.props.afterSubmit(response);

                // resolve with nothing by default (success)
                return resolve();

            }).catch(error => {

                if (error && error.errors) {
                    return resolve(error);
                }

                return resolve({
                    errors: {
                        form: FormErrors.COULD_NOT_PROCESS_REQUEST
                    }
                });
            });
        });
    }

    /**
     * Changes the stored field value for the given field and form id
     * @param {string} formId - form id
     * @param {string} formInputId - field key/id
     * @param {string|number|boolean} formInputValue - input value
     * @returns {undefined}
     */
    changeFormFieldValueForFormId(formId, formInputId, formInputValue) {

        // react controlled component pattern takes over the built-in form state when input changes
        this.actions.changeFormFieldValueForFormId(formId, formInputId, formInputValue);
    }

    /**
     * Resets all field values for the given form id
     * @param {string} formId - formId
     * @returns {undefined}
     */
    resetChangedFieldsForFormId(formId) {
        this.actions.resetChangedFieldsForFormId(formId);
    }

    render() {
        const {
            formId,
            sectionId,
            hiddenFields,
            disabledFields,
            forms, // from Form reducer
            headerText,
            submitButtonText,
            closeModal,
            translationKeysOverride,
            languageId,
            method
        } = this.props;

        // to ensure the i18n is updated when the languageId changes
        this.i18n = translator(languageId, 'form');

        return (<Form
            formId={ formId }
            sectionId={ sectionId }
            hiddenFields={ hiddenFields }
            disabledFields={ disabledFields }
            forms={ forms }
            submitForm={ this.submitForm }
            headerText={ headerText }
            submitButtonText={ submitButtonText }
            method={ method }
            changeFormFieldValueForFormId={ this.changeFormFieldValueForFormId }
            resetChangedFieldsForFormId={ this.resetChangedFieldsForFormId }
            closeModal={ closeModal }
            i18n={ this.i18n }
            translationKeysOverride={ translationKeysOverride }
        />);
    }
}

const mapStateToProps = state => ({
    forms: state.formReducer.forms
});

export default connect(mapStateToProps)(Index);
