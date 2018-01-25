import { h, Component } from 'preact';
/** @jsx h */

import style from './style/form.scss';

export default class Form extends Component {
    constructor(props) {
        super(props);
    }

    buildInputType(type, name, id) {
        switch (type) {
            case 'Choice':
                // todo: should use a preloaded input type
                return ('<select><option value={ name } id={ id }></option></select>');
            default:
                console.log('input type unknown!');
        }
    }

    render() {
        let { formFields, ignoredFields } = this.props;
        let formOutput = 'loading form data';

        if (formFields.length > 0) {
            formFields.map(formField =>{
                if (ignoredFields.indexOf(Object.keys(formField.field)) === -1) {
                    // only work with non-ignored fields
                    console.log((formField.field))
                    // todo: depending on its input type, it should load up the relevant child component
                    // todo: something like: formOutput += this.buildInputType(type, name, id);
                }
            });
        }

        return (<form className={ style.form }>
            { formOutput }
        </form>)
    }
}
