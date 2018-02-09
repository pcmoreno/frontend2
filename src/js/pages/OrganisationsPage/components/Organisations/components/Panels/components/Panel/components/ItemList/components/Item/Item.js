import { h, Component } from 'preact';
/** @jsx h */

export default class Item extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { item } = this.props;

        return (
            <li>{ item }</li>
        )
    }
}

