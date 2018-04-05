import { h, Component } from 'preact';

/** @jsx h */

import Listview from '../../../../components/Listview';
import style from './style/tasks.scss';

export default class Tasks extends Component {
    render() {
        const { tasks } = this.props;

        return (
            <section className={ style.tasks }>
                <Listview
                    entities={ tasks }
                    defaultSortingKey={ 'consultant' }
                    defaultSortingOrder={ 'asc' }
                />
            </section>
        );
    }
}
