import { h } from 'preact';

/** @jsx h */

import style from '../../../style/field.scss';
import AbstractRelationship from './AbstractRelationship';

export default class OneToOne extends AbstractRelationship {
    render() {
        const { options, fieldId, onChange, currentForm, formId, label, i18n, value = null, required } = this.props;

        return (
            <div>
                <span className={ `${style.errorMessage}` }>
                    { currentForm.errors.fields[fieldId] }
                </span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ `${formId}_${fieldId}` }>{ label + required }</label>
                    </li>
                    <li>
                        <select
                            id={ `${formId}_${fieldId}` }
                            name={ fieldId }
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
