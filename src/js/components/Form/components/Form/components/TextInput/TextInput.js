import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';

export default class TextInput extends Component {

    isRequired(options) {
        return ((((options || {}).generator || {}).entity || {}).validator || {}).NotBlank === null;
    }

    getPlaceholder(options) {
        return typeof ((((options || {}).form || {}).all || {}).attr || {}).placeholder === 'undefined'
            ? ''
            : options.form.all.attr.placeholder;
    }

    render() {
        const { localState, onChange, value, options } = this.props;
        const required = this.isRequired(options) ? ' (*)' : '';
        const placeholder = this.getPlaceholder(options);

        return (
            <div>
                <span className={ `${style.errorMessage}` }>{ localState.errors.fields[options.handle] }</span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ options.handle }>{ options.form.all.label + required }</label>
                    </li>
                    <li>
                        <input
                            type="text"
                            id={ options.handle }
                            value={ value }
                            name={ 'form[' + options.handle + ']'}
                            onChange={ onChange }
                            placeholder={ placeholder }
                        />
                    </li>
                </ul>
            </div>
        );
    }
}
