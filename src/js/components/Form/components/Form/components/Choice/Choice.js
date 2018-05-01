import { h, Component } from 'preact';

/** @jsx h */

import Option from './components/Option/Option';
import style from '../style/field.scss';

export default class Choice extends Component {

    createOptions(options) {
        return Object.keys(options.form.all.choices).map(choice => <Option optionValue={options.form.all.choices[choice]} value={choice} />);
    }

    render() {
        const { options, localState, handle, label, onChange } = this.props;

        return (
            <div>
                <span className={ `${style.errorMessage}` }>{ localState.errors.fields[handle] }</span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ handle }>{ label }</label>
                    </li>
                    <li>
                        <select
                            id={ handle }
                            name={ 'form[' + handle + ']' }
                            onBlur={ onChange }
                        >
                            { this.createOptions(options) }
                        </select>
                    </li>
                </ul>
            </div>
        );
    }
}
