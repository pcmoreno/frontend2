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
                    <li><a href="#notimplemented">LTP</a></li>
                    <li><a href="#notimplemented">Organisation name</a></li>
                    <li><a href="#notimplemented">Project name</a></li>
                    <li><a href="#notimplemented">Job function that is also very long</a></li>
                </ul>
            </section>
        );
    }
}
