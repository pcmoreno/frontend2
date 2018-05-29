import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';

export default class Email extends Component {

    render() {
        const { currentForm, handle, label, onChange, value, formId } = this.props;

        return (
            <div>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ handle }>{ label }</label>
                    </li>
                    <li>
                        <input
                            type={ 'email' }
                            id={ `${formId}_${handle}` }
                            value={ value }
                            name={ `form[${handle}]` }
                            onChange={ onChange }
                            autoComplete={ 'email' }
                            className={ currentForm.errors.fields[handle] && 'error' }
                        />
                        <span className={ `${style.errorMessage}` }>{ currentForm.errors.fields[handle] }</span>
                    </li>
                </ul>
            </div>
        );
    }
}
