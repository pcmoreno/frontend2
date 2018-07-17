import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';
import Utils from '../../../../../../utils/utils';
import flatpickr from 'flatpickr';

export default class DateTimeField extends Component {
    constructor(props) {
        super(props);

        this.localState = {
            date: null
        };
    }

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

        this.localState.date = Utils.formatDate(this.props.value, 'yyyy-MM-dd HH:mm');
        this.setState(this.localState);
    }

    componentDidUpdate() {

        // the date is transformed on each update in case the form was already loaded by a previous amend call
        if (this.localState.date !== Utils.formatDate(this.props.value, 'yyyy-MM-dd HH:mm')) {
            this.localState.date = Utils.formatDate(this.props.value, 'yyyy-MM-dd HH:mm');
            this.setState(this.localState);
        }
    }

    render() {
        const {
            currentForm,
            fieldId,
            label,
            onChange,
            requiredLabel,
            onKeyDown,
            formId
        } = this.props;

        return (
            <div>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ `${formId}_${fieldId}` }>{ label + requiredLabel }</label>
                    </li>
                    <li>
                        <input
                            type="text"
                            placeholder="Select Date.."
                            readOnly="readonly"
                            onChange={ onChange }
                            onKeyDown={ onKeyDown }
                            name={ fieldId }
                            id={ `${formId}_${fieldId}` }
                            value={ this.localState.date }
                            className={ currentForm.errors.fields[fieldId] && 'error' }
                        />
                        <span className={ `${style.errorMessage}` }>{ currentForm.errors.fields[fieldId] }</span>
                    </li>
                </ul>
            </div>
        );
    }
}
