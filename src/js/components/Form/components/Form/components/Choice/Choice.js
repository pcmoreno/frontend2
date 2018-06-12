import { h, Component } from 'preact';

/** @jsx h */

import Option from './components/Option/Option';
import style from '../style/field.scss';

export default class Choice extends Component {

    createOptions(options, i18n) {
        const formFieldOptions = [];
        let selectedSet = false;

        Object.keys(options.form.all.choices).forEach(option => {
            let selected = false;

            if (this.props.value && this.props.value.length > 0) {
                selected = this.props.value === option;
            } else {
                if (!selectedSet) {
                    selectedSet = true;

                    // ensure first option is selected when no selection could be extracted from state
                    selected = true;
                }
            }

            formFieldOptions.push(<Option
                optionValue={ options.form.all.choices[option] }
                value={ option }
                selected={ selected }
                i18n={ i18n }
            />);
        });

        return formFieldOptions;
    }

    render() {
        const { options, currentForm, handle, label, onChange, formId, i18n } = this.props;

        return (
            <div>
                <span className={ `${style.errorMessage}` }>{ currentForm.errors.fields[handle] }</span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ `${formId}_${handle}` }>{ label }</label>
                    </li>
                    <li>
                        <select
                            id={ `${formId}_${handle}` }
                            name={ handle }
                            onBlur={ onChange }
                        >
                            { this.createOptions(options, i18n) }
                        </select>
                    </li>
                </ul>
            </div>
        );
    }
}
