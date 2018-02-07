import { h, Component } from 'preact';
/** @jsx h */

import style from './style/organisations.scss';

export default class Organisations extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className={ style.organisations }>
                Organisations goes here
            </section>
        )
    }
}
