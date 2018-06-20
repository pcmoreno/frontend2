import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';

export default class TextArea extends Component {

    render() {
        const { currentForm, fieldId, label, onChange, value, formId, placeholder } = this.props;

        return (
            <div>
                <span className={ `${style.errorMessage}` }>{ currentForm.errors.fields[fieldId] }</span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ `${formId}_${fieldId}` }>{ label }</label>
                    </li>
                    <li>
                        <textarea
                            id={ `${formId}_${fieldId}` }
                            rows={ '3' }
                            placeholder={ placeholder }
                            value={ value }
                            name={ `form[${fieldId}]` }
                            onChange={ onChange }
                        />
                    </li>
                </ul>
            </div>
        );
    }
}
