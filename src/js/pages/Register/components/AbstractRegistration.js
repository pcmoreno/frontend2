import { h, Component, render } from 'preact';
import ApiFactory from '../../../utils/api/factory';
import Redirect from '../../../utils/components/Redirect';
import translator from '../../../utils/translator';
import RegistrationError from '../constants/RegistrationError';
import Logger from '../../../utils/logger';
import CognitoAuthenticator from '../../../utils/authenticator/cognito';
import Components from '../../../constants/Components';

/** @jsx h */

/**
 * This registration component expects the following props to be set.
 * This component does not validate user status, that should be done before loading this component.
 *
 * @example
 * <Component
 *     accountHasRoleSlug={ '1235-abc-1234' }
 *     accountStatus={ 'invited' }
 *     languageId={ 'nl_NL' }
 * />
 */
export default class AbstractRegistration extends Component {
    constructor(props) {
        super(props);

        // this component expects the props below to be set when instantiating this component
        this.localState = {

            // initial properties (this root component)
            accountHasRoleSlug: props.accountHasRoleSlug,
            languageId: props.languageId,

            // register component properties
            registerError: '',
            registerButtonDisabled: false, // error handling is done after button press
            registerFields: {
                username: '',
                password: '',
                passwordConfirm: ''
            },
            isRegistered: false,

            // login component properties, conversion to lowercase is only done in methods that execute api calls
            loginFields: {
                username: '',
                password: ''
            },
            loginError: '',
            loginButtonDisabled: false,
            showLogin: false
        };

        this.api = ApiFactory.get('neon');
        this.i18n = translator(props.languageId, ['register', 'form']);
    }

    /**
     * input field onChange event listener
     * @param {Object} event - event
     * @returns {undefined}
     */
    onChangeFieldRegistrationForm(event) {
        event.preventDefault();

        // store input field value, no need to set the state to re-render
        this.localState.registerFields[event.target.id] = event.target.value;
    }

    /**
     * input field onChange event listener
     * @param {Object} event - event
     * @returns {undefined}
     */
    onChangeFieldLoginForm(event) {
        event.preventDefault();

        // store input field value, no need to set the state to re-render
        this.localState.loginFields[event.target.id] = event.target.value;
    }

    /**
     * onSubmit listener for registration form
     * @param {Object} event - event
     * @returns {undefined}
     */
    onRegisterAccount(event) {
        event.preventDefault();

        // clear errors first
        this.localState.registerError = '';
        this.localState.registerButtonDisabled = true;
        this.setState(this.localState);

        const email = this.localState.registerFields.username;
        const password = this.localState.registerFields.password;
        const passwordConfirm = this.localState.registerFields.passwordConfirm;

        // execute registration process
        try {
            this.registerAccount(email, password, passwordConfirm).then(() => {

                // call was successful
                this.localState.isRegistered = true;
                this.setState(this.localState);

            }).catch(error => {
                let errorMessage = '';

                // Always show the first error that was returned from the api
                if (error && error[0]) {
                    errorMessage = this.i18n[error[0]];
                }

                // exception matches lokalise keys
                this.localState.registerError = errorMessage || this.i18n[error.message];
                this.localState.registerButtonDisabled = false;
                this.setState(this.localState);
            });
        } catch (error) {

            // exception matches lokalise keys
            this.localState.registerError = this.i18n[error.message];
            this.localState.registerButtonDisabled = false;
            this.setState(this.localState);
        }
    }

    /**
     * onSubmit listener for login form
     * @param {Object} event - event
     * @returns {undefined}
     */
    onLoginAccount(event) {
        event.preventDefault();

        // reset error message
        this.localState.loginError = '';
        this.localState.loginButtonDisabled = true;
        this.setState(this.localState);

        const username = this.localState.loginFields.username;
        const password = this.localState.loginFields.password;

        // execute login process
        try {
            this.loginAccount(this.localState.accountHasRoleSlug, username, password).then(() => {

                // login successful, go to default (inbox page)
                render(<Redirect to={ '/' } refresh={ true }/>);

            }).catch(error => {

                // exception matches lokalise keys
                this.localState.loginError = this.i18n[error.message];
                this.localState.loginButtonDisabled = false;
                this.setState(this.localState);
            });
        } catch (error) {

            // exception matches lokalise keys
            this.localState.loginError = this.i18n[error.message];
            this.localState.loginButtonDisabled = false;
            this.setState(this.localState);
        }
    }

    /**
     * onClick listener for switching between registration and login
     * @param {Object} event - event
     * @returns {undefined}
     */
    switchToLogin(event) {
        event.preventDefault();

        // switch show login
        this.localState.showLogin = !this.localState.showLogin;
        this.setState(this.localState);
    }

    /**
     * Handles registration (api call)
     * @param {string} username - username
     * @param {string} password - password
     * @param {string} passwordConfirm - password confirm
     * @returns {Promise<any>} promise
     */
    registerAccount(username, password, passwordConfirm) {

        // validate fields to be filled
        if (!username || !password || !passwordConfirm) {
            throw new Error(RegistrationError.ALL_FIELDS_REQUIRED);
        }

        // todo: do we need to set any validation like password strength/length??
        // set password error if passwords don't match
        if (password !== passwordConfirm) {
            throw new Error(RegistrationError.PASSWORD_DONT_MATCH);
        }

        // perform api call
        return new Promise((resolve, reject) => {
            this.api.post(
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
                            username: username.toLowerCase(),
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
                    return reject(response.errors || new Error(RegistrationError.UNEXPECTED_ERROR));
                }

                // call succeeded
                return resolve();

            }).catch(() => {

                // the request failed so enable the register button again
                reject(new Error(RegistrationError.UNEXPECTED_ERROR));
            });
        });
    }

    /**
     * Handles login + accept invite (api call)
     * @param {string} accountHasRoleSlug - accountHasRoleSlug
     * @param {string} username - username
     * @param {string} password - password
     * @returns {Promise<any>} promise
     */
    loginAccount(accountHasRoleSlug, username, password) {
        const cognitoAuthenticator = new CognitoAuthenticator();

        // check input values
        if (!accountHasRoleSlug || !username || !password) {
            throw new Error(RegistrationError.ALL_FIELDS_REQUIRED);
        }

        // perform api call
        return new Promise((resolve, reject) => {

            // get cognito token to perform the custom login afterwards, authenticator does lowercase conversion
            cognitoAuthenticator.authenticate({
                username,
                password
            }).then(token => {

                // execute the custom login api call
                // return this promise so that exceptions are handled in parent/upper catch
                this.api.post(
                    this.api.getBaseUrl(),
                    this.api.getEndpoints().register.accountLogin,
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
                                username: username.toLowerCase(),
                                password
                            }
                        }
                    }
                ).then(response => {

                    // validate that there was user information returned
                    // thrown errors are caught by the parent/upper catch
                    if (!response.user) {
                        Logger.instance.error({
                            component: Components.REGISTER,
                            message: `Could not fetch user information (login) for accountHasRole: ${accountHasRoleSlug}`
                        });
                        return reject(new Error(RegistrationError.UNEXPECTED_ERROR));
                    }

                    // go to default (inbox page)
                    return render(<Redirect to={'/'} refresh={true}/>);

                }).catch(() => {
                    reject(new Error(RegistrationError.LOGIN_FAILED));
                });

            }).catch(() => {
                reject(new Error(RegistrationError.LOGIN_FAILED));
            });
        });
    }
}
