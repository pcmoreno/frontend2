import { h, Component } from 'preact';

import Option from '../../components/Option/Option';
import style from '../../../style/field.scss';

export default class OneToMany extends Component
{
    constructor(props) {
        super(props);
    }

    createOptions(options) {
        return options.map(option => {
            return (<Option value={option.name} optionValue={option.slug} />);
        });
    }

    render() {
        const { options, onChange, localState } = this.props;

        return (
            <div>
                <span className={ `${style.errorMessage}` }>
                    { localState.errors.fields[options.handle] }
                </span>
                <ul>
                    <li>
                        <label htmlFor={ options.handle }>{ options.form.all.label }</label>
                    </li>
                    <li>
                        <select
                            id={ options.handle }
                            name={ 'form[' + options.handle + ']' }
                            required="required"
                            data-array="true"
                            multiple="multiple"
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
