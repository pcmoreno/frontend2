import { h } from 'preact';

/** @jsx h */

import style from '../../../style/field.scss';
import AbstractRelationship from './AbstractRelationship';

export default class OneToMany extends AbstractRelationship {
    render() {
        const { options, handle, onChange, currentForm, formId, label } = this.props;

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
                            { this.createOptions(options[options.to]) }
                        </select>
                    </li>
                </ul>
            </div>
        );
    }
}
