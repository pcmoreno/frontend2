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
import { ProductSlugs } from '../../constants/Products';
import Utils from '../../utils/utils';
import Logger from '../../utils/logger';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, tasksActions, alertActions),
            dispatch
        );

        this.downloadIntermediateReport = this.downloadIntermediateReport.bind(this);

        this.loadingPdf = false;
    }

    componentDidMount() {
        updateNavigationArrow();

        // get items for first time
        this.getTasks();
    }

    componentWillMount() {
        document.title = 'Tasks';
    }

    downloadIntermediateReport(event, participantSessionSlug) {
        event.preventDefault();

        if (this.loadingPdf) {
            return;
        }

        this.loadingPdf = true;

        // show spinner
        document.querySelector('#spinner').classList.remove('hidden');

        const api = ApiFactory.get('neon');

        api.get(
            api.getBaseUrl(),
            api.getEndpoints().report.downloadIntermediateReport,
            {
                urlParams: {
                    identifiers: {
                        slug: participantSessionSlug
                    }
                },
                headers: {
                    Accept: 'application/pdf'
                }
            }
        ).then(response => {
            document.querySelector('#spinner').classList.add('hidden');

            if (!response || response.errors) {
                throw new Error('Could not download intermediate report');
            }

            // download the pdf file, exceptions thrown are automatically caught in the promise chain
            Utils.downloadPdfFromBlob(response.blob, {
                fileName: response.fileName
            });
            this.loadingPdf = false;

        }).catch(error => {
            this.loadingPdf = false;
            document.querySelector('#spinner').classList.add('hidden');

            this.actions.addAlert({ type: 'error', text: this.i18n.tasks_error_download_pdf });
            Logger.instance.error({
                component: 'Tasks',
                message: `Could not download intermediate report for participantSession: ${participantSessionSlug}`,
                response: error && error.message ? error.message : error || ''
            });
        });
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
                    identifiers: {
                        filter: 'project:product:slug'
                    },
                    parameters: {

                        // filter on our 3 hna products
                        value: [
                            ProductSlugs.DEVELOPMENT,
                            ProductSlugs.SELECTION,
                            ProductSlugs.SELECTION_DEVELOPMENT
                        ].join(','),
                        fields: 'uuid,participantSessionAppointmentDate,participantSessionSlug,accountHasRole,genericRoleStatus,account,firstName,infix,lastName,consultant,project,organisation,organisationName,organisationType',
                        limit: 800
                    }
                }
            }
        ).then(response => {
            document.querySelector('#spinner').classList.add('hidden');
            this.actions.getTasks(response, this.downloadIntermediateReport);
        }).catch(error => {
            document.querySelector('#spinner').classList.add('hidden');
            this.actions.addAlert({ type: 'error', text: error });
        });
    }

    render() {
        this.i18n = translator(this.props.languageId, 'tasks');

        return (
            <Tasks
                tasks = { this.props.tasks }
                i18n = { this.i18n }
            />
        );
    }
}

const mapStateToProps = state => ({
    tasks: state.tasksReducer.tasks,
    languageId: state.headerReducer.languageId
});

export default connect(mapStateToProps)(Index);
