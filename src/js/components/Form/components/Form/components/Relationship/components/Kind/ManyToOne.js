import { h, Component } from 'preact';

import Option from '../../components/Option/Option';
import style from '../../../style/field.scss';

export default class ManyToOne extends Component
{
    constructor(props) {
        super(props);
    }

    createOptions() {
        return [
            <Option value="Relatie A" optionValue="slug-a" />,
            <Option value="Relatie B" optionValue="slug-b" />,
            <Option value="Relatie C" optionValue="slug-c" />
        ];
    }

    render() {
        const { options, localState, onChange } = this.props;

        return (
            <div>
                <span className={ `${style.errorMessage}` }>
                    { localState.errors.fields[options.handle] }
                </span>
                <ul className={ style.fieldGroup }>
                    <li>
                        <label htmlFor={ options.to }>{ options.form.all.label }</label>
                    </li>
                    <li>
                        <select
                            id={ options.handle }
                            name={ options.to }
                            data-array="true"
                            onBlur={ onChange }
                        >
                            { this.createOptions() }
                        </select>
                    </li>
                </ul>
            </div>
        );
    }
}
