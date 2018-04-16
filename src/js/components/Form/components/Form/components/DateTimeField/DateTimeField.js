import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';

export default class DateTimeField extends Component {

    constructor(props) {
        super(props);
    }

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
                            type="datetime-local"
                            id={ handle }
                            value={ value }
                            name={ 'form[' + handle + ']'}
                            onChange={ onChange }
                        />
                    </li>
                </ul>
            </div>
        );
    }
}
