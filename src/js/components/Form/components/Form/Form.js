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

/** Preact Form Component v1.0
 *
 * it is now possible for fields to be hidden. in such case do not add it to the ignoredFields.
 * each entry can have its value set to either a static text or, for example, a state key
 *
 * example:
 * hiddenFields={[{ name: 'uuid', value: pathNodes[pathNodes.length - 1].name }]}
 *
 **/

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.collectFormData = this.collectFormData.bind(this);
        this.handleClose = this.handleClose.bind(this);

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

        this.logger = Logger.instance;
    }

    buildInputType(name, type, handle, label, value, formFieldOptions = null) {

        // todo: why receive separate name, type, handle etc. when they also exist in formFieldOptions? I dont get it

        switch (type) {
            case fieldType.DATE_TIME_FIELD:
                return (<DateTimeField
                    name={name}
                    localState={this.localState}
                    options={formFieldOptions}
                    handle={handle}
                    label={label}
                    value={value}
                    onChange={this.handleChange}/>);
            case fieldType.TEXT_INPUT:
                return (<TextInput
                    name={name}
                    localState={this.localState}
                    options={formFieldOptions}
                    handle={handle}
                    label={label}
                    value={value}
                    onChange={this.handleChange}
                />);
            case fieldType.TEXT_AREA:
                return (<TextArea
                    name={name}
                    localState={this.localState}
                    options={formFieldOptions}
                    handle={handle}
                    label={label}
                    value={value}
                    onChange={this.handleChange}/>);
            case fieldType.CHOICE:
                return (<Choice
                    name={name}
                    localState={this.localState}
                    options={formFieldOptions}
                    handle={handle}
                    label={label}
                    value={value}
                    onChange={this.handleChange}
                />);
            case fieldType.RELATIONSHIP:
                return (<Relationship
                    localState={ this.localState }
                    options={formFieldOptions}
                    onChange={this.handleChange}
                />);
            case fieldType.EMAIL:
                return (<Email
                    name={name}
                    localState={this.localState}
                    options={formFieldOptions}
                    handle={handle}
                    label={label}
                    value={value}
                    onChange={this.handleChange}
                />);
            case fieldType.HIDDEN:

                // note that fieldType.HIDDEN is a copy of textInput with its input type set to "hidden"
                return (<TextInput
                    name={name}
                    localState={this.localState}
                    options={formFieldOptions}
                    handle={handle}
                    label={label}
                    value={value}
                    onChange={this.handleChange}
                    hidden={true}
                />);
            default:
                this.logger.error({
                    component: 'form',
                    message: `input type could not be determined for ${type}`
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

        // If we have a selectedOptions property and data-array is set with a value of "true"
        // We want to send the data as an array
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

        // just to be on the safe side, disable any erroneous submitting of the form data
        event.preventDefault();

        const changedFields = [];

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

        // extract values for each non-ignored field from state. in case no value exists, extract it in other ways:
        // either by taking the initial value from a dropdown, or by reading the value straight from the actual form
        this.props.forms.forEach(form => {
            if (form.id === this.props.formId) {
                form.formFields.forEach(field => {

                    // the first key is the field id (or name)
                    const name = Object.keys(field)[0];

                    if (this.props.ignoredFields.indexOf(name) === -1) {
                        let fieldId;
                        let value;

                        if (!field[name].value || field[name].value.length === 0) {
                            if (field[name].type === fieldType.CHOICE) {

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
                            } else if (field[name].type === fieldType.RELATIONSHIP) {

                                // for relationship fields, it is much more difficult to retrieve the first entry from
                                // the state since there is no choices collection on the object. the dropdown list is
                                // build up dynamically by iterating over the given relationship collection. to solve
                                // this, just take the currently selected entry from the actual form.
                                // todo: other suggestions? should this also be done for CHOICE fields?

                                if (document.querySelector(`#${name}`)) {
                                    fieldId = name;
                                    value = document.querySelector(`#${name}`).value;

                                } else {
                                    this.logger.error({
                                        component: 'form',
                                        message: `could not find input field in actual from with id ${name}`
                                    });
                                }
                            } else {

                                // extract value from actual form since no value could be extracted from the state
                                if (document.querySelector(`#${name}`)) {
                                    fieldId = name;
                                    value = document.querySelector(`#${name}`).value;
                                } else {
                                    this.logger.error({
                                        component: 'form',
                                        message: `could not find input field in actual from with id ${name}`
                                    });
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

                            // relationship fields need an override
                            if (field[name].as && field[name].type === fieldType.RELATIONSHIP) {
                                fieldId = field[name].as;
                            }

                            changedFields.push({ fieldId, value });
                        } else {

                            // todo: read form field validation from state to check if field is required.
                            // todo: if so, show error. if not, throw error. or do we let API handle this?
                        }
                    }
                });
            }
        });

        // disable the submit button
        this.setSubmitButtonState(true);

        // submit the changed fields (if there is no frontend validation error (which still has to be included))
        this.props.submitForm(changedFields).then(response => {
            if (response && response.errors) {

                // hide loader and handle error messages for fields
                document.querySelector('#spinner').classList.add('hidden');
                this.handleErrorMessages(response.errors);

                // enable the submit button
                this.setSubmitButtonState(false);
            } else {

                // consider this a successful call
                document.querySelector('#spinner').classList.add('hidden');
                this.resetErrorMessages();

                // enable the submit button
                this.setSubmitButtonState(false);
            }
        });
    }

    /**
     * Sets the 'disabled' state of the button to submit the form
     *
     * @param {state} state - determines whether button should be disabled
     * @returns {undefined}
     */
    setSubmitButtonState(state) {
        let newState = Object.assign({}, this.localState);

        newState.form.disabled = state;
        this.setState(newState);
    }

    /**
     * Handles error messages that are given as a key (field name) and value (message) on the form.
     * Generic form errors will be shown when the key is 'form'
     *
     * @param {{key:value, key: [value, value]}} errors - error key value pairs
     * @returns {undefined}
     */
    handleErrorMessages(errors) {
        let newState = Object.assign({}, this.localState);

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
        let newState = Object.assign({}, this.localState);

        // reset form error
        delete newState.errors.form;

        for (let key in newState.errors.fields) {
            if (newState.errors.fields.hasOwnProperty(key)) {
                delete newState.errors.fields[key];
            }
        }

        // change the state to trigger the re-rendering
        this.setState(newState);
    }

    /**
     * Handle closes in all situations (clicking outside the modal, or on one of the two close buttons)
     * @returns {undefined}
     */
    handleClose() {

        // todo: reset all input fields when the form is closed.

        // reset the form and field error messages
        this.resetErrorMessages();

        // executes the provided close method
        this.props.closeModal();
    }

    render() {
        const { forms, ignoredFields, hiddenFields, formId, headerText, submitButtonText } = this.props;

        let formFields = 'loading form...'; // todo: translate
        const hiddenFormFields = [];

        // default the submit button to null until the form data is loaded and fields are identified
        let formSubmitButton = null;

        // since all forms are passed on, find the one that matches the given formId
        if (forms && forms.length > 0) {
            forms.forEach(form => {
                if (form.id === formId) {

                    formFields = form.formFields.map(formField => {
                        let buildField;

                        // only work with non-ignored, non-hidden fields
                        if (ignoredFields.indexOf(Object.keys(formField)[0]) === -1) {
                            const name = Object.keys(formField);
                            const handle = formField[name].handle;
                            const label = formField[name].form.create ? formField[name].form.create.label : formField[name].form.all.label;
                            const formFieldOptions = formField[name];

                            let defaultValue = '';
                            let type = formField[name].type;
                            let value = formField[name].value ? formField[name].value : '';

                            if (hiddenFields) {
                                hiddenFields.forEach(hiddenField => {
                                    if (hiddenField.name.toString() === name.toString()) {

                                        // the current field should be hidden from view, set its properties to reflect this (only for display purposes, wont be submitted)
                                        defaultValue = hiddenField.value;
                                        type = fieldType.HIDDEN;
                                        value = defaultValue;
                                    }
                                });
                            }

                            buildField = this.buildInputType(
                                name, type, handle, label, value, formFieldOptions
                            );
                        }

                        return buildField;
                    });

                    // todo: translate
                    formSubmitButton = <button
                        className="action_button"
                        type="button"
                        value="Submit"
                        onClick={ this.collectFormData }
                        disabled={ this.localState.form.disabled }
                    >{ submitButtonText }</button>;
                }
            });
        }

        return (<section role="dialog" >
            <section tabIndex="0" className={ style.background } onClick={ this.handleClose } role="button" />
            <form id={formId}>
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
                        <button className={ 'action_button action_button__secondary' } type="button" value="Close" onClick={ this.handleClose }>Close</button>
                        { formSubmitButton }
                    </nav>
                </footer>
            </form>
        </section>);
    }

}
