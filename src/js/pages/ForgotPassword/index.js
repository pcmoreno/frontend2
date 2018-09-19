import { h, Component } from 'preact';
import ApiFactory from '../../utils/api/factory';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import translator from '../../utils/translator';
import Utils from '../../utils/utils';
import AppConfig from '../../App.config';
import Logger from '../../utils/logger';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Components from '../../constants/Components';

/** @jsx h */

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.api = ApiFactory.get('neon');

        this.submitForgotPasswordRequest = this.submitForgotPasswordRequest.bind(this);
        this.submitResetPasswordRequest = this.submitResetPasswordRequest.bind(this);
        this.validateResetToken = this.validateResetToken.bind(this);
    }

    submitResetPasswordRequest(email, token, password, passwordConfirm) {
        return new Promise((resolve, reject) => {
            this.api.post(
                this.api.getBaseUrl(),
                this.api.getEndpoints().forgotPassword.changePassword,
                {
                    payload: {
                        type: 'form',
                        formKey: 'change_password_form',
                        data: {
                            password: {
                                first: password,
                                second: passwordConfirm
                            },
                            email: email.toLowerCase(),
                            token
                        }
                    }
                }
            ).then(response => {
                resolve(response);
            }).catch(error => {
                reject(new Error('Could not request password reset email'));
                Logger.instance.error({
                    component: Components.FORGOT_PASSWORD,
                    message: `Could not request password reset email for user: ${email}, error: ${error.message || error}`
                });
            });
        });
    }

    validateResetToken(email, token) {
        return new Promise((resolve, reject) => {
            this.api.get(
                this.api.getBaseUrl(),
                this.api.getEndpoints().forgotPassword.validateToken,
                {
                    urlParams: {
                        identifiers: {
                            email: email.toLowerCase(),
                            token
                        }
                    }
                }
            ).then(response => {
                resolve(response);
            }).catch(error => {
                reject(new Error('Could not request password reset email'));
                Logger.instance.error({
                    component: Components.FORGOT_PASSWORD,
                    message: `Could not verify password reset token for user: ${email}, error: ${error.message || error}`
                });
            });
        });
    }

    /**
     * Requests a forgot password / password reset email with the given username/email)
     * @param {string} username - username (email)
     * @returns {Promise} promise
     */
    submitForgotPasswordRequest(username) {
        return new Promise((resolve, reject) => {
            this.api.post(
                this.api.getBaseUrl(),
                this.api.getEndpoints().forgotPassword.requestEmail,
                {
                    payload: {
                        type: 'form',
                        formKey: 'request_new_password_form',
                        data: {
                            email: username.toLowerCase()
                        }
                    }
                }
            ).then(response => {
                resolve(response);
            }).catch(error => {
                reject(new Error('Could not request password reset email'));
                Logger.instance.error({
                    component: Components.FORGOT_PASSWORD,
                    message: `Could not request password reset email for user: ${username.toLowerCase()}, error: ${error.message || error}`
                });
            });
        });
    }

    render() {
        const browserLanguage = Utils.getBrowserLanguage(
            AppConfig.languages.supported,
            AppConfig.languages.defaultLanguage,
            AppConfig.languages.mapped
        );
        let component = null;

        if (this.props.matches.token && this.props.matches.email) {
            component = <ResetPassword
                submitResetPasswordRequest={ this.submitResetPasswordRequest }
                validateResetToken={ this.validateResetToken }
                token={ this.props.token }
                email={ this.props.email }
                i18n={ translator(browserLanguage, ['login', 'form']) }
            />;
        } else {

            let username = '';

            if (this.props.matches && this.props.matches.username) {
                username = this.props.matches.username;
            }

            component = <ForgotPassword
                username={ username }
                submitForgotPasswordRequest={ this.submitForgotPasswordRequest }
                i18n={ translator(browserLanguage, ['login', 'form']) }
            />;
        }

        return (component);
    }
}
