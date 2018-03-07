import { h, Component } from 'preact';

/** @jsx h */

import style from './style/tasks.scss';

export default class Tasks extends Component {

    render() {
        return (
            <section className={ style.tasks }>
                Tasks goes here
            </section>
        );
    }
}
