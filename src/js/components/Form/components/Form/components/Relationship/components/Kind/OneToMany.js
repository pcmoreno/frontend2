import { h } from 'preact';

/** @jsx h */

import style from '../../../style/field.scss';
import AbstractRelationship from './AbstractRelationship';

export default class OneToMany extends AbstractRelationship {
    render() {
        const { options, fieldId, onChange, currentForm, formId, label, i18n, value = null, requiredLabel, placeholder, isRequired } = this.props;

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
                            required="required"
                            data-array="true"
                            multiple="multiple"
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
