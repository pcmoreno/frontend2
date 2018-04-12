import { h, Component } from 'preact';

/** @jsx h */

import Listview from '../../../../components/Listview';
import Sidebar from './../../../../components/Sidebar';
import style from './style/users.scss';

export default class Users extends Component {
    render() {
        const { users } = this.props;

        const tabs = [];

        return (
            <section className={ `${style.users} full_width_sidebar` } id="listview_with_sidebar">
                <section className={ style.listview_container } id="listview_container">
                    <Listview
                        entities={ users }
                        defaultSortingKey={ 'name' }
                        defaultSortingOrder={ 'asc' }
                    />
                </section>
                <Sidebar tabs={ tabs } />
            </section>
        );
    }
}
