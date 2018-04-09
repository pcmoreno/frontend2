import { h, Component } from 'preact';

/** @jsx h */

import Listview from '../../../../components/Listview';
import style from './style/users.scss';

export default class Users extends Component {
    render() {
        const { users } = this.props;

        return (
            <section className={ style.users }>
                <Listview
                    entities={ users }
                    defaultSortingKey={ 'name' }
                    defaultSortingOrder={ 'asc' }
                />
            </section>
        );
    }
}
