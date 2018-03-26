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
        const { options, onChange } = this.props;

        return (
            <div>
                <label htmlFor={ options.handle }>{ options.form.all.label }</label>
                <span className={ `${style.errorMessage}` }>Errors</span>
                <select
                    id={ options.handle }
                    name={ options.handle }
                    required="required"
                    multiple="multiple"
                    onChange={ onChange }
                >
                    { this.createOptions(options[options.to]) }
                </select>
            </div>
        );
    }
}
