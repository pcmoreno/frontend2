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
    }

    buildInputType(name, type, handle, formFieldOptions = null) {
        switch (type) {
            case 'DateTimeField':
                return (<DateTimeField name={ name } handle={ handle} />);
            case 'Relationship':
                return (<Relationship name={ name } handle={ handle} />);
            case 'TextInput':
                return (<TextInput name={ name } handle={ handle} />);
            case 'Slug':
                return (<Slug name={ name } handle={ handle} />);
            case 'Choice':
                return (<Choice name={ name } handle={ handle} formFieldOptions={ formFieldOptions } />);
            default:
                console.log('input type unknown!');
        }
    }

    render() {
        let { formFields, ignoredFields } = this.props;
        let formOutput = 'loading form';

        if (formFields.length > 0) {
            formOutput = formFields.map(formField =>{
                if (ignoredFields.indexOf(Object.keys(formField.field)[0]) === -1) {
                    // only work with non-ignored fields
                    let name = Object.keys(formField.field);
                    let type = formField.field[name].type;
                    let handle = formField.field[name].handle;
                    let formFieldOptions = formField.field[name].form.all;
                    return this.buildInputType(name, type, handle, formFieldOptions);
                }
            });
        }

        return (<form className={ style.form }>
            { formOutput }
            <button type="submit" value="submit">Submit</button>
        </form>)
    }
}
