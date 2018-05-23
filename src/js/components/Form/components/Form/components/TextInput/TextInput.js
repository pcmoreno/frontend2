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
        const { localState, onChange, value, options, hidden } = this.props;
        const required = this.isRequired(options) ? ' (*)' : '';
        const placeholder = this.getPlaceholder(options);
        const fieldName = typeof options.as !== 'undefined' ? options.as : options.to;
        const fieldId = typeof options.as !== 'undefined' ? options.as : options.handle;

        if (hidden) {

            // todo: this is a bit messy and no longer needed like this
            return (
                <input
                    type={ 'hidden' }
                    id={ `form[${fieldName}]` }
                    name={ `form[${fieldName}]` }
                    value={ value }
                />
            );
        }

        return (
            <div>
                <span className={ `${style.errorMessage}` }>{ localState.errors.fields[options.handle] }</span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ options.handle }>{ options.form.all.label + required }</label>
                    </li>
                    <li>
                        <input
                            type={ 'text' }
                            id={ fieldId }
                            name={ fieldName }
                            value={ value }
                            onChange={ onChange }
                            placeholder={ placeholder }
                            autoComplete={ 'off' }
                        />
                    </li>
                </ul>
            </div>
        );
    }
}
