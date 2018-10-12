import { h, Component } from 'preact';
import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as usersActions from './actions/users';
import * as alertActions from './../../components/Alert/actions/alert';
import * as formActions from './../../components/Form/actions/form';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import ApiFactory from 'neon-frontend-utils/src/api/factory';
import Users from './components/Users/Users';
import translator from 'neon-frontend-utils/src/translator';
import ShownUserRoles from './constants/ShownUserRoles';

/** @jsx h */

class Index extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        this.actions = bindActionCreators(
            Object.assign({}, usersActions, alertActions, formActions),
            dispatch
        );

        this.openModalToAddUser = this.openModalToAddUser.bind(this);
        this.closeModalToAddUser = this.closeModalToAddUser.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.refreshDataWithMessage = this.refreshDataWithMessage.bind(this);

        this.api = ApiFactory.get('neon');

        this.i18n = translator(this.props.languageId, 'users');
        document.title = this.i18n.users_page_title;
    }

    componentDidUpdate() {
        document.title = this.i18n.users_page_title;
    }

    refreshDataWithMessage(message) {

        // Show a message and refresh the list
        this.actions.addAlert({ type: 'success', text: message });
        this.getUsers();
    }

    openModalToAddUser() {

        // fetch entity form data and show modal/form
        this.getFormFields('addAccount', {
            section: 'account',
            urlParams: {
                parameters: {
                    fields: 'firstName,infix,lastName,displayName,gender,email,role'
                }
            }
        });
        document.querySelector('#modal_add_account').classList.remove('hidden');
    }

    closeModalToAddUser() {

        // close modal and reset the form config from state
        document.querySelector('#modal_add_account').classList.add('hidden');
        this.actions.resetForms();
    }

    componentDidMount() {
        updateNavigationArrow();

        // get items for first time
        this.getUsers();
    }

    /**
     * Fetch form fields
     * @param {string} formId - form id
     * @param {Object} options - call options
     * @param {string} options.section - section name
     * @param {string|number} [options.id] - section id
     * @param {Object} [options.urlParams] - url params for api module
     * @returns {undefined}
     */
    getFormFields(formId, options) {
        const urlParams = options.urlParams || {};

        // show loader
        document.querySelector('#spinner').classList.remove('hidden');

        // parse endpoint url with section name and optional id
        const endpoint = `${this.api.getEndpoints().sectionInfo}/${options.section}${options.id ? `/${options.id}` : ''}`;

        // execute request
        this.api.get(
            this.api.getBaseUrl(),
            endpoint,
            {
                urlParams
            }
        ).then(response => {

            // todo: either add the formId_ to the form fields here (by iterating over each field!) or in the reducer

            // hide loader and pass the fields to the form
            document.querySelector('#spinner').classList.add('hidden');
            this.actions.storeFormDataInFormsCollection(formId, response.fields);

        }).catch((/* error */) => {
            document.querySelector('#spinner').classList.add('hidden');

            // This is an unexpected API error and the form cannot be loaded
            this.actions.addAlert({ type: 'error', text: this.i18n.users_could_not_process_your_request });
        });
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
                    identifiers: {
                        filter: 'accountHasRoles:role:slug'
                    },
                    parameters: {
                        value: ShownUserRoles.join(','),
                        fields: 'uuid,firstName,infix,lastName,accountHasRoles,role,roleName',
                        depth: 4, // avoid loop in accountHasRole resolving
                        limit: 10000
                    }
                }
            }
        ).then(response => {
            document.querySelector('#spinner').classList.add('hidden');

            this.actions.getUsers(response);
        }).catch(error => {
            document.querySelector('#spinner').classList.add('hidden');
            this.actions.addAlert({ type: 'error', text: error });
        });
    }


    render() {
        const { users, languageId } = this.props;

        // ensure i18n is updated when the languageId changes
        this.i18n = translator(this.props.languageId, 'users');

        return (
            <Users
                users={ users }
                refreshDataWithMessage={ this.refreshDataWithMessage }
                openModalToAddUser={ this.openModalToAddUser }
                closeModalToAddUser={ this.closeModalToAddUser }
                i18n={ this.i18n }
                languageId={ languageId }
            />
        );
    }
}

const mapStateToProps = state => ({
    users: state.usersReducer.users,
    languageId: state.headerReducer.languageId
});

export default connect(mapStateToProps)(Index);
