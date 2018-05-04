import { h, Component } from 'preact';

/** @jsx h */

export default class Option extends Component {

    render() {
        let { optionValue, value } = this.props;

        return (<option value={ optionValue }>{ value }</option>);
    }
}
