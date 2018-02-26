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
                <p>path path path path gas oes here > path goes here > path goes here path path path path goes here > path goes here > path goes here path path path path goes here > path goes here > path goes here</p>
            </section>
        )
    }
}
