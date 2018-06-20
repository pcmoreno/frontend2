import { h } from 'preact';

/** @jsx h */

import style from '../../../style/field.scss';
import AbstractRelationship from './AbstractRelationship';

export default class ManyToMany extends AbstractRelationship {
    render() {
        const { currentForm, fieldId, options, onChange, formId, label, i18n, value = null } = this.props;

        return (
            <div>
                <span className={ `${style.errorMessage}` }>
                    { currentForm.errors.fields[fieldId] }
                </span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ `${formId}_${fieldId}` }>{ label }</label>
                    </li>
                    <li>
                        <select
                            id={ `${formId}_${fieldId}` }
                            name={ fieldId }
                            required="required"
                            data-array="true"
                            multiple="multiple"
                            onBlur={ onChange }
                        >
                            { this.createOptions(options[options.to], i18n, value) }
                        </select>
                    </li>
                </ul>
            </div>
        );
    }
}
