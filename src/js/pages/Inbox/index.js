import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as inboxActions from './actions/inbox';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import Inbox from './components/Inbox/Inbox';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, inboxActions),
            dispatch
        );
    }

    componentDidMount() {
        updateNavigationArrow();

        // reset inbox items in state
        // because we currently want to refresh all data when the component is re-opened
        // in the future we may use the old state to reduce the loading time
        this.actions.resetInbox();
    }

    componentWillMount() {
        document.title = 'Inbox';
    }

    render() {
        return (
            <Inbox
            />
        );
    }
}

const mapStateToProps = (/* state */) => ({
});

export default connect(mapStateToProps)(Index);
