import { h, Component } from 'preact';
/** @jsx h */

import Option from './components/Option/Option';

export default class Choice extends Component {
    constructor(props) {
        super(props);
    }

    createOptions() {
        let choices = this.props.formFieldOptions.choices;
        let options = Object.keys(choices).map(choice => {
            return <Option value={ choice } />;
        });

        return options;
    }

    render() {
        let { handle, label } = this.props;

        return (<div>
                <label htmlFor={ handle }>{ label }</label>
                <select id={ handle} name={ handle }>
                    { this.createOptions() }
                </select>
            </div>
        )
    }
}

