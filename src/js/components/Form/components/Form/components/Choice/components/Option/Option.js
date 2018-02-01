import { h, Component } from 'preact';
/** @jsx h */

export default class Option extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { value } = this.props;

        return (<option value={ value }>{ value }</option>)
    }
}

