import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';

export default class TextInput extends Component {

    isRequired(options) {
        return ((((options || {}).generator || {}).entity || {}).validator || {}).NotBlank === null;
    }

    render() {
        const { currentForm, onChange, value, options, formId, label, placeholder } = this.props;
        const required = this.isRequired(options) ? ' (*)' : '';
        const fieldName = typeof options.as !== 'undefined' ? options.as : options.to;
        const fieldId = typeof options.as !== 'undefined' ? options.as : options.handle;

        return (
            <div>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ options.handle }>{ label + required }</label>
                    </li>
                    <li>
                        <input
                            type={ 'text' }
                            id={ `${formId}_${fieldId}` }
                            name={ fieldName }
                            value={ value }
                            onChange={ onChange }
                            placeholder={ placeholder }
                            autoComplete={ 'we-do-not-want-console-warnings-for-this-attribute-being-disabled' }
                            className={ currentForm.errors.fields[options.handle] && 'error' }
                        />
                        <span className={ `${style.errorMessage}` }>{ currentForm.errors.fields[options.handle] }</span>
                    </li>
                </ul>
            </div>
        );
    }
}
