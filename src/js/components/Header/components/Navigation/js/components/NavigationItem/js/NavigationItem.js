import { h, Component } from 'preact';
/** @jsx h */

import style from './../style/navigation-item';

export default class navigationItem extends Component {
    constructor() {
        super();
    }

    render() {
        let { label, link } = this.props;

        return (
            <li className="navigation-item"><a href={ link }>{ label }</a></li>
        )
    }
}
