import { h, Component } from 'preact';
/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as inboxActions from './actions/inbox'

import Inbox from './components/Inbox/Inbox'

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, inboxActions),
            dispatch
        );
    }

    componentWillMount() {
        document.title = 'Inbox';
    }

    render() {
        return (
            <Inbox
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
    }
};

export default connect(mapStateToProps)(Index);
