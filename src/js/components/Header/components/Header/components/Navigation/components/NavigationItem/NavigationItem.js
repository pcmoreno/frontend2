import { h, Component } from 'preact';
/** @jsx h */

export default class navigationItem extends Component {
    constructor() {
        super();
    }

    render() {
        let { label, link } = this.props;

        return (
            <li><a href={ link }>{ label }</a></li>
        )
    }
}
