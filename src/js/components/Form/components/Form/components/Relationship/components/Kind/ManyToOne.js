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
        const { options } = this.props;

        return (
            <div>
                <label htmlFor={ options.to }>{ options.label }</label>
                <span className={ `${style.errorMessage}` }>Errors</span>
                <select id={ options.handle } name={ options.to }>
                    { this.createOptions() }
                </select>
            </div>
        );
    }
}
