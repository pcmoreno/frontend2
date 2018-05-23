import { h, Component, render } from 'preact';
import ApiFactory from '../../utils/api/factory';
import Terms from './components/Terms/Terms';
import Logger from '../../utils/logger';
import Redirect from '../../utils/components/Redirect';
import Register from './components/Register/Register';
import translator from '../../utils/translator';
import Utils from '../../utils/utils';
import Login from './components/Login/Login';
import CognitoAuthenticator from '../../utils/authenticator/cognito';

/** @jsx h */

const termsAccepted = 'termsAndConditionsAccepted';
const invited = 'invited';
const loginEndpoint = '/login';
const registrationSuccessful = '?registrationSuccess=true';

// todo: check translations of (error) messages

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.localState = {

            // initial properties (this root component)
            participantSessionId: null,
            termsAccepted: null,
            languageId: '',
            approvalCheckboxChecked: false,

            // terms component properties
            approvalButtonDisabled: true,

            // register component properties
            registerError: '',
            registerButtonDisabled: false, // error handling is done after button press
            registerFields: {
                username: '',
                password: '',
                passwordConfirm: ''
            },
            isRegistered: false,

            // login component properties
            loginFields: {
                username: '',
                password: ''
            },
            loginError: '',
            loginButtonDisabled: false,
            showLogin: false
        };

        this.api = ApiFactory.get('neon');
    }

    componentDidMount() {

        // check if there was a user logged in, if so, logout and refresh the page
        if (this.api.getAuthenticator().isAuthenticated()) {
            this.api.getAuthenticator().logout().then(() => {

                // logout successful, refresh this page
                render(<Redirect to={window.location.pathname} refresh={true}/>);
            }, error => {
                Logger.instance.error(`Could not logout on register page: ${error}`);
            });

            return;
        }

        // check terms approval status
        if (this.localState.participantSessionId && this.localState.termsAccepted === null) {
            this.fetchParticipantStatus(this.localState.participantSessionId);
        }
    }

    fetchParticipantStatus(participantSessionId) {

        // request participant session data for terms approval status
        this.api.get(
            this.api.getBaseUrl(),
            this.api.getEndpoints().register.participantStatus,
            {
                urlParams: {
                    identifiers: {
                        slug: participantSessionId
                    }
                }
            }
        ).then(response => {

            if (response.status && response.language) {

                // convert given language to frontend usable language (e.g. nl-NL to nl_NL)
                this.localState.languageId = Utils.convertParticipantLanguage(response.language);

                // check the terms accepted status
                switch (response.status) {
                    case invited:
                        this.localState.termsAccepted = false;
                        this.setState(this.localState);
                        break;
                    case termsAccepted:
                        this.localState.termsAccepted = true;
                        this.setState(this.localState);
                        break;
                    default:

                        // when the user has any other status, you should be redirected to login
                        render(<Redirect to={loginEndpoint} refresh={true}/>);
                        break;
                }
            } else {

                // todo: show an error when invitation link was not valid anymore?
            }
        });
    }

    onApproveTerms(evt) {
        evt.preventDefault();

        if (this.localState.approvalCheckboxChecked) {

            // disable button to avoid bashing
            this.localState.approvalButtonDisabled = true;
            this.setState(this.localState);

            // API call that will store the participant session status (Accept the terms)
            this.api.post(
                this.api.getBaseUrl(),
                this.api.getEndpoints().register.participantAcceptTerms,
                {
                    urlParams: {
                        identifiers: {
                            slug: this.localState.participantSessionId
                        }
                    },
                    payload: {
                        type: 'form',
                        formKey: 'accept_terms_and_conditions_form',
                        data: {
                            accept: true
                        }
                    }
                }
            ).then(() => {

                // set state approved, so it will render the registration component
                this.localState.termsAccepted = true;
                this.setState(this.localState);
            });
        }
    }

    onChangeFieldRegistrationForm(evt) {
        evt.preventDefault();

        // store input field value, no need to set the state to re-render
        this.localState.registerFields[evt.target.id] = evt.target.value;
    }

    onRegisterAccount(evt) {
        evt.preventDefault();

        // clear errors first
        this.localState.registerError = '';
        this.setState(this.localState);

        const email = this.localState.registerFields.username;
        const password = this.localState.registerFields.password;
        const passwordConfirm = this.localState.registerFields.passwordConfirm;

        // validate fields to be filled
        if (!email || !password || !passwordConfirm) {
            this.localState.registerError = 'All fields are required.'; // todo: translate
            return this.setState(this.localState);
        }

        // todo: do we need to set any validation like password strength/length??
        // set password error if passwords don't match
        if (password !== passwordConfirm) {
            this.localState.registerError = 'Passwords do not match'; // todo: translate
            return this.setState(this.localState);
        }

        // at this point all validation is done, disable submit button and perform the api request
        this.localState.registerButtonDisabled = true;
        this.setState(this.localState);

        // perform api call
        return this.api.post(
            this.api.getBaseUrl(),
            this.api.getEndpoints().register.createAccount,
            {
                urlParams: {
                    identifiers: {
                        slug: this.localState.participantSessionId
                    }
                },
                payload: {
                    type: 'form',
                    formKey: 'register_account_for_participant_form',
                    data: {
                        username: email,
                        password: {
                            first: password,
                            second: passwordConfirm
                        }
                    }
                }
            }
        ).then(response => {

            // check for input validation errors form the API
            if (response.errors) {

                // for now always just display the first error
                this.localState.registerError = response.errors[0] || 'Could not process your request.';
                this.localState.registerButtonDisabled = false;

            } else {

                // the call succeeded
                this.localState.isRegistered = true;
            }

            this.setState(this.localState);

        }).catch(() => {

            // the request failed so enable the register button again
            this.localState.registerError = 'Could not process your request.';
            this.localState.registerButtonDisabled = false;
            this.setState(this.localState);
        });
    }

    onChangeTermsApproval(evt) {
        evt.preventDefault();

        // save checkbox state and enable or disable the next button
        this.localState.approvalCheckboxChecked = evt.target.checked;
        this.localState.approvalButtonDisabled = !this.localState.approvalCheckboxChecked;
        this.setState(this.localState);
    }

    onLoginAccount(evt) {
        evt.preventDefault();

        // reset error message
        this.localState.loginError = '';
        this.setState(this.localState);

        // get all required vars
        const api = ApiFactory.get('neon');
        const cognitoAuthenticator = new CognitoAuthenticator();
        const username = this.localState.loginFields.username;
        const password = this.localState.loginFields.password;

        // check input values and login
        if (username && password) {

            // disable button
            this.localState.loginButtonDisabled = true;

            // get cognito token to performt the custom login afterwards
            cognitoAuthenticator.authenticate({
                username,
                password
            }).then(token => {

                // execute the custom login api call
                // return this promise so that exceptions are handled in parent/upper catch
                return api.post(
                    this.api.getBaseUrl(),
                    this.api.getEndpoints().register.participantLogin,
                    {
                        urlParams: {
                            identifiers: {
                                slug: this.localState.participantSessionId
                            }
                        },
                        headers: {
                            Authorization: token
                        },
                        payload: {
                            type: 'form',
                            data: {
                                username,
                                password
                            }
                        }
                    }
                ).then(response => {

                    // validate that there was user information returned
                    // thrown errors are caught by the parent/upper catch
                    if (!response.user) {
                        throw Error('Could not fetch use information while authenticating');
                    }

                    // go to default (inbox page)
                    render(<Redirect to={'/'} refresh={true}/>);
                });

            }).catch(() => {

                // todo: translate message
                this.localState.loginError = 'Inloggen mislukt. Probeer het opnieuw.';
                this.localState.loginButtonDisabled = false;
            });

        } else {

            // todo: translate message
            this.localState.loginError = 'Voer a.u.b. de verplichte velden in.';
        }

        // always set the new state
        this.setState(this.localState);
    }

    onChangeFieldLoginForm(evt) {
        evt.preventDefault();

        // store input field value, no need to set the state to re-render
        this.localState.loginFields[evt.target.id] = evt.target.value;
    }

    switchToLogin(evt) {
        evt.preventDefault();

        // switch show login
        this.localState.showLogin = !this.localState.showLogin;
        this.setState(this.localState);
    }

    render() {
        let component = null;

        // retrieve report data by URL parameters
        this.localState.participantSessionId = this.props.matches.participantSessionId;

        // do not render when we don't have participant id or don't know the approval status
        if (!this.localState.participantSessionId ||
            !this.localState.languageId ||
            this.localState.termsAccepted === null) {

            return null;
        }

        // render terms component when they were not approved yet
        if (!this.localState.termsAccepted) {
            component = <Terms
                i18n = { translator(this.localState.languageId, 'terms') }
                onSubmit = { this.onApproveTerms.bind(this) }
                onChange = { this.onChangeTermsApproval.bind(this) }
                buttonDisabled = { this.localState.approvalButtonDisabled }
            />;

        } else if (this.localState.termsAccepted && !this.localState.isRegistered) {

            // show participant login when this was requested
            if (this.localState.showLogin) {

                component = <Login
                    i18n = { translator(this.localState.languageId, 'terms') } // todo: load and implement 'login' translations
                    error = { this.localState.loginError }
                    buttonDisabled = { this.localState.loginButtonDisabled }
                    onSubmit = { this.onLoginAccount.bind(this) }
                    onChange = { this.onChangeFieldLoginForm.bind(this) }
                    showLogin = { this.switchToLogin.bind(this) }
                />;

            } else {

                // show register by default
                component = <Register
                    i18n = { translator(this.localState.languageId, 'terms') } // todo: load and implement 'register' translations
                    error = { this.localState.registerError }
                    buttonDisabled = { this.localState.registerButtonDisabled }
                    onSubmit = { this.onRegisterAccount.bind(this) }
                    onChange = { this.onChangeFieldRegistrationForm.bind(this) }
                    participantSessionId = { this.localState.participantSessionId }
                    showLogin = { this.switchToLogin.bind(this) }
                />;
            }

        } else if (this.localState.isRegistered) {
            render(<Redirect to={loginEndpoint + registrationSuccessful} refresh={true}/>);
        }

        // return the correct register component
        return component;
    }
}
