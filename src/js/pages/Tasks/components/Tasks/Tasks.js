import { h, Component } from 'preact';

/** @jsx h */

import Listview from '../../../../components/Listview';
import style from './style/tasks.scss';

export default class Tasks extends Component {
    render() {
        const { tasks, i18n } = this.props;

        return (
            <main className={ style.tasks }>
                <Listview
                    entities={ tasks }
                    defaultSortingKey={ 'assessmentdate' }
                    defaultSortingOrder={ 'desc' }
                    i18n={i18n}
                />
            </main>
        );
    }
}
