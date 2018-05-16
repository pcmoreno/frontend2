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
        const fieldId = options.handle;

        if (hidden) {
            // dont forget this is just for display purposes! the actual value (that will be submitted) is stored in the formFields state.
            // todo: yeah so that is why changing the id / name had no effect on the data going to the database before. you need to change the state with the right name/id and value.
            return (
                <input
                    type='hidden'
                    id={ 'project' }
                    name={ 'project' }
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
                            type='text'
                            id={ fieldId }
                            name={ fieldName }
                            value={ value }
                            onChange={ onChange }
                            placeholder={ placeholder }
                        />
                    </li>
                </ul>
            </div>
        );
    }
}
