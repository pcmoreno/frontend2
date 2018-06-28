import { h, Component, render } from 'preact';
import ApiFactory from '../../utils/api/factory';
import Logger from '../../utils/logger';
import Redirect from '../../utils/components/Redirect';
import UserRoles from '../../constants/UserRoles';
import ParticipantStatus from '../../constants/ParticipantStatus';
import UserStatus from '../../constants/UserStatus';
import AppConfig from '../../App.config';

/** @jsx h */

const RegisterComponents = {
    USER: 'users',
    PARTICIPANT: 'participant'
};

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.localState = {
            componentToRender: null,
            accountHasRole: null,

            // initial properties (this root component), todo: remove participantSession later (legacy links)
            accountHasRoleSlug: this.props.matches.accountHasRoleSlug,
            participantSessionSlug: this.props.matches.participantSessionSlug
        };

        this.api = ApiFactory.get('neon');
    }

    /**
     * Executes an API call to fetch the information for accountHasRole
     * @param {string} accountHasRoleSlug - accountHasRoleSlug
     * @returns {Promise} promise
     */
    fetchAccountHasRoleInformation(accountHasRoleSlug) {

        // request participant session data for terms approval status
        return this.api.get(
            this.api.getBaseUrl(),
            this.api.getEndpoints().register.userStatus,
            {
                urlParams: {
                    identifiers: {
                        slug: accountHasRoleSlug
                    }
                }
            }
        );
    }

    /**
     * Executes an API call to fetch the information for accountHasRole based on participantSessionSlug
     * todo: method can be removed once we don't support legacy registration links
     * @param {string} participantSessionSlug - participantSessionSlug
     * @returns {Promise} promise
     */
    fetchAccountHasRoleForParticipant(participantSessionSlug) {

        // request the accountHasRoleSlug for the given participant
        return this.api.get(
            this.api.getBaseUrl(),
            this.api.getEndpoints().register.accountHasRole,
            {
                urlParams: {
                    identifiers: {
                        slug: participantSessionSlug
                    }
                }
            }
        );
    }

    componentDidMount() {

        // check if there was a user logged in, if so, logout and refresh the page
        if (this.api.getAuthenticator().isAuthenticated()) {
            this.api.getAuthenticator().logout().then(() => {

                // logout successful, refresh this page
                render(<Redirect to={ window.location.pathname } refresh={ true }/>);
            }, error => {
                Logger.instance.error({
                    component: 'register',
                    message: `Could not logout on register page: ${error}`
                });
            });

            return;
        }

        // proceed with the registration
        this.initializeRegistration();
    }

    /**
     * Initializes the registration, based on incoming props (see localState)
     * @returns {undefined}
     */
    initializeRegistration() {
        const accountHasRoleSlug = this.localState.accountHasRoleSlug,
            participantSessionSlug = this.localState.participantSessionSlug;

        // based on the incoming props, determine which fetch all we should execute
        // for participantSession we'll need to fetch AccountHasRole + status info
        // for accountHasRole we'll only need to fetch the status info.
        // participantSessionSlug is only used to support the legacy links from neon 1.
        if (accountHasRoleSlug) {

            // fetch accountHasRole information
            this.fetchAccountHasRoleInformation(accountHasRoleSlug).then(response => {

                // validate parse the response (accountHasRole)
                this.loadRegistration(response);

            }).catch(() => {
                Logger.instance.error({
                    component: 'register',
                    message: `Could not fetch accountHasRole for accountHasRoleSlug: ${accountHasRoleSlug}`
                });
            });

        } else if (participantSessionSlug) {

            // fetch accountHasRole information, but based on participantSessionSlug (old invitation links)
            // todo: this else if and the method called can be removed to stop supporting legacy links
            this.fetchAccountHasRoleForParticipant(participantSessionSlug).then(response => {

                // save the accountHasRoleSlug
                this.localState.accountHasRoleSlug = response.accountHasRoleSlug;

                // validate parse the response (accountHasRole)
                this.loadRegistration(response);

            }).catch(() => {
                Logger.instance.error({
                    component: 'register',
                    message: `Could not fetch accountHasRole for participantSessionSlug: ${participantSessionSlug}`
                });
            });
        }
    }

    /**
     * Validates the registration status for users and participants
     * @param {Object} accountHasRole - account has role information
     * @param {string} accountHasRole.role - role names
     * @param {string} accountHasRole.status - status
     * @param {string} [accountHasRole.accountHasRoleSlug] - status
     * @param {string} [accountHasRole.language] - status
     * @returns {undefined}
     */
    loadRegistration(accountHasRole = {}) {

        // check if we're handling a user or participant
        // for now all other roles are treated like a regular user
        if (accountHasRole.role === UserRoles.ROLE_PARTICIPANT) {

            // validate the participant status
            if (accountHasRole.status === ParticipantStatus.INVITED ||
                accountHasRole.status === ParticipantStatus.TERMS_AND_CONDITIONS_ACCEPTED) {

                // load the registration component for participant
                this.loadRegistrationComponent(accountHasRole, RegisterComponents.PARTICIPANT);

            } else {

                // this participant has no status to register
                this.redirectToLogin();
            }

        } else {

            // validate the user status
            if (accountHasRole.status === UserStatus.INVITED) {

                // load registration component for the user
                this.loadRegistrationComponent(accountHasRole, RegisterComponents.USER);

            } else {

                // this user has no status to register
                this.redirectToLogin();
            }
        }
    }

    /**
     * Redirects to the login page
     * @returns {undefined}
     */
    redirectToLogin() {
        render(<Redirect to={ AppConfig.authenticator.neon.loginRedirect } refresh={ true }/>);
    }

    /**
     * Triggers the load of the registration component for a participant or user
     * @param {Object} accountHasRole - account has role information
     * @param {string} accountHasRole.role - role names
     * @param {string} accountHasRole.status - status
     * @param {string} [accountHasRole.accountHasRoleSlug] - status
     * @param {string} [accountHasRole.language] - status
     * @param {string} registrationComponent - registration component (constant)
     * @returns {undefined}
     */
    loadRegistrationComponent(accountHasRole = {}, registrationComponent) {
        const accountHasRoleSlug = this.localState.accountHasRoleSlug;

        // validate required properties
        if (!accountHasRole.role || !accountHasRole.status || !accountHasRoleSlug || !registrationComponent) {
            Logger.instance.error({
                component: 'register',
                message: `Could not load registration for ${registrationComponent.toLowerCase()}: ${JSON.stringify(accountHasRole)}`
            });

            this.redirectToLogin();
        }

        // set the properties to render the registration for participant
        this.localState.componentToRender = registrationComponent;
        this.localState.accountHasRole = accountHasRole;
        this.setState(this.localState);
    }

    render() {
        let component = null;

        const { accountHasRole, accountHasRoleSlug, componentToRender } = this.localState;

        // validate required state props before rendering
        if (accountHasRole && componentToRender && accountHasRoleSlug) {

            // determine which component to return
            switch (componentToRender) {

                case RegisterComponents.USER:

                    // todo: return user component

                    break;

                case RegisterComponents.PARTICIPANT:

                    // todo: return participant component

                    break;

                default:
                    break;
            }
        }

        return component;
    }
}
