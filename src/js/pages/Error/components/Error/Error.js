import { h, Component } from 'preact';

/** @jsx h */

import style from './style/error.scss';

export default class Error extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className={ style.error }>
                <h1>Page not found!</h1>
            </section>
        );
    }
}
