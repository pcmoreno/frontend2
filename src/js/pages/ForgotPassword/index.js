import { h, Component } from 'preact';
import ApiFactory from '../../utils/api/factory';

/** @jsx h */

import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import translator from '../../utils/translator';
import Utils from '../../utils/utils';
import AppConfig from '../../App.config';
import Logger from '../../utils/logger';

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.api = ApiFactory.get('neon');

        this.submitForgotPasswordRequest = this.submitForgotPasswordRequest.bind(this);
    validateResetToken(email, token) {
        return new Promise((resolve, reject) => {
            this.api.get(
                this.api.getBaseUrl(),
                this.api.getEndpoints().forgotPassword.validateToken,
                {
                    urlParams: {
                        identifiers: {
                            email,
                            token
                        }
                    }
                }
            ).then(response => {
                resolve(response);
            }).catch(error => {
                reject(new Error('Could not request password reset email'));
                Logger.instance.error({
                    component: 'login',
                    message: `Could verify password reset token for user: ${email}, error: ${error.message || error}`
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
                            email: username
                        }
                    }
                }
            ).then(response => {
                resolve(response);
            }).catch(error => {
                reject(new Error('Could not request password reset email'));
                Logger.instance.error({
                    component: 'login',
                    message: `Could not request password reset email for user: ${username}, error: ${error.message || error}`
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

        return (
            <ForgotPassword
                submitForgotPasswordRequest={ this.submitForgotPasswordRequest }
                i18n={ translator(browserLanguage, ['login', 'form']) }
            />
        );
    }
}
