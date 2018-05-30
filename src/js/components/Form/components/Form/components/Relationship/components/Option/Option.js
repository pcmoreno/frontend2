import { h, Component } from 'preact';

/** @jsx h */

export default class Option extends Component {

    render() {
        const { optionValue, value, selected } = this.props;

        return (<option value={ optionValue } selected={ selected }>{ value }</option>);
    }
}
