import { h, Component } from 'preact';

/** @jsx h */

import Listview from '../../../../components/Listview';
import Sidebar from './../../../../components/Sidebar';

// import Report from './components/Report/Report';
// import Participant from './components/Participant/Participant';
// import Project from './components/Project/Project';
import style from './style/users.scss';

export default class Users extends Component {
    render() {
        const { users } = this.props;

        // hee sander: dit is voor jou man:

        // const tabs = [
        //     {
        //         name: 'report',
        //         icon: 'envelope',
        //         component: <Report />
        //     },
        //     {
        //         name: 'participant',
        //         icon: 'users',
        //         component: <Participant />
        //     },
        //     {
        //         name: 'project',
        //         icon: 'clipboard-list',
        //         component: <Project />
        //     }
        // ];

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
