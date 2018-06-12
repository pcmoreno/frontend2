import { h } from 'preact';

/** @jsx h */

import style from '../../../style/field.scss';
import AbstractRelationship from './AbstractRelationship';

export default class OneToOne extends AbstractRelationship {
    render() {
        const { options, handle, onChange, currentForm, formId, label, i18n } = this.props;

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
                            onBlur={ onChange }
                        >
                            { this.createOptions(options[options.to], i18n) }
                        </select>
                    </li>
                </ul>
            </div>
        );
    }
}
