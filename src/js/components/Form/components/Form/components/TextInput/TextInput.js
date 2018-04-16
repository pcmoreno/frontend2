import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';

export default class TextInput extends Component {

    constructor(props) {
        super(props);
    }

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
                <span className={ `${style.errorMessage}` }>{ localState.errors.fields[options.form.all.handle] }</span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ options.form.all.handle }>{ options.form.all.label + required }</label>
                    </li>
                    <li>
                        <input
                            type="text"
                            id={ options.form.all.handle }
                            value={ value }
                            name={ 'form[' + options.form.all.handle + ']'}
                            onChange={ onChange }
                            placeholder={ placeholder }
                        />
                    </li>
                </ul>
            </div>
        );
    }
}
