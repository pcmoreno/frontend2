import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as tasksActions from './actions/tasks';
import * as alertActions from './../../components/Alert/actions/alert';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import ApiFactory from '../../utils/api/factory';
import Tasks from './components/Tasks/Tasks';
import translator from '../../utils/translator';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, tasksActions, alertActions),
            dispatch
        );
    }

    componentDidMount() {
        updateNavigationArrow();

        // get items for first time
        this.getTasks();
    }

    componentWillMount() {
        document.title = 'Tasks';
    }

    getTasks() {

        // show spinner
        document.querySelector('#spinner').classList.remove('hidden');

        const api = ApiFactory.get('neon');

        // request tasks
        api.get(
            api.getBaseUrl(),
            api.getEndpoints().tasks.entities,
            {
                urlParams: {
                    parameters: {
                        fields: 'uuid,participantSessionAppointmentDate,accountHasRole,account,firstName,infix,lastName,consultant,project,organisation,organisationName,organisationType',
                        limit: 100
                    }
                }
            }
        ).then(response => {
            document.querySelector('#spinner').classList.add('hidden');

            this.actions.getTasks(response);
        }).catch(error => {
            this.actions.addAlert({ type: 'error', text: error });
        });
    }

    render() {
        return (
            <Tasks
                tasks = { this.props.tasks }
                i18n = { translator(this.props.languageId, 'tasks') }
            />
        );
    }
}

const mapStateToProps = state => ({
    tasks: state.tasksReducer.tasks,
    languageId: state.headerReducer.languageId
});

export default connect(mapStateToProps)(Index);
