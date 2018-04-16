import { h, Component } from 'preact';

import Option from '../../components/Option/Option';
import style from '../../../style/field.scss';

export default class ManyToMany extends Component {

    createOptions(options) {
        return options.map(option => {
            return (<Option value={option.name} optionValue={option.slug} />);
        });
    }

    render() {
        const { localState, options, onChange } = this.props;

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
                            name={ options.handle }
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
