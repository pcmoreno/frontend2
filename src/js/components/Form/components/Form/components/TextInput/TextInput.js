import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';

export default class TextInput extends Component {

    isRequired(options) {
        return ((((options || {}).generator || {}).entity || {}).validator || {}).NotBlank === null;
    }

    render() {
        const { currentForm, handle, onChange, value, options, formId, label, placeholder } = this.props;
        const required = this.isRequired(options) ? ' (*)' : '';

        return (
            <div>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ `${formId}_${handle}` }>{ label + required }</label>
                    </li>
                    <li>
                        <input
                            type={ 'text' }
                            id={ `${formId}_${handle}` }
                            name={ handle }
                            value={ value }
                            onChange={ onChange }
                            placeholder={ placeholder }
                            autoComplete={ 'we-do-not-want-console-warnings-for-this-attribute-being-disabled' }
                            className={ currentForm.errors.fields[handle] && 'error' }
                        />
                        <span className={ `${style.errorMessage}` }>{ currentForm.errors.fields[handle] }</span>
                    </li>
                </ul>
            </div>
        );
    }
}
