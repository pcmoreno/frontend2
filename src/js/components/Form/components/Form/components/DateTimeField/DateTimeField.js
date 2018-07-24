import { h, Component } from 'preact';
import moment from 'moment';

/** @jsx h */

import style from '../style/field.scss';
import flatpickr from 'flatpickr';

export default class DateTimeField extends Component {
    constructor(props) {
        super(props);

        this.localState = {
            date: ''
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

        this.localState.date = this.formatDate(this.props.value); // moment(this.props.value).format('YYYY-MM-DD HH:mm');
        this.setState(this.localState);
    }

    componentDidUpdate() {

        // the date is transformed on each update in case the form was already loaded by a previous amend call
        if (this.localState.date !== this.formatDate(this.props.value)) { // moment(this.props.value).format('YYYY-MM-DD HH:mm')) {
            this.localState.date = this.formatDate(this.props.value); // moment(this.props.value).format('YYYY-MM-DD HH:mm');
            this.setState(this.localState);
        }
    }

    formatDate(date) {
        if (date) {
            return moment(date).format('YYYY-MM-DD HH:mm');
        }

        return '';
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
