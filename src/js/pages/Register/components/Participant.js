import { h, Component, render } from 'preact';
import ApiFactory from '../../../utils/api/factory';
import Terms from './../components/Terms/Terms';
import Redirect from '../../../utils/components/Redirect';
import Register from './../components/Register/Register';
import translator from '../../../utils/translator';
import Login from './../components/Login/Login';
import CognitoAuthenticator from '../../../utils/authenticator/cognito';

/** @jsx h */

const termsAcceptedStatus = 'termsAndConditionsAccepted';
const loginEndpoint = '/login';
const registrationSuccessful = '?registrationSuccess=true';

export default class Participant extends Component {
    constructor(props) {
        super(props);

        // this component expects the props below to be set when instantiating this component
        this.localState = {

            // initial properties (this root component)
            accountHasRoleSlug: props.accountHasRoleSlug,
            termsAccepted: props.status === termsAcceptedStatus,
            languageId: props.languageId,
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
        this.i18n = {};
    }

    onApproveTerms(event) {
        event.preventDefault();

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
                            slug: this.localState.accountHasRoleSlug
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

    onChangeFieldRegistrationForm(event) {
        event.preventDefault();

        // store input field value, no need to set the state to re-render
        this.localState.registerFields[event.target.id] = event.target.value;
    }

    onRegisterAccount(event) {
        event.preventDefault();

        // clear errors first
        this.localState.registerError = '';
        this.setState(this.localState);

        const email = this.localState.registerFields.username;
        const password = this.localState.registerFields.password;
        const passwordConfirm = this.localState.registerFields.passwordConfirm;

        // validate fields to be filled
        if (!email || !password || !passwordConfirm) {
            this.localState.registerError = this.i18n.register_all_fields_required;
            return this.setState(this.localState);
        }

        // todo: do we need to set any validation like password strength/length??
        // set password error if passwords don't match
        if (password !== passwordConfirm) {
            this.localState.registerError = this.i18n.register_passwords_dont_match;
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
                        slug: this.localState.accountHasRoleSlug
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
                this.localState.registerError = response.errors[0] || this.i18n.api_general_error;
                this.localState.registerButtonDisabled = false;

            } else {

                // the call succeeded
                this.localState.isRegistered = true;
            }

            this.setState(this.localState);

        }).catch(() => {

            // the request failed so enable the register button again
            this.localState.registerError = this.i18n.api_general_error;
            this.localState.registerButtonDisabled = false;
            this.setState(this.localState);
        });
    }

    onChangeTermsApproval(event) {
        event.preventDefault();

        // save checkbox state and enable or disable the next button
        this.localState.approvalCheckboxChecked = event.target.checked;
        this.localState.approvalButtonDisabled = !this.localState.approvalCheckboxChecked;
        this.setState(this.localState);
    }

    onLoginAccount(event) {
        event.preventDefault();

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
            this.setState(this.localState);

            // get cognito token to perform the custom login afterwards
            cognitoAuthenticator.authenticate({
                username,
                password
            }).then(token => {

                // execute the custom login api call
                // return this promise so that exceptions are handled in parent/upper catch
                api.post(
                    this.api.getBaseUrl(),
                    this.api.getEndpoints().register.participantLogin,
                    {
                        urlParams: {
                            identifiers: {
                                slug: this.localState.accountHasRoleSlug
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

                }).catch(() => {
                    this.localState.loginError = this.i18n.register_login_failed;
                    this.localState.loginButtonDisabled = false;
                    this.setState(this.localState);
                });

            }).catch(() => {
                this.localState.loginError = this.i18n.register_login_failed;
                this.localState.loginButtonDisabled = false;
                this.setState(this.localState);
            });

        } else {
            this.localState.loginError = this.i18n.register_all_fields_required;
            this.setState(this.localState);
        }
    }

    onChangeFieldLoginForm(event) {
        event.preventDefault();

        // store input field value, no need to set the state to re-render
        this.localState.loginFields[event.target.id] = event.target.value;
    }

    switchToLogin(event) {
        event.preventDefault();

        // switch show login
        this.localState.showLogin = !this.localState.showLogin;
        this.setState(this.localState);
    }

    render() {
        let component = null;

        const {
            accountHasRoleSlug,
            languageId,
            termsAccepted,
            isRegistered,
            showLogin,
            loginError,
            registerError,
            registerButtonDisabled,
            loginButtonDisabled,
            approvalButtonDisabled
        } = this.localState;

        // do not render when we don't have participant id or don't know the approval status
        if (!accountHasRoleSlug || !languageId) {
            return null;
        }

        // render terms component when they were not approved yet
        if (!termsAccepted) {
            component = <Terms
                i18n = { translator(languageId, 'register') }
                onSubmit = { this.onApproveTerms.bind(this) }
                onChange = { this.onChangeTermsApproval.bind(this) }
                buttonDisabled = { approvalButtonDisabled }
            />;

        } else if (termsAccepted && !isRegistered) {

            // show participant login when this was requested
            if (showLogin) {

                component = <Login
                    i18n = { translator(languageId, 'register') }
                    language = { languageId }
                    error = { loginError }
                    buttonDisabled = { loginButtonDisabled }
                    onSubmit = { this.onLoginAccount.bind(this) }
                    onChange = { this.onChangeFieldLoginForm.bind(this) }
                    showLogin = { this.switchToLogin.bind(this) }
                />;

            } else {

                // show register by default
                component = <Register
                    i18n = { translator(languageId, 'register') }
                    error = { registerError }
                    buttonDisabled = { registerButtonDisabled }
                    onSubmit = { this.onRegisterAccount.bind(this) }
                    onChange = { this.onChangeFieldRegistrationForm.bind(this) }
                    showLogin = { this.switchToLogin.bind(this) }
                />;
            }

        } else if (isRegistered) {
            render(<Redirect to={loginEndpoint + registrationSuccessful} refresh={true}/>);
        }

        // return the correct register component
        return component;
    }
}
