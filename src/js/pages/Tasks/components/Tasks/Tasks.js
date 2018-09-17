import { h, Component } from 'preact';

/** @jsx h */

import Listview from '../../../../components/Listview';
import style from './style/tasks.scss';

export default class Tasks extends Component {
    constructor(props) {
        super(props);

        this.showAllTasksHandler = this.showAllTasksHandler.bind(this);
    }

    showAllTasksHandler() {
        this.props.showAllTasks();
    }

    render() {
        const { tasks, i18n, showAllTasksFlag } = this.props;

        return (
            <main className={ `${showAllTasksFlag ? 'fullheight' : ''}` } id="tasks">
                <section className={ style.listview_container } >
                    <Listview
                        entities={ tasks }
                        defaultSortingKey={ 'assessmentdate' }
                        defaultSortingOrder={ 'desc' }
                        i18n={i18n}
                        translationKeyPrefix={ 'tasks_' }
                    />
                </section>
                <div
                    className={ `${style.show_all_tasks} ${showAllTasksFlag ? 'hidden' : 'inline'}` }
                    onClick={ () => this.showAllTasksHandler() }
                    role="button"
                    tabIndex="0"
                >
                    <span>{ i18n.tasks_overview_only_shows_most_recent_entries } </span>
                    { i18n.tasks_overview_click_to_show_all_participants }
                </div>
            </main>
        );
    }
}
