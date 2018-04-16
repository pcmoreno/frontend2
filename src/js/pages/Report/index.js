import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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

    componentDidMount() {
        updateNavigationArrow();

        // todo: retrieve report data by URL parameters
    }

    componentWillMount() {
        document.title = 'Report';
    }

    getReport() {

        // show spinner
        document.querySelector('#spinner').classList.remove('hidden');

        const api = ApiFactory.get('neon');

        // request report data
        api.get(
            api.getBaseUrl(),
            api.getEndpoints().report,
            {
                urlParams: {
                    parameters: {
                        fields: 'uuid'
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

        // todo: use later
        // let arg = this.props.matches.uuid;

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
