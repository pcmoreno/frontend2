import { h, Component } from 'preact';

/** @jsx h */

import style from './style/participants.scss';
import Listview from './../../../../components/Listview';

export default class Users extends Component {
    render() {
        const { participants } = this.props;

        return (
            <section className={ style.participants }>
                <Listview entities={ participants } />
            </section>
        );
    }
}
