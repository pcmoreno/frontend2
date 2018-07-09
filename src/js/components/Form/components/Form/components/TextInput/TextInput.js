import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';

export default class TextInput extends Component {
    render() {
        const { currentForm, fieldId, onChange, value, formId, label, placeholder, onKeyDown, requiredLabel } = this.props;

        return (
            <div>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ `${formId}_${fieldId}` }>{ label + requiredLabel }</label>
                    </li>
                    <li>
                        <input
                            type={ 'text' }
                            id={ `${formId}_${fieldId}` }
                            name={ fieldId }
                            value={ value }
                            onChange={ onChange }
                            placeholder={ placeholder }
                            autoComplete={ 'we-do-not-want-console-warnings-for-this-attribute-being-disabled' }
                            className={ currentForm.errors.fields[fieldId] && 'error' }
                            onKeyDown={ onKeyDown }
                        />
                        <span className={ `${style.errorMessage}` }>{ currentForm.errors.fields[fieldId] }</span>
                    </li>
                </ul>
            </div>
        );
    }
}
