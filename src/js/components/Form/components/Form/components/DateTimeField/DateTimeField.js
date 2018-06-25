import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';
import Utils from '../../../../../../utils/utils';
import flatpickr from 'flatpickr';

export default class DateTimeField extends Component {

    componentDidMount() {

        const id = `#${this.props.formId}_${this.props.fieldId}`;

        // init flatpickr
        flatpickr(
            id,
            {
                enableTime: true,
                time_24hr: true, // eslint-disable-line camelcase
                defaultHour: 9,
                defaultMinute: 0
            }
        );
    }

    render() {
        const {
            currentForm,
            fieldId,
            label,
            onChange,
            required,
            value,
            formId
        } = this.props;

        // assume the data received from API is aways 'Amsterdam time'. convert to local notation.
        const appointmentDate = Utils.formatDate(value, 'yyyy-MM-dd HH:mm');

        return (
            <div>
                <span className={ `${style.errorMessage}` }>{ currentForm.errors.fields[fieldId] }</span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ `${formId}_${fieldId}` }>{ label + required }</label>
                    </li>
                    <li>
                        <input
                            type="text"
                            placeholder="Select Date.."
                            readOnly="readonly"
                            onChange={ onChange }
                            name={ fieldId }
                            id={ `${formId}_${fieldId}` }
                            value={ appointmentDate || null }
                        />
                    </li>
                </ul>
            </div>
        );
    }
}
