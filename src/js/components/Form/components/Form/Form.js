import { h, Component } from 'preact';

/** @jsx h */

import DateTimeField from './components/DateTimeField/DateTimeField';
import TextInput from './components/TextInput/TextInput';
import Choice from './components/Choice/Choice';
import style from './style/form.scss';

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
                fields: {

                }
            }
        };
    }

    buildInputType(name, type, handle, label, value, formFieldOptions = null) {

        // todo: implement all of https://github.com/dionsnoeijen/sexy-field-field-types-base/tree/master/src/FieldType
        switch (type) {
            case 'DateTimeField':
                return (<DateTimeField
                    name={name}
                    localState={this.localState}
                    handle={handle}
                    label={label}
                    value={value}
                    onChange={this.handleChange}/>);
            case 'TextInput':
                return (<TextInput
                    name={name}
                    localState={this.localState}
                    handle={handle}
                    label={label}
                    value={value}
                    onChange={this.handleChange}/>);
            case 'Choice':
                return (<Choice
                    name={name}
                    localState={this.localState}
                    handle={handle}
                    formFieldOptions={formFieldOptions}
                    label={label}
                    value={value}
                    onChange={this.handleChange}/>);
            default:

                // console.log('input type unknown!');
                return null;
        }
    }

    handleChange(event) {
        event.preventDefault();

        // controlled component pattern: form state is kept in state and persisted across page components
        const formId = this.props.formId;
        const formInputId = event.currentTarget.id;
        const formInputValue = event.currentTarget.value;

        this.props.changeFormFieldValueForFormId(
            formId,
            formInputId,
            formInputValue
        );
    }

    handleSubmit(event) {
        event.preventDefault();

        // todo: disable submit and close buttons button to avoid bashing (multiple api calls and weird behaviour (multiple calls)
        // todo: when to enable again? When its closed (after cancel or save, or after a failed call)

        // todo: frontend form input validation (read validation rules from options calls)

        let changedFields = [];

        this.props.forms.forEach(form => {
            if (form.id === this.props.formId) {

                // in the right form
                form.formFields.forEach(field => {

                    // map through fields
                    const name = Object.keys(field)[0];

                    if (field[name].value && field[name].value.length > 0) {

                        // only submit the changed fields (for now, those with a value that is not empty)
                        const fieldId = name;
                        const value = field[name].value;

                        changedFields.push({ fieldId, value });
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
        const { forms, ignoredFields, formId } = this.props;
        let formFields = `loading ${formId}`;
        let formSubmitButton = null;

        // since all forms are passed on, find the one that matches the given formId
        if (forms && forms.length > 0) {
            forms.forEach(form => {
                if (form.id === formId) {
                    formFields = form.formFields.map(formField => {
                        let buildField;

                        if (ignoredFields.indexOf(Object.keys(formField)[0]) === -1) {

                            // only work with non-ignored fields
                            const name = Object.keys(formField);
                            const type = formField[name].type;
                            const handle = formField[name].handle;
                            const label = formField[name].form.create ? formField[name].form.create.label : formField[name].form.all.label;
                            const value = formField[name].value ? formField[name].value : null;
                            const formFieldOptions = formField[name].form.all;

                            buildField = this.buildInputType(name, type, handle, label, value, formFieldOptions);
                        }

                        return buildField;
                    });

                    // todo: header en submit button text
                    formSubmitButton = <button className="action_button" type="button" value="Submit" onClick={ this.handleSubmit } >Submit</button>;
                }
            });
        }

        return (<section role="dialog" >
            <section tabIndex="0" className={ style.background } onClick={ this.handleClose } role="button" />
            <form className={ style.form } id={formId}>
                <header>
                    <button type="button" value="Close" onClick={ this.handleClose }><span aria-hidden="true">×</span></button>
                    <h3>Add Organisation</h3>
                    <span className={ `${style.errorMessage}` }>{ this.localState.errors.form }</span>
                </header>
                <main>
                    { formFields }
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
