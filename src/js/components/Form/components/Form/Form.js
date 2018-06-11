import { h, Component } from 'preact';

/** @jsx h */

import DateTimeField from './components/DateTimeField/DateTimeField';
import TextInput from './components/TextInput/TextInput';
import Choice from './components/Choice/Choice';
import style from './style/form.scss';
import Relationship from './components/Relationship/Relationship';
import Email from './components/Email/Email';
import TextArea from './components/TextArea/TextArea';
import * as fieldType from './constants/FieldTypes';
import Logger from '../../../../utils/logger';
import Utils from '../../../../utils/utils';

/** Preact Form Component v1.0
 *
 * it is now possible for fields to be hidden. in such case do not add it to the ignoredFields.
 * each entry can have its value set to either a static text or, for example, a state key
 *
 * @example
 * hiddenFields={[{ name: 'uuid', value: pathNodes[pathNodes.length - 1].name }]}
 *
 * It's also possible to override translation keys
 * @example
 * translationKeysOverride={{fieldHandle: {label: 'new_key', placeholder: 'new_key'} }}
 *
 **/

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.collectFormData = this.collectFormData.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.resetFormFields = this.resetFormFields.bind(this);

        // UI state, with fields as key value pair field and message
        this.localState = {
            errors: {
                form: '',
                fields: {}
            },
            form: {
                disabled: false
            }
        };

        this.translationKeysOverride = this.props.translationKeysOverride || [];
        this.i18n = this.props.i18n;
        this.logger = Logger.instance;
    }

    convertPlaceholderTranslationKey(handle) {
        return `form_${Utils.camelCaseToSnakeCase(handle)}_placeholder`;
    }

    convertLabelTranslationKey(handle) {
        return `form_${Utils.camelCaseToSnakeCase(handle)}`;
    }

    buildInputType(formFieldOptions) {
        const type = formFieldOptions.type;
        const handle = formFieldOptions.handle;
        const value = formFieldOptions.value ? formFieldOptions.value : '';
        let label = formFieldOptions.form.all.label || '';
        let placeholder = '';

        // Check if the translation key for a field is overwritten or there is a generic translation available
        // if not, the label will remain the returned label from the api
        if (this.translationKeysOverride[handle] && this.translationKeysOverride[handle].label) {
            label = this.i18n[this.translationKeysOverride[handle].label];

        } else if (this.i18n[this.convertLabelTranslationKey(handle)]) {
            label = this.i18n[this.convertLabelTranslationKey(handle)];
        }

        // Check if the translation key for a field is overwritten or there is a generic translation available
        // if not, the placeholder will be set to the one returned from the api
        if (this.translationKeysOverride[handle] && this.translationKeysOverride[handle].placeholder) {
            placeholder = this.i18n[this.translationKeysOverride[handle].placeholder];

        } else if (this.i18n[this.convertPlaceholderTranslationKey(handle)]) {
            placeholder = this.i18n[this.convertPlaceholderTranslationKey(handle)];

        } else if (formFieldOptions.form.all.attr && formFieldOptions.form.all.attr.placeholder) {
            placeholder = formFieldOptions.form.all.attr.placeholder;
        }

        switch (type) {
            case fieldType.DATE_TIME_FIELD:
                return (<DateTimeField
                    currentForm={this.localState}
                    handle={handle}
                    label={label}
                    value={value}
                    formId={this.props.formId}
                    onChange={this.handleChange}/>);
            case fieldType.TEXT_INPUT:
                return (<TextInput
                    currentForm={this.localState}
                    options={formFieldOptions}
                    handle={handle}
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    formId={this.props.formId}
                    onChange={this.handleChange}
                />);
            case fieldType.TEXT_AREA:
                return (<TextArea
                    currentForm={this.localState}
                    handle={handle}
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    formId={this.props.formId}
                    onChange={this.handleChange}/>);
            case fieldType.CHOICE:
                return (<Choice
                    currentForm={this.localState}
                    options={formFieldOptions}
                    handle={handle}
                    label={label}
                    value={value}
                    formId={this.props.formId}
                    onChange={this.handleChange}
                />);
            case fieldType.RELATIONSHIP:
                return (<Relationship
                    currentForm={ this.localState }
                    handle={handle}
                    options={formFieldOptions}
                    label={label}
                    value={value}
                    formId={this.props.formId}
                    onChange={this.handleChange}
                />);
            case fieldType.EMAIL:
                return (<Email
                    currentForm={this.localState}
                    handle={handle}
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    formId={this.props.formId}
                    onChange={this.handleChange}
                />);
            case fieldType.UUID:
                return null; // not implemented yet
            case fieldType.SLUG:
                return null; // not implemented yet
            case fieldType.INTEGER:
                return null; // not implemented yet
            default:
                this.logger.error({
                    component: 'form',
                    message: `${this.i18n.form_input_type_could_not_be_determined} ${type}`
                });
                return null;
        }
    }

    handleChange(event) {
        event.preventDefault();

        const target = event.currentTarget;

        // controlled component pattern: form state is kept in state and persisted across page components
        const formId = this.props.formId;
        const formInputId = event.currentTarget.id;

        this.props.changeFormFieldValueForFormId(
            formId,
            formInputId,
            this.getFieldValue(target)
        );
    }

    getFieldValue(target) {
        let formInputValue;

        // if selectedOptions ad data-array are set, send the data as an array
        if (target.getAttribute('data-array') !== null &&
            target.getAttribute('data-array') === 'true' &&
            typeof target.selectedOptions !== 'undefined'
        ) {
            formInputValue = Array.from(target.selectedOptions).map(option => option.value);
        } else {
            formInputValue = target.value;
        }

        return formInputValue;
    }

    collectFormData(event) {

        const formId = this.props.formId;

        // clear the existing error messages
        this.resetErrorMessages();

        // just to be on the safe side, disable any erroneous submitting of the form data
        event.preventDefault();

        const changedFields = [];
        let ableToSubmit = true;

        if (this.props.hiddenFields) {

            this.props.hiddenFields.forEach(hiddenField => {

                // adding hidden field values to state
                this.props.changeFormFieldValueForFormId(
                    this.props.formId,
                    hiddenField.name,
                    hiddenField.value
                );
            });
        }

        // extract values for each non-ignored field from state. in case no value exists, extract it in other ways
        this.props.forms.forEach(form => {
            if (form.id === this.props.formId) {
                form.formFields.forEach(field => {

                    // the first key is the field id (or name)
                    const name = Object.keys(field)[0];
                    let fieldId, value;

                    if (this.props.ignoredFields.indexOf(name) === -1) {
                        if (!field[name].value || field[name].value.length === 0) {

                            // value is not in the formFields state. Perhaps it needs to be extracted from a 'special'
                            // form element. see if the element can be matched and its value extracted.
                            switch (field[name].type) {

                                case fieldType.CHOICE: {

                                    // pushing initial value from dropdown to state so it can be submitted
                                    const fieldName = Object.keys(field);
                                    const choices = [];

                                    fieldId = (Object.keys(field)[0]);

                                    // extract initial value from state
                                    for (const key in field[fieldName].form.all.choices) {
                                        if (field[fieldName].form.all.choices.hasOwnProperty(key)) {
                                            choices.push(field[fieldName].form.all.choices[key]);
                                            break;
                                        }
                                    }

                                    // the first value is the initial value
                                    value = choices[0];

                                    break;
                                }

                                default: {

                                    // for all other form element types, simply attempt to get its value
                                    if (document.querySelector(`#${formId}_${name}`)) {
                                        fieldId = name;
                                        value = document.querySelector(`#${formId}_${name}`).value;
                                    } else {

                                        // necessary fields were not fount, do not submit and log an error
                                        ableToSubmit = false;
                                        this.logger.error({
                                            component: 'form',
                                            message: `${this.i18n.form_could_not_find_form_field} ${name}`
                                        });
                                    }
                                }
                            }
                        } else {

                            // extract value from state
                            fieldId = name;
                            value = field[name].value;
                        }

                        // push field value to changedFields so it can be submitted
                        if (fieldId && value) {

                            // in case the 'to' property is set, overwrite the default field name with it
                            if (field[name].to) {
                                fieldId = field[name].to;
                            }

                            // relationship fields require an override in case 'as' is set
                            if (field[name].as && field[name].type === fieldType.RELATIONSHIP) {
                                fieldId = field[name].as;
                            }

                            changedFields.push({ fieldId, value });
                        } else {

                            if (field[name].form.all.required) {
                                ableToSubmit = false;

                                this.handleErrorMessages(
                                    { [name]: `${this.i18n.form_value_can_not_be_empty}` }
                                );
                            }
                        }
                    }
                });
            }
        });

        if (ableToSubmit) {

            // disable the submit button
            this.setSubmissionState(true);

            // submit the changed fields
            this.props.submitForm(changedFields).then(response => {
                if (response && response.errors) {

                    // hide loader and handle error messages for fields
                    document.querySelector('#spinner').classList.add('hidden');
                    this.handleErrorMessages(response.errors);

                    // re-enable the submit button
                    this.setSubmissionState(false);
                } else {

                    // consider this a successful call
                    document.querySelector('#spinner').classList.add('hidden');

                    // re-enable the submit button
                    this.setSubmissionState(false);

                    this.handleClose();
                }
            });
        } else {

            // show an error (unexpected) as form field values could not be fetched
            this.handleErrorMessages({
                form: this.i18n.form_could_not_process_your_request
            });
        }
    }

    /**
     * Sets the 'disabled' state of the button to submit the form
     *
     * @param {boolean} submissionState - determines whether button should be disabled
     * @returns {undefined}
     */
    setSubmissionState(submissionState) {
        this.localState.form.disabled = submissionState;
        this.setState(this.localState);
    }

    /**
     * Handles error messages that are given as a key (field name) and value (message) on the form.
     * Generic form errors will be shown when the key is 'form'
     *
     * @param {{key:value, key: [value, value]}} errors - error key value pairs
     * @returns {undefined}
     */
    handleErrorMessages(errors) {
        const newState = Object.assign({}, this.localState);

        for (let key in errors) {
            if (errors.hasOwnProperty(key)) {

                // check for form error
                if (key === 'form') {
                    newState.errors.form = errors[key];
                    continue;
                }

                // check whether field error is array or string and get the first item
                if (Array.isArray(errors[key])) {
                    newState.errors.fields[key] = errors[key][0];
                } else {
                    newState.errors.fields[key] = errors[key];
                }
            }
        }

        // change the state to trigger the re-rendering
        this.setState(newState);
    }

    /**
     * Resets the error messages for this form and fields
     *
     * @returns {undefined}
     */
    resetErrorMessages() {
        const newState = Object.assign({}, this.localState);

        // reset form error
        delete newState.errors.form;

        for (const key in newState.errors.fields) {
            if (newState.errors.fields.hasOwnProperty(key)) {
                delete newState.errors.fields[key];
            }
        }

        // change the state to trigger the re-rendering
        this.setState(newState);
    }

    /**
     * Resets the form fields for this form
     *
     * @returns {undefined}
     */
    resetFormFields() {
        this.props.resetChangedFieldsForFormId(this.props.formId);
    }

    /**
     * Handle closes in all situations (clicking outside the modal, or on one of the two close buttons)
     * @returns {undefined}
     */
    handleClose() {

        // only close when the form was not disabled (not in submission state)
        if (!this.localState.form.disabled) {

            // reset the form and field error messages
            this.resetFormFields();
            this.resetErrorMessages();

            // executes the provided close method
            this.props.closeModal();
        }
    }

    render() {
        const { forms, ignoredFields, hiddenFields, formId, headerText, submitButtonText } = this.props;

        let formFields = this.i18n.form_loading_form;
        const hiddenFormFields = [];

        // default the submit button to null until the form data is loaded and fields are identified
        let formSubmitButton = null;

        // since all forms are passed on, find the one that matches the given formId
        if (forms && forms.length > 0) {
            forms.forEach(form => {
                if (form.id === formId) {

                    formFields = form.formFields.map(formField => {
                        let buildField;

                        // only work with non-ignored fields
                        if (ignoredFields.indexOf(Object.keys(formField)[0]) === -1) {
                            const name = Object.keys(formField);
                            const formFieldOptions = formField[name];
                            let type = formField[name].type;

                            // only work with non-hidden fields
                            if (hiddenFields) {
                                hiddenFields.forEach(hiddenField => {
                                    if (hiddenField.name.toString() === name.toString()) {
                                        type = fieldType.HIDDEN;
                                    }
                                });
                            }

                            if (type !== fieldType.HIDDEN) {
                                buildField = this.buildInputType(formFieldOptions);
                            }
                        }

                        return buildField;
                    });

                    formSubmitButton = <button
                        className={ 'action_button' }
                        type={ 'button' }
                        value={ this.props.i18n.form_submit }
                        onClick={ this.collectFormData }
                        disabled={ this.localState.form.disabled }
                    >{ submitButtonText }</button>;
                }
            });
        }

        return (<section role="dialog" >
            <section tabIndex="0" className={ style.background } onClick={ this.handleClose } role="button" />
            <form id={formId} noValidate>
                <header>
                    <button type="button" value="Close" onClick={ this.handleClose }><span aria-hidden="true">×</span></button>
                    <h3>{ headerText }</h3>
                    <span className={ `${style.errorMessage}` }>{ this.localState.errors.form }</span>
                </header>
                <main>
                    { formFields }
                    { hiddenFormFields }
                </main>
                <footer>
                    <nav>
                        <button
                            className={ 'action_button action_button__secondary' }
                            type={ 'button' }
                            value={ 'Close' }
                            onClick={ this.handleClose }
                        >
                            { this.i18n.form_close }
                        </button>
                        { formSubmitButton }
                    </nav>
                </footer>
            </form>
        </section>);
    }
}
