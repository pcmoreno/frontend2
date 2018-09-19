import { h, Component } from 'preact';
import style from '../style/field.scss';

/** @jsx h */

export default class TextArea extends Component {
    render() {
        const {
            currentForm,
            fieldId,
            label,
            onChange,
            value,
            formId,
            placeholder,
            requiredLabel,
            disabled
        } = this.props;

        return (
            <div>
                <span className={ `${style.errorMessage}` }>{ currentForm.errors.fields[fieldId] }</span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ `${formId}_${fieldId}` }>{ label + requiredLabel }</label>
                    </li>
                    <li>
                        <textarea
                            id={ `${formId}_${fieldId}` }
                            rows="3"
                            placeholder={ placeholder }
                            value={ value }
                            name={ `form[${fieldId}]` }
                            className={ currentForm.errors.fields[fieldId] && 'error' }
                            onChange={ onChange }
                            disabled={ disabled }
                        />
                    </li>
                </ul>
            </div>
        );
    }
}
