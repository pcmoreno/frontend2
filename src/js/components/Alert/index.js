import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as alertActions from './../../components/Alert/actions/alert';
import Alert from './components/Alert/Alert';
import AppConfig from './../../App.config';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, alertActions),
            dispatch
        );

        // define timeout in ms for alerts
        this.alertTimeout = AppConfig.global.alertTimeout;
    }

    componentDidUpdate() {
        if (this.props.alerts.length > 0) {
            setTimeout(this.actions.clearAlerts, this.alertTimeout);
        }
    }

    render() {
        return (<Alert alerts = { this.props.alerts } />);
    }
}

const mapStateToProps = state => ({
    alerts: state.alertReducer.alerts
});

export default connect(mapStateToProps)(Index);
