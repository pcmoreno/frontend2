import { h, Component } from 'preact';

/** @jsx h */

import style from './style/participants.scss';

export default class Users extends Component {

    render() {
        return (
            <section className={ style.participants }>
                Participants goes here
            </section>
        );
    }
}
