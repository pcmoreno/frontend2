import { h, Component } from 'preact';
/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as alertActions from './../../components/Alert/actions/alert';

import Alert from './components/Alert/Alert';

class Index extends Component {
    constructor(props) {
        super(props);

        const {dispatch} = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, alertActions),
            dispatch
        );
    }

    componentDidUpdate() {
        if (this.props.alerts.length > 0) {
            setTimeout(this.actions.clearAlerts, 5000);
        }
    }

    render() {
        return (<Alert alerts = { this.props.alerts } />)
    }
}
const mapStateToProps = (state) => {
    return {
        alerts: state.alertReducer.alerts
    }
};

export default connect(mapStateToProps)(Index);
