import { h, Component } from 'preact';

import Option from '../../components/Option/Option';
import style from '../../../style/field.scss';

export default class ManyToOne extends Component {

    createOptions(options) {
        return options.map(option => (<Option value={option.name} optionValue={option.slug} />));
    }

    render() {
        const { options, localState, onChange } = this.props;

        const to = typeof options.as !== 'undefined' ? options.as : options.to;

        return (
            <div>
                <span className={ `${style.errorMessage}` }>
                    { localState.errors.fields[options.handle] }
                </span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ to }>{ options.form.all.label }</label>
                    </li>
                    <li>
                        <select
                            id={ to }
                            name={ 'form[' + to + ']' }
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
