import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';

export default class Email extends Component {

    render() {
        const { currentForm, fieldId, label, onChange, value, formId, placeholder, onKeyDown, requiredLabel } = this.props;

        return (
            <div>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ `${formId}_${fieldId}` }>{ label + requiredLabel }</label>
                    </li>
                    <li>
                        <input
                            type={ 'email' }
                            id={ `${formId}_${fieldId}` }
                            placeholder={ placeholder }
                            value={ value }
                            name={ fieldId }
                            onChange={ onChange }
                            autoComplete={ 'email' }
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
