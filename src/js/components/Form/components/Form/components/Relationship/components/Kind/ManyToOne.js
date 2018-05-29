import { h, Component } from 'preact';

import Option from '../../components/Option/Option';
import style from '../../../style/field.scss';

export default class ManyToOne extends Component {

    createOptions(options) {
        const formFieldOptions = [];
        let selectedSet = false;

        options.forEach(option => {
            let selected = false;

            if (this.props.value && this.props.value.length > 0) {
                selected = this.props.value === option.slug;
            } else {
                if (!selectedSet) {
                    selectedSet = true;

                    // ensure first option is selected when no selection could be extracted from state
                    selected = true;
                }
            }

            formFieldOptions.push(<Option
                optionValue={ option.slug }
                value={option.name}
                selected={ selected }
            />);
        });

        return formFieldOptions;
    }

    render() {
        const { options, currentForm, onChange } = this.props;

        const to = typeof options.as !== 'undefined' ? options.as : options.to;

        return (
            <div>
                <span className={ `${style.errorMessage}` }>
                    { currentForm.errors.fields[options.handle] }
                </span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ to }>{ options.form.all.label }</label>
                    </li>
                    <li>
                        <select
                            id={ to }
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
