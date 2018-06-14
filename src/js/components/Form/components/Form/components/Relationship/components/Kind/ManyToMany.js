import { h } from 'preact';

/** @jsx h */

import style from '../../../style/field.scss';
import AbstractRelationship from './AbstractRelationship';

export default class ManyToMany extends AbstractRelationship {
    render() {
        const { currentForm, handle, options, onChange, formId, label, i18n, selectedValue = null } = this.props;

        return (
            <div>
                <span className={ `${style.errorMessage}` }>
                    { currentForm.errors.fields[handle] }
                </span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ `${formId}_${handle}` }>{ label }</label>
                    </li>
                    <li>
                        <select
                            id={ `${formId}_${handle}` }
                            name={ handle }
                            required="required"
                            data-array="true"
                            multiple="multiple"
                            onBlur={ onChange }
                        >
                            { this.createOptions(options[options.to], i18n, selectedValue) }
                        </select>
                    </li>
                </ul>
            </div>
        );
    }
}
