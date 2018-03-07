import { h, Component } from 'preact';

/** @jsx h */

import style from './style/inbox.scss';

export default class Inbox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className={ style.inbox }>
                Inbox goes here
            </section>
        );
    }
}
