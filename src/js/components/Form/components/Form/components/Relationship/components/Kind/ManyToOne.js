import { h } from 'preact';

/** @jsx h */

import style from '../../../style/field.scss';
import AbstractRelationship from './AbstractRelationship';

export default class ManyToOne extends AbstractRelationship {
    render() {
        const { options, currentForm, onChange, formId, label } = this.props;
        const to = typeof options.as !== 'undefined' ? options.as : options.to;

        return (
            <div>
                <span className={ `${style.errorMessage}` }>
                    { currentForm.errors.fields[options.handle] }
                </span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ to }>{ label }</label>
                    </li>
                    <li>
                        <select
                            id={ `${formId}_${to}` }
                            name={ `form[${to}]` }
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
