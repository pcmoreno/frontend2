import { h, Component } from 'preact';

/** @jsx h */

import { bindActionCreators } from 'redux';
import { connect } from 'preact-redux';
import * as usersActions from './actions/users';
import * as alertActions from './../../components/Alert/actions/alert';
import * as formActions from './../../components/Form/actions/form';
import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import ApiFactory from '../../utils/api/factory';
import Users from './components/Users/Users';
import translator from '../../utils/translator';

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

        this.api = ApiFactory.get('neon');
        this.i18n = translator(this.props.languageId, 'users');
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

        // fetch entity form data and show modal/form
        this.getFormFields('addAccount', {
            section: 'account',
            urlParams: {
                parameters: {
                    fields: 'firstName,infix,lastName,displayName,email,accountHasRoleRole'
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

    componentWillMount() {
        document.title = 'Users';
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

            // This is an unexpected API error and the form cannot be loaded
            this.actions.addAlert({ type: 'error', text: this.i18n.form_could_not_process_your_request });
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
                        roleValue: 'role?value=1,2,3,4,5,6,7'
                    },
                    parameters: {
                        fields: 'uuid,account,firstName,infix,lastName,role,roleName',
                        limit: 10000
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
        const { users, languageId } = this.props;

        this.i18n = translator(languageId, 'users');

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
