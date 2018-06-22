import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as inboxActions from './actions/inbox';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import Inbox from './components/Inbox/Inbox';

/** @jsx h */

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

const mapStateToProps = state => ({
    languageId: state.headerReducer.languageId
});

export default connect(mapStateToProps)(Index);
