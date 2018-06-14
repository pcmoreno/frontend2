import { h, Component } from 'preact';

/** @jsx h */

import style from '../style/field.scss';
import Utils from '../../../../../../utils/utils';

export default class DateTimeField extends Component {

    render() {
        const { currentForm, handle, label, onChange, value, formId } = this.props;

        // todo: need a datetime field (preact extension) that can handle 24 hour clock and timezones

        return (
            <div>
                <span className={ `${style.errorMessage}` }>{ currentForm.errors.fields[handle] }</span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ `${formId}_${handle}` }>{ label }</label>
                    </li>
                    <li>
                        <input
                            type={ 'datetime-local' }
                            id={ `${formId}_${handle}` }
                            value={ Utils.formatDate(value, 'yyyy-MM-ddThh:mm:ss') || '' }
                            name={ handle }
                            onChange={ onChange }
                        />
                    </li>
                </ul>
            </div>
        );
    }
}
