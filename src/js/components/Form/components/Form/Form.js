import { h, Component } from 'preact';
/** @jsx h */

import DateTimeField from './components/DateTimeField/DateTimeField';
import Relationship from './components/Relationship/Relationship';
import TextInput from './components/TextInput/TextInput';
import Slug from './components/Slug/Slug';
import Choice from './components/Choice/Choice';
import style from './style/form.scss';

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    buildInputType(name, type, handle, label, value, formFieldOptions = null) {
        // todo: implement all from https://github.com/dionsnoeijen/sexy-field-field-types-base/tree/master/src/FieldType

        switch (type) {
            case 'DateTimeField':
                return (<DateTimeField name={ name } handle={ handle} label={ label } value={ value } onChange={this.handleChange} />);
            case 'Relationship':
                return (<Relationship name={ name } handle={ handle} label={ label } value={ value } onChange={this.handleChange} />);
            case 'TextInput':
                return (<TextInput name={ name } handle={ handle} label={ label } value={ value } onChange={this.handleChange} />);
            case 'Slug':
                return (<Slug name={ name } handle={ handle} label={ label } value={ value } onChange={this.handleChange} />);
            case 'Choice':
                return (<Choice name={ name } handle={ handle} formFieldOptions={ formFieldOptions } label={ label } value={ value } onChange={this.handleChange} />);
            default:
                console.log('input type unknown!');
        }
    }

    handleChange(event) {
        event.preventDefault();

        // controlled component pattern: form state is kept in state and persisted across page components
        let formId = this.props.formId;
        let formInputId = event.currentTarget.id;
        let formInputValue  = event.currentTarget.value;

        this.props.changeFormFieldValueForFormId(
            formId,
            formInputId,
            formInputValue
        );
    }

    handleSubmit(event) {
        event.preventDefault();

        let changedFields = [];

        this.props.forms.map(form => {
            if (form.id === this.props.formId) {
                // in the right form
                form.formFields.map(field => {
                    // in the right field
                    let name = Object.keys(field)[0];
                    if (field[name].value) {
                        // only submit the changed fields
                        let fieldId = name;
                        let value = field[name].value;
                        changedFields.push(fieldId, value);
                    }
                })
            }
        });

        this.props.submitForm(changedFields);

    }

    shouldComponentUpdate() {
        return true;
    }

    render() {
        let { forms, ignoredFields, formId } = this.props;
        let formOutput = 'loading form';

        if (forms && forms.length > 0){
            // loop through them to find the one that matches formId
            forms.map(form => {
                if (form.id === formId) {
                    formOutput = form.formFields.map(formField => {
                        if (ignoredFields.indexOf(Object.keys(formField)[0]) === -1) {
                            // only work with non-ignored fields
                            let name = Object.keys(formField);
                            let type = formField[name].type;
                            let handle = formField[name].handle;
                            let label = formField[name].form.create ? formField[name].form.create.label : formField[name].form.all.label;
                            let value = formField[name].value ? formField[name].value : null;
                            let formFieldOptions = formField[name].form.all;
                            return this.buildInputType(name, type, handle, label, value, formFieldOptions);
                        }
                    });
                }
            })
        }

        return (<section className={ style.background }><section className={ style.form }><form onSubmit={ this.handleSubmit } id={formId}>
            { formOutput }
            <input type="submit" value="Submit" />
        </form></section></section>)
    }

}

