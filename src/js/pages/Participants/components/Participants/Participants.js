import { h, Component } from 'preact';

/** @jsx h */

import Listview from '../../../../components/Listview';
import style from './style/participants.scss';

export default class Users extends Component {
    render() {
        const { participants } = this.props;

        return (
            <section className={ style.participants }>
                <Listview
                    entities={ participants }
                    defaultSortingKey={ 'name' }
                    defaultSortingOrder={ 'desc' }
                />
            </section>
        );
    }
}
