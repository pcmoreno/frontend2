import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';
import Utils from '../../../../../../utils/utils';
import flatpickr from 'flatpickr';

export default class DateTimeField extends Component {

    componentDidMount() {

        const id = `#${this.props.formId}_${this.props.handle}`;

        // init flatpickr
        flatpickr(
            id,
            {
                enableTime: true,
                time_24hr: true,
                defaultHour: 9,
                defaultMinute: 0
            }
        );
    }

    render() {
        const { currentForm, handle, label, onChange, value, formId } = this.props;

        return (
            <div>
                <span className={ `${style.errorMessage}` }>{ currentForm.errors.fields[handle] }</span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ `${formId}_${handle}` }>{ label }</label>
                    </li>
                    <li>
                        <input
                            type="text"
                            placeholder="Select Date.."
                            readOnly="readonly"
                            onChange={ onChange }
                            name={ handle }
                            id={ `${formId}_${handle}` }
                            value={ Utils.formatDate(value, 'yyyy-MM-ddThh:mm:ss') || '' }
                        />
                    </li>
                </ul>
            </div>
        );
    }
}
