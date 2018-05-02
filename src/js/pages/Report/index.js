import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as reportActions from './actions/report';
import * as alertActions from './../../components/Alert/actions/alert';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import ApiFactory from '../../utils/api/factory';
import Report from './components/Report/Report';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, reportActions, alertActions),
            dispatch
        );
    }

    componentWillMount() {
        document.title = 'Report';
    }

    componentWillUnmount() {

        // reset state, so old report data is unset, until we get new data
        this.actions.resetReport();
    }

    componentDidMount() {
        updateNavigationArrow();

        // retrieve report data by URL parameters
        this.participantSessionId = this.props.matches.participantSessionId;

        // fetch report data
        this.getReport(this.participantSessionId);
    }

    getReport(participantSessionId) {

        // show spinner
        document.querySelector('#spinner').classList.remove('hidden');

        const api = ApiFactory.get('neon');

        // request report data
        api.get(
            api.getBaseUrl(),
            api.getEndpoints().report.entities,
            {
                urlParams: {
                    identifiers: {
                        slug: participantSessionId
                    },
                    parameters: {
                        fields: 'uuid,participantSessionAppointmentDate,project,projectName,organisation,organisationName,organisationType,product,productName,textsTemplate,textsTemplateName,textFields,textFieldName,accountHasRole,account,firstName,infix,lastName,displayName,consultant,report,textFieldInReports,textFieldInReportValue,textField',
                        depth: 6 // depth control to avoid infinite results for default texts connected to custom texts

                        // todo implement: calculatedScore,scoreName,scoreValue,Type,CompetencyScoreInReport,Competency
                        // this wil be one api call because some day we would like to have one custom endpoint that returns all report information
                    }
                }
            }
        ).then(response => {
            document.querySelector('#spinner').classList.add('hidden');

            this.actions.getReport(response);

        }).catch(error => {
            this.actions.addAlert({ type: 'error', text: error });
        });
    }

    render() {
        return (
            <Report
                report = { this.props.report }
            />
        );
    }
}

const mapStateToProps = state => ({
    report: state.reportReducer.report
});

export default connect(mapStateToProps)(Index);
