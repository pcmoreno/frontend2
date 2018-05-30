import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';

export default class DateTimeField extends Component {

    render() {
        const { currentForm, handle, label, onChange, value, formId } = this.props;

        return (
            <div>
                <span className={ `${style.errorMessage}` }>{ currentForm.errors.fields[handle] }</span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ handle }>{ label }</label>
                    </li>
                    <li>
                        <input
                            type={ 'datetime-local' }
                            id={ `${formId}_${handle}` }
                            value={ value }
                            name={ `form[${handle}]` }
                            onChange={ onChange }
                        />
                    </li>
                </ul>
            </div>
        );
    }
}
