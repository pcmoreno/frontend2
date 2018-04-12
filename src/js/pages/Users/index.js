import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as usersActions from './actions/users';
import * as alertActions from './../../components/Alert/actions/alert';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import ApiFactory from '../../utils/api/factory';
import Users from './components/Users/Users';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, usersActions, alertActions),
            dispatch
        );
    }

    componentDidMount() {
        updateNavigationArrow();

        // get items for first time
        this.getUsers();
    }

    componentWillMount() {
        document.title = 'Users';
    }

    getUsers() {

        // show spinner
        document.querySelector('#spinner').classList.remove('hidden');

        const api = ApiFactory.get('neon');

        // request users
        api.get(
            api.getBaseUrl(),
            api.getEndpoints().users.entities,
            {
                urlParams: {
                    parameters: {
                        fields: 'uuid,account,firstName,infix,lastName,role,roleName'
                    }
                }
            }
        ).then(response => {
            document.querySelector('#spinner').classList.add('hidden');

            this.actions.getUsers(response);
        }).catch(error => {
            this.actions.addAlert({ type: 'error', text: error });
        });
    }


    render() {
        return (
            <Users
                users = { this.props.users }
            />
        );
    }
}

const mapStateToProps = state => ({
    users: state.usersReducer.users
});

export default connect(mapStateToProps)(Index);
