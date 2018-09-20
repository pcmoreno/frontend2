import { h } from 'preact';
import style from '../../../style/field.scss';
import AbstractRelationship from './AbstractRelationship';

/** @jsx h */

export default class OneToOne extends AbstractRelationship {
    render() {
        const {
            options,
            fieldId,
            onChange,
            currentForm,
            formId,
            label,
            i18n,
            value = null,
            requiredLabel,
            placeholder,
            isRequired,
            disabled
        } = this.props;

        const optionList = this.createOptions(options[options.to], i18n, value, placeholder, isRequired);

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

                            // todo: this kind of logic should not be here
                            value={ value && typeof value !== 'object' ? value : this.defaultValue }
                            disabled={ disabled }
                        >
                            { optionList }
                        </select>
                        <span className={ `${style.errorMessage}` }>{ currentForm.errors.fields[fieldId] }</span>
                    </li>
                </ul>
            </div>
        );
    }
}
