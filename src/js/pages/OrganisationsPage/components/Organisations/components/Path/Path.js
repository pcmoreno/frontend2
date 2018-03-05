import { h, Component } from 'preact';
/** @jsx h */

import style from './style/path.scss';

export default class Path extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className={ style.path } id="path">
                <ul>
                    <li>LTP</li>
                    <li>Organisation name</li>
                    <li>Project name</li>
                    <li>Job function that is also very long</li>
                </ul>
            </section>
        )
    }
}
