import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as inboxActions from './actions/inbox';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import lokaliser from '../../utils/lokaliser.js';
import Inbox from './components/Inbox/Inbox';

// import { default as i18n } from '../../../../data/i18n/inbox-nl_NL.js';

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
                i18n={ lokaliser('nl') }
            />
        );
    }
}

const mapStateToProps = (/* state */) => ({
});

export default connect(mapStateToProps)(Index);
