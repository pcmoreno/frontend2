import { h, Component } from 'preact';

import Option from '../../components/Option/Option';
import style from '../../../style/field.scss';
import formStyle from '../../style/relationship.scss';

export default class OneToOne extends Component
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
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ options.handle }>{ options.form.all.label }</label>
                    </li>
                    <li>
                        <select
                            id={ options.handle }
                            name={ 'form[' + options.handle + ']' }
                            data-array="true"
                            onChange= { onChange }
                        >
                            { this.createOptions(options[options.to]) }
                        </select>
                    </li>
                </ul>
            </div>
        );
    }
}
