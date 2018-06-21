import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as usersActions from './actions/users';
import * as alertActions from './../../components/Alert/actions/alert';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import ApiFactory from '../../utils/api/factory';
import Users from './components/Users/Users';
import translator from '../../utils/translator';

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, usersActions, alertActions),
            dispatch
        );

        this.openModalToAddUser = this.openModalToAddUser.bind(this);
        this.closeModalToAddUser = this.closeModalToAddUser.bind(this);
    }

    refreshDataWithMessage() {

        // hide modal
        document.querySelector('#modal_user').classList.add('hidden');

        // Show a message
        // todo: translate this message
        // todo: this message should also be adapted to support delete messages. Something like a form action?
        this.actions.addAlert({ type: 'success', text: 'The user was successfully saved.' });

        // refresh the items
        // todo: is this actually needed? shouldnt React re-render because the state changes? test!
        this.fetchEntities({ id: 0, name: 'what to put here' }, null);
    }

    openModalToAddUser() {
        document.querySelector('#modal_user').classList.remove('hidden');
    }

    closeModalToAddUser() {
        document.querySelector('#modal_user').classList.add('hidden');
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
                refreshDataWithMessage={ this.refreshDataWithMessage }
                openModalToAddUser={ this.openModalToAddUser }
                closeModalToAddUser={ this.closeModalToAddUser }
                i18n = { translator(this.props.languageId, 'users') }
            />
        );
    }
}

const mapStateToProps = state => ({
    users: state.usersReducer.users,
    languageId: state.headerReducer.languageId
});

export default connect(mapStateToProps)(Index);
