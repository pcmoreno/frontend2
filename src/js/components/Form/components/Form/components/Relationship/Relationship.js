import { h, Component } from 'preact';
/** @jsx h */

export default class Relationship extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <input type="text" value={ this.props.handle } />
        )
    }
}

