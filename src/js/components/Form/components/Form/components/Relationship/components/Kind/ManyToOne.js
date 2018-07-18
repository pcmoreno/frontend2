import { h } from 'preact';

/** @jsx h */

import style from '../../../style/field.scss';
import AbstractRelationship from './AbstractRelationship';

export default class ManyToOne extends AbstractRelationship {
    render() {
        const { options, fieldId, currentForm, onChange, formId, label, i18n, value = null, requiredLabel, placeholder, isRequired } = this.props;

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
                            { this.createOptions(options[options.to], i18n, value, placeholder, isRequired) }
                        </select>
                        <span className={ `${style.errorMessage}` }>{ currentForm.errors.fields[fieldId] }</span>
                    </li>
                </ul>
            </div>
        );
    }
}
