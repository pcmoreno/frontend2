import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as usersActions from './actions/users';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import Users from './components/Users/Users';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, usersActions),
            dispatch
        );
    }

    componentDidMount() {
        updateNavigationArrow();
    }

    componentWillMount() {
        document.title = 'Users';
    }

    render() {
        return (
            <Users
            />
        );
    }
}

const mapStateToProps = (/* state */) => ({

});

export default connect(mapStateToProps)(Index);
