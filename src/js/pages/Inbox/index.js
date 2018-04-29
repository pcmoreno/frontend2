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
