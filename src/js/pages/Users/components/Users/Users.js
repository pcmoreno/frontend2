import { h, Component } from 'preact';

/** @jsx h */

import Listview from '../../../../components/Listview';
import Sidebar from './../../../../components/Sidebar';
import Report from './components/Report/Report';
import Participant from './components/Participant/Participant';
import Project from './components/Project/Project';
import style from './style/users.scss';

export default class Users extends Component {
    render() {
        const { users } = this.props;

        const tabs = [
            {
                name: 'report',
                icon: 'users',
                component: <Report />
            },
            {
                name: 'participant',
                icon: 'clipboard-list',
                component: <Participant />
            },
            {
                name: 'project',
                icon: 'clipboard-list',
                component: <Project />
            }
        ];

        return (
            <section className={ style.users }>
                <section className={ style.listview_container }>
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
