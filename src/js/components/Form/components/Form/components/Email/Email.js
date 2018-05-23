import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';

export default class Email extends Component {

    render() {
        const { localState, handle, label, onChange, value } = this.props;

        return (
            <div>
                <span className={ `${style.errorMessage}` }>{ localState.errors.fields[handle] }</span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ handle }>{ label }</label>
                    </li>
                    <li>
                        <input
                            type="email"
                            id={ handle }
                            value={ value }
                            name={ 'form[' + handle + ']'}
                            onChange={ onChange }
                            autoComplete={ 'email' }
                        />
                    </li>
                </ul>
            </div>
        );
    }
}
