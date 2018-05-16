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
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);

        // UI state, with fields as key value pair field and message
        this.localState = {
            errors: {
                form: '',
                fields: {}
            }
        };

        this.logger = Logger.instance;
    }

    buildInputType(name, type, handle, label, value, formFieldOptions = null) {

        // todo: why receive separate name, type, handle etc. when they also exist in formFieldOptions? I dont get it

        // todo: implement all of https://github.com/dionsnoeijen/sexy-field-field-types-base/tree/master/src/FieldType
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

    handleSubmit(event) {
        event.preventDefault();

        // todo: disable submit and close buttons button to avoid bashing (multiple api calls and weird behaviour
        // todo: when to enable again? When its closed (after cancel or save, or after a failed call)
        // todo: frontend form input validation (read validation rules from options calls)

        const changedFields = [];

        this.props.forms.forEach(form => {

            if (form.id === this.props.formId) {

                // in the right form
                form.formFields.forEach(field => {
                    const name = Object.keys(field)[0];

                    // not gonna work. handleSubmit has no knowledge of hiddenFields. no way to do this comparison here.
                    // if the current field is in hiddenFields, submit the value set in there
                    // if (hiddenFields) {
                    //     hiddenFields.forEach(hiddenField => {
                    //
                    //         if (hiddenField.name.toString() === name.toString()) {
                    //             console.log('encountered hidden field, submitting its value as set in the hiddenFields array');
                    //
                    //             const fieldId = name;
                    //             const value = hiddenField.value;
                    //
                    //             changedFields.push({ fieldId, value });
                    //         }
                    //     });
                    // }
                    // if (name === 'manyParticipantSessionToOneProject') {
                    //     console.log('detected hidden field',field[name].type);
                    // }

                    // todo: the field, when it comes in over the API, has no property depicting it is hidden.
                    // todo: and that is what we are iterating over, here. so actually it should be added to the
                    // todo: state. when filling up formFields, if a field should be hidden, as determined by the
                    // todo: hiddenfields config, add a property with type = hidden and the value, so it can be
                    // todo: extracted here and passed on in the submit.
                    // todo: alternatively, issue a handleChange for each hidden field, so the state is mutated
                    // todo: and the value will be submitted. uhm nope, there is no value in the form and hiddenFields
                    // todo: is not available here, remember? the only way is via the state, when building up the form
                    // todo: ensure you set its value. when the value is there, it will be picked up by the next block.
                    // todo: wont work. to pass on hiddenfields to the reducer, over the action, you'd need to pass it on
                    // todo: to the action. but, at the point where the action is called, there is no hiddenFields yet
                    // todo: hang on. bright idea here. what if we just output the field as all other regular fields
                    // todo: but we just dont output it in the component?
                    // todo: that is what we are already doing. the thing is, you need to trigger the change event so
                    // todo: the value in the state is updated. you could attempt to do this after building up the form.

                    // only submit the fields with a value that is not empty
                    if (field[name].value && field[name].value.length > 0) {
                        const fieldId = name;
                        const value = field[name].value;

                        changedFields.push({ fieldId, value });
                    } else {

                        // no change detected for this form field. however, it could be a dropdown or something similar
                        // with a default value (without user change), so ensure these are parsed and submitted, too.
                        if (field[name].type === fieldType.CHOICE) {
                            const fieldName = (Object.keys(field));
                            const fieldId = (Object.keys(field)[0]);
                            const choices = [];

                            for (const key in field[fieldName].form.all.choices) {
                                if (field[fieldName].form.all.choices.hasOwnProperty(key)) {
                                    choices.push(field[fieldName].form.all.choices[key]);
                                    break;
                                }
                            }
                            const value = choices[0];

                            changedFields.push({ fieldId, value });
                        }
                    }
                });
            }
        });

        this.props.submitForm(changedFields).then(response => {
            if (response && response.errors) {

                // hide loader and handle error messages for fields
                document.querySelector('#spinner').classList.add('hidden');
                this.handleErrorMessages(response.errors);
            } else {

                // consider this a successful call
                document.querySelector('#spinner').classList.add('hidden');
                this.resetErrorMessages();
            }
        });
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

                        // only work with non-ignored fields
                        if (ignoredFields.indexOf(Object.keys(formField)[0]) === -1) {

                            const name = Object.keys(formField);
                            const handle = formField[name].handle;
                            const label = formField[name].form.create ? formField[name].form.create.label : formField[name].form.all.label;
                            const formFieldOptions = formField[name];

                            let hidden = false;
                            let defaultValue = '';
                            let type = formField[name].type;
                            let value = formField[name].value ? formField[name].value : '';

                            if (hiddenFields) {
                                hiddenFields.forEach(hiddenField => {

                                    if (hiddenField.name.toString() === name.toString()) {

                                        // the current field should be hidden, set its properties to reflect this
                                        // behaviour. note that only affects displaying. the actual state of this fields
                                        // is stored in formFields state and remains untouched
                                        hidden = true;
                                        defaultValue = hiddenField.value;
                                        type = fieldType.HIDDEN;
                                        value = defaultValue;

                                        // update the value of each formField in the state (which will be the values that
                                        // are submitted) that is set to be hidden by the form Config
                                        // todo: this results in an infinite loop
                                        this.props.changeFormFieldValueForFormId(
                                            formId,
                                            formField[name].handle,
                                            hiddenField.value
                                        );
                                    }
                                });
                            }

                            buildField = this.buildInputType(
                                name, type, handle, label, value, formFieldOptions, hidden
                            );
                        }

                        return buildField;
                    });

                    // todo: translate
                    formSubmitButton = <button className="action_button" type="button" value="Submit" onClick={ this.handleSubmit } >{ submitButtonText }</button>;
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
