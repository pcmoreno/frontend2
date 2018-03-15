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
                <nav>
                    <span><a href="#notimplemented">LTP</a></span>
                    <span><a href="#notimplemented">Organisation name</a></span>
                    <span><a href="#notimplemented">Project name</a></span>
                    <span><a href="#notimplemented">Job function that is also very long</a></span>
                </nav>
            </section>
        );
    }
}
