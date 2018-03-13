import { h, Component } from 'preact';

/** @jsx h */

import classnames from 'classnames';
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
                return (<DateTimeField name={name}
                    handle={handle}
                    label={label}
                    value={value}
                    onChange={this.handleChange}/>);
            case 'TextInput':
                return (<TextInput name={name} handle={handle}
                    label={label}
                    value={value}
                    onChange={this.handleChange}/>);
            case 'Choice':
                return (<Choice name={name}
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
        let formId = this.props.formId;
        let formInputId = event.currentTarget.id;
        let formInputValue = event.currentTarget.value;

        this.props.changeFormFieldValueForFormId(
            formId,
            formInputId,
            formInputValue
        );
    }

    handleSubmit(event) {
        event.preventDefault();

        // todo: disable submit button to avoid bashing (multiple calls)

        let changedFields = [];

        this.props.forms.forEach(form => {
            if (form.id === this.props.formId) {

                // in the right form
                form.formFields.forEach(field => {

                    // map through fields
                    let name = Object.keys(field)[0];

                    if (field[name].value && field[name].value.length > 0) {

                        // only submit the changed fields (for now, those with a value that is not empty)
                        let fieldId = name;
                        let value = field[name].value;

                        changedFields.push({ fieldId, value });
                    }
                });
            }
        });

        this.props.submitForm(changedFields);

    }

    handleClose() {

        // executes the provided close method
        this.props.closeModal();
    }

    shouldComponentUpdate() {

        // todo: is this required? test!
        return true;
    }

    render() {
        let { forms, ignoredFields, formId } = this.props;
        let formFields = 'loading form ' + formId;
        let formSubmitButton;

        // since all forms are passed on, find the one that matches the given formId
        if (forms && forms.length > 0) {
            forms.forEach(form => {
                if (form.id === formId) {
                    formFields = form.formFields.map(formField => {
                        let buildField;

                        if (ignoredFields.indexOf(Object.keys(formField)[0]) === -1) {

                            // only work with non-ignored fields
                            let name = Object.keys(formField);
                            let type = formField[name].type;
                            let handle = formField[name].handle;
                            let label = formField[name].form.create ? formField[name].form.create.label : formField[name].form.all.label;
                            let value = formField[name].value ? formField[name].value : null;
                            let formFieldOptions = formField[name].form.all;

                            buildField = this.buildInputType(name, type, handle, label, value, formFieldOptions);
                        }

                        return buildField;
                    });

                    formSubmitButton = <button className="modal_button" type="button" value="Submit" onClick={ this.handleSubmit } >Submit</button>;
                }
            });
        }

        const secondaryButtonClass = classnames('modal_button', 'modal_button__secondary');

        return (<section role="dialog" >
            <section tabIndex="0" className={ style.background } onClick={ this.handleClose } role="button" />
            <form className={ style.form } id={formId}>
                <header>
                    <button type="button" value="Close" onClick={ this.handleClose }><span aria-hidden="true">×</span></button>
                    <h3>Add Organisation</h3>
                </header>
                <main>
                    { formFields }
                </main>
                <footer>
                    <nav>
                        <button className={ secondaryButtonClass } type="button" value="Close" onClick={ this.handleClose }>Close</button>
                        { formSubmitButton }
                    </nav>
                </footer>
            </form>
        </section>);
    }

}
