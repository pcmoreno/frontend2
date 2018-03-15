import { h, Component } from 'preact';

/** @jsx h */

import Option from './components/Option/Option';
import style from '../style/field.scss';

export default class Choice extends Component {
    constructor(props) {
        super(props);
    }

    createOptions() {
        let choices = this.props.formFieldOptions.choices;
        let options = Object.keys(choices).map(choice => <Option value={ choice } />);

        return options;
    }

    render() {
        const { localState, handle, label } = this.props;

        return (<div>
            <label htmlFor={ handle }>{ label }</label>
            <span className={ `${style.errorMessage}` }>{ localState.errors.fields[handle] }</span>
            <select id={ handle } name={ handle }>
                { this.createOptions() }
            </select>
        </div>
        );
    }
}
