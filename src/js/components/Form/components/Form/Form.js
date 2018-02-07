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

    buildInputType(name, type, handle, formFieldOptions = null) {
        // todo: implement all from https://github.com/dionsnoeijen/sexy-field-field-types-base/tree/master/src/FieldType
        switch (type) {
            case 'DateTimeField':
                return (<DateTimeField name={ name } handle={ handle} onChange={this.handleChange} />);
            case 'Relationship':
                return (<Relationship name={ name } handle={ handle} onChange={this.handleChange} />);
            case 'TextInput':
                return (<TextInput name={ name } handle={ handle} onChange={this.handleChange} />);
            case 'Slug':
                return (<Slug name={ name } handle={ handle} onChange={this.handleChange} />);
            case 'Choice':
                return (<Choice name={ name } handle={ handle} formFieldOptions={ formFieldOptions } onChange={this.handleChange} />);
            default:
                console.log('input type unknown!');
        }
    }

    handleChange(event) {
        // prevent defaults and call the container method
        event.preventDefault();
        this.props.changeInputValue(event);
    }

    handleSubmit(event) {
        // prevent defaults and call the container method
        event.preventDefault();
        this.props.submitForm(event);
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
                            let formFieldOptions = formField[name].form.all;
                            return this.buildInputType(name, type, handle, formFieldOptions);
                        }
                    });
                }
            })
        }

        return (<form className={ style.form } onSubmit={ this.handleSubmit } id={formId}>
            { formOutput }
            <input type="submit" value="Submit" />
        </form>)
    }
}
