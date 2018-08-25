import { h, Component } from 'preact';
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
import FormErrors from '../../constants/FormErrors';
import FormMethod from './constants/FormMethod';

/** @jsx h */

/** Form Component
 *
 * Full example of the usage of the form component below
 * @example
 * <Form
 *     formId={ 'addEntity' } // unique id for the form, required
 *     sectionId={ 'sexy-field-section' } // sexy field section name, required
 *     method={ FormMethod.CREATE_SECTION } // form/api call method, required
 *     hiddenFields={[ // hidden fields that will only be added in the api call, optional
 *         { fieldId: 'extraField', value: 'value' }
 *     ]}
 *     headerText={i18n.organisations_add_project} // header text for the form modal, optional but highly recommended
 *     submitButtonText={i18n.organisations_add} // submit button text, optional but highly recommended
 *     translationKeysOverride={{ // override default translation keys for fields, optional
 *         fieldKey: {
 *             label: 'form_field_key_label'
 *             placeholder: 'form_field_key_placeholder'
 *         }
 *     }}
 *     afterSubmit = { response => { // callback method when submit was successful with the api response, required
 *         method(response);
 *     }}
 *     closeModal={ method } // method callback when close button was pressed, required
 *     languageId={ languageId } // language id used for display language, required
 * />
 *
 */

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

        this.hasRequiredFields = false;
        this.translationKeysOverride = this.props.translationKeysOverride || [];
        this.logger = Logger.instance;
        this.i18n = this.props.i18n;
    }

    /**
     * Converts a form placeholder to snakeCase (in order to fetch its translation)
     *
     * @param {string} handle - form field placeholder
     * @returns {string} handle - the snakeCased placeholder
     */
    convertPlaceholderTranslationKey(handle) {
        return `form_${Utils.camelCaseToSnakeCase(handle)}_placeholder`;
    }

    /**
     * Converts a form label to snakeCase (in order to fetch its translation)
     *
     * @param {string} handle - form field handle
     * @returns {string} handle - the snakeCased handle
     */
    convertLabelTranslationKey(handle) {
        return `form_${Utils.camelCaseToSnakeCase(handle)}`;
    }

    /**
     * This methods prevents text fields to let the browser submit the form
     * @param {Event} event - keydown event
     * @returns {undefined}
     */
    defaultKeyDownTextFields(event) {

        // avoid from submitting the form by the browser when event bubbles up
        if (event.keyCode === 13) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    /**
     * Creates a form field as described by the given formFieldOptions
     *
     * @param {Object} formFieldOptions - description of the form field as returned by API
     * @returns {Object} component - the component for the form field
     */
    buildInputType(formFieldOptions) {
        const type = formFieldOptions.type;
        const fieldId = formFieldOptions.fieldId;
        const value = formFieldOptions.value ? formFieldOptions.value : '';
        const i18n = this.props.i18n;

        // make sure required config attributes are always set by default
        // todo: we should improve this when making a new form component
        if (!formFieldOptions.form) {
            formFieldOptions.form = {
                all: {}
            };
        } else if (!formFieldOptions.form.all) {
            formFieldOptions.form.all = {};
        }

        let label = formFieldOptions.form.all.label || '';
        let placeholder = '';

        // check if the translation key for a field is overwritten or there is a generic translation available
        // if not, the label will remain the returned label from the api
        if (this.translationKeysOverride[fieldId] && this.translationKeysOverride[fieldId].label) {
            label = i18n[this.translationKeysOverride[fieldId].label];
        } else if (i18n[this.convertLabelTranslationKey(fieldId)]) {
            label = i18n[this.convertLabelTranslationKey(fieldId)];
        }

        // check if the translation key for a field is overwritten or there is a generic translation available
        if (this.translationKeysOverride[fieldId] && this.translationKeysOverride[fieldId].placeholder) {
            placeholder = i18n[this.translationKeysOverride[fieldId].placeholder];

        } else if (i18n[this.convertPlaceholderTranslationKey(fieldId)]) {
            placeholder = i18n[this.convertPlaceholderTranslationKey(fieldId)];

        } else if (formFieldOptions.form.all.placeholder) {

            // relationship fields will have a placeholder tag set
            placeholder = formFieldOptions.form.all.placeholder;
        }

        // check if the field is required
        const isRequired = formFieldOptions.form.all.required;
        const requiredLabel = isRequired ? ' *' : '';

        // if there is one or more required fields, let the form know
        if (requiredLabel && !this.hasRequiredFields) {
            this.hasRequiredFields = true;
        }

        // todo: Add exclusion fields so that names are not translated (see i18n property in fields)

        switch (type) {
            case fieldType.DATE_TIME_FIELD:
                return (<DateTimeField
                    requiredLabel={requiredLabel}
                    currentForm={this.localState}
                    placeholder={placeholder}
                    fieldId={fieldId}
                    label={label}
                    value={value}
                    formId={this.props.formId}
                    onChange={this.handleChange}
                    onKeyDown={this.defaultKeyDownTextFields}
                />);
            case fieldType.TEXT_INPUT:
                return (<TextInput
                    requiredLabel={requiredLabel}
                    currentForm={this.localState}
                    fieldId={fieldId}
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    formId={this.props.formId}
                    onChange={this.handleChange}
                    onKeyDown={this.defaultKeyDownTextFields}
                />);
            case fieldType.TEXT_AREA:
                return (<TextArea
                    requiredLabel={requiredLabel}
                    currentForm={this.localState}
                    fieldId={fieldId}
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    formId={this.props.formId}
                    onChange={this.handleChange}/>);
            case fieldType.CHOICE:
                return (<Choice
                    requiredLabel={requiredLabel}
                    isRequired={isRequired}
                    placeholder={placeholder}
                    currentForm={this.localState}
                    options={formFieldOptions}
                    fieldId={fieldId}
                    label={label}
                    value={value}
                    formId={this.props.formId}
                    onChange={this.handleChange}
                    i18n={i18n}
                />);
            case fieldType.RELATIONSHIP:
                return (<Relationship
                    requiredLabel={requiredLabel}
                    isRequired={isRequired}
                    placeholder={placeholder}
                    currentForm={ this.localState }
                    fieldId={fieldId}
                    options={formFieldOptions}
                    label={label}
                    value={value}
                    formId={this.props.formId}
                    onChange={this.handleChange}
                    i18n={i18n}
                />);
            case fieldType.EMAIL:
                return (<Email
                    requiredLabel={requiredLabel}
                    currentForm={this.localState}
                    fieldId={fieldId}
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    formId={this.props.formId}
                    onChange={this.handleChange}
                    onKeyDown={this.defaultKeyDownTextFields}
                />);
            case fieldType.UUID:
                return null; // not implemented (yet?)
            case fieldType.SLUG:
                return null; // not implemented (yet?)
            case fieldType.INTEGER:
                return null; // not implemented (yet?)
            default:
                this.logger.error({
                    component: 'form',
                    message: `${i18n.form_input_type_could_not_be_determined} ${type}`
                });
                return null;
        }
    }

    /**
     * Handles a change in a form input field and updates the state accordingly (controlled components pattern)
     *
     * @param {Object} event - the change event
     * @returns {undefined}
     */
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

    /**
     * Returns the currently stored value for given target
     *
     * @param {Object} target - the target for which the value should be returned
     * @returns {string} formInputValue - value
     */
    getFieldValue(target) {
        let formInputValue;

        // if selectedOptions and data-array are set, send the data as an array
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

    /**
     * Prepares the data that is to be submitted by submitForm
     *
     * @param {Object} event - the submit event
     * @returns {undefined}
     */
    collectFormData(event) {

        const formId = this.props.formId;

        // clear the existing error messages
        this.resetErrorMessages();

        // just to be on the safe side, disable any erroneous submitting of the form data
        event.preventDefault();

        const changedFields = [];
        let ableToSubmit = true;

        // keep track of processed form fields
        const processedFields = [];

        // any hidden fields (with static values) need to be passed to the state or they wont submit
        // this is only stored when the form config from the api returned the field
        if (this.props.hiddenFields) {
            this.props.hiddenFields.forEach(hiddenField => {
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
                    const fieldId = Object.keys(field)[0];
                    let value;

                    // if the field is empty, proceed with fetching them
                    if (!field[fieldId].value && field[fieldId].value !== '') {

                        // value is not in the formFields state. Perhaps it needs to be extracted from a 'special'
                        // form element. see if the element can be matched and its value extracted.
                        switch (field[fieldId].type) {

                            case fieldType.CHOICE: {

                                // pushing initial value from dropdown to state so it can be submitted
                                const fieldName = Object.keys(field);
                                const choices = [];

                                // extract initial value from state
                                for (const key in field[fieldName].form.all.choices) {
                                    if (field[fieldName].form.all.choices.hasOwnProperty(key)) {
                                        choices.push(field[fieldName].form.all.choices[key]);
                                        break;
                                    }
                                }

                                // the first value is the initial value
                                if (field[fieldName].form.all.placeholder) {
                                    value = '';
                                } else {
                                    value = choices[0];
                                }

                                break;
                            }

                            default: {

                                // for all other form element types, simply attempt to get its value
                                if (document.querySelector(`#${formId}_${fieldId}`)) {
                                    value = document.querySelector(`#${formId}_${fieldId}`).value;
                                } else {

                                    // necessary fields were not found, do not submit and log an error
                                    ableToSubmit = false;
                                    this.logger.error({
                                        component: 'form',
                                        message: `${this.props.i18n.form_could_not_find_form_field} ${fieldId}`
                                    });
                                }
                            }
                        }
                    } else {

                        // extract value from state
                        value = field[fieldId].value;
                    }

                    // push field value to changedFields so it can be submitted
                    // also proceed if the field is not required and set to empty
                    if (fieldId && value ||
                        (this.props.method === FormMethod.UPDATE_SECTION && !field[fieldId].form.all.required && value === '')) {

                        // store changed field
                        changedFields.push({ fieldId, value });

                        // add the field id to processed fields
                        processedFields.push(fieldId);

                    } else {

                        if (field[fieldId].form.all.required) {
                            ableToSubmit = false;

                            this.handleErrorMessages(
                                { [fieldId]: FormErrors.VALUE_CAN_NOT_BE_EMPTY }
                            );
                        }
                    }
                });
            }
        });

        // todo: improve the handling of hidden fields that were initially not in the form configuration
        // check if hidden fields should still be added that were not in the form config
        if (this.props.hiddenFields) {
            this.props.hiddenFields.forEach(hiddenField => {
                if (!~processedFields.indexOf(hiddenField.fieldId)) {
                    changedFields.push({
                        fieldId: hiddenField.fieldId,
                        value: hiddenField.value
                    });
                }
            });
        }

        if (ableToSubmit) {

            // disable the submit button
            this.setSubmissionState(true);

            // submit the changed fields todo: extract to separate function
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
                form: FormErrors.COULD_NOT_PROCESS_REQUEST
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

        for (const key in errors) {
            if (errors.hasOwnProperty(key)) {

                // check for form error
                if (key === 'form') {
                    newState.errors.form = this.i18n[errors[key]] || '';
                    continue;
                }

                // check whether field error is array or string and get the first item
                if (Array.isArray(errors[key])) {
                    newState.errors.fields[key] = this.i18n[errors[key][0]] || this.i18n[FormErrors.INVALID_FIELD_VALUE];
                } else {
                    newState.errors.fields[key] = this.i18n[errors[key]] || this.i18n[FormErrors.INVALID_FIELD_VALUE];
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
            this.hasRequiredFields = false;

            // executes the provided close method
            this.props.closeModal();
        }
    }

    render() {
        const { forms, hiddenFields, formId, headerText, submitButtonText, i18n } = this.props;

        let formFields = i18n.form_loading_form;
        const hiddenFormFields = [];

        // default the submit button to null until the form data is loaded and fields are identified
        let formSubmitButton = null;

        // since all forms are passed on, find the one that matches the given formId
        if (forms && forms.length > 0) {

            forms.forEach(form => {
                if (form.id === formId) {

                    formFields = form.formFields.map(formField => {
                        let buildField;
                        const fieldId = Object.keys(formField)[0];
                        const formFieldOptions = formField[fieldId];
                        let type = formField[fieldId].type;

                        // only work with non-hidden fields
                        if (hiddenFields) {
                            hiddenFields.forEach(hiddenField => {
                                if (hiddenField.fieldId.toString() === fieldId) {
                                    type = fieldType.HIDDEN;
                                }
                            });
                        }

                        // add the extracted fieldId to the fieldOptions
                        formFieldOptions.fieldId = fieldId;

                        if (type !== fieldType.HIDDEN) {
                            buildField = this.buildInputType(formFieldOptions);
                        }

                        return buildField;
                    });

                    formSubmitButton = <button
                        className={ 'action_button' }
                        type={ 'button' }
                        value={ i18n.form_submit }
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
                    <button type="button" value="Close" onClick={ this.handleClose } disabled={ this.localState.form.disabled }><span aria-hidden="true">×</span></button>
                    <h3>{ headerText }</h3>
                    <span className={ `${style.errorMessage}` }>{ this.localState.errors.form }</span>
                </header>
                <main>
                    { formFields }
                    { hiddenFormFields }
                    { this.hasRequiredFields ? <span className={ style.requiredLabel }>{ i18n.form_stars_required }</span> : null }
                </main>
                <footer>
                    <nav>
                        <button
                            className={ 'action_button action_button__secondary' }
                            type={ 'button' }
                            value={ 'Close' }
                            onClick={ this.handleClose }
                            disabled={ this.localState.form.disabled }
                        >
                            { i18n.form_close }
                        </button>
                        { formSubmitButton }
                    </nav>
                </footer>
            </form>
        </section>);
    }
}
