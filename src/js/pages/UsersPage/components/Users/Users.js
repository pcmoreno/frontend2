import { h, Component } from 'preact';
/** @jsx h */

import style from './style/users.scss';

export default class Users extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className={ style.users }>
                Users goes here
            </section>
        )
    }
}