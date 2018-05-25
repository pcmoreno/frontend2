import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';

export default class TextArea extends Component {

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
                        <textarea
                            id={ handle }
                            rows={ '3' }
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
