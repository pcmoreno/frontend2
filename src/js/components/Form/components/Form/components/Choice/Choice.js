import { h, Component } from 'preact';

/** @jsx h */

import Option from './components/Option/Option';
import style from '../style/field.scss';

export default class Choice extends Component {

    createOptions(options, i18n) {
        const formFieldOptions = [];
        let selectedSet = false;

        // check for a placeholder and add it as first option
        if (this.props.placeholder) {
            const selectPlaceholder = !this.props.value;

            formFieldOptions.push(<Option
                optionValue={ '' }
                value={ this.props.placeholder }
                selected={ selectPlaceholder }
                disabled={ this.props.isRequired }
                i18n={ i18n }
            />);

            selectedSet = selectPlaceholder;
        }

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
        const { options, currentForm, fieldId, label, onChange, formId, i18n, requiredLabel } = this.props;

        return (
            <div>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ `${formId}_${fieldId}` }>{ label + requiredLabel }</label>
                    </li>
                    <li>
                        <select
                            id={ `${formId}_${fieldId}` }
                            name={ fieldId }
                            onBlur={ onChange }
                            className={ currentForm.errors.fields[fieldId] && 'error' }
                        >
                            { this.createOptions(options, i18n) }
                        </select>
                        <span className={ `${style.errorMessage}` }>{ currentForm.errors.fields[fieldId] }</span>
                    </li>
                </ul>
            </div>
        );
    }
}
