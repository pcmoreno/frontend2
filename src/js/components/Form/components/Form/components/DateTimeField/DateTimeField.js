import { h, Component } from 'preact';
import style from '../style/field.scss';

/** @jsx h */

export default class DateTimeField extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { localState, handle, label, onChange, value } = this.props;

        return (<div>
            <label htmlFor={ handle }>{ label }</label>
            <span className={ `${style.errorMessage}` }>{ localState.errors.fields[handle] }</span>
            <input
                type="date"
                id={ handle }
                value={ value }
                name={ 'form[' + handle + ']'}
                onChange={ onChange }
            />
        </div>
        );
    }
}
