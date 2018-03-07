import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as usersActions from './actions/users';

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
