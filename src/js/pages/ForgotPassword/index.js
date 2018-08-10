import { h, Component, render } from 'preact';
import ApiFactory from '../../utils/api/factory';

/** @jsx h */

import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import translator from '../../utils/translator';
import Utils from '../../utils/utils';
import AppConfig from '../../App.config';

// import Logger from '../../utils/logger';

export default class Index extends Component {
    constructor(props) {
        super(props);

        this.api = ApiFactory.get('neon');

        this.submitForgotPasswordRequest = this.submitForgotPasswordRequest.bind(this);
    }

    /**
     * Requests a forgot password / password reset email with the given username/email)
     * @param {string} username - username (email)
     * @returns {Promise} promise
     */
    submitForgotPasswordRequest(username) {
        return new Promise((resolve, reject) => {

            // todo: implement actual api call here to request the email
            // console.log('request email');

            // todo: resolve with empty object when call succeeds, remove two lines below
            resolve({ username });
            reject(new Error(''));

            // todo: put in catch
            // reject(new Error('Could not request password reset email'));
            // Logger.instance.error({
            //     component: 'login',
            //     message: `Could not request password reset email for user: ${username}`
            // });
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
                i18n={ translator(browserLanguage, 'login') }
            />
        );
    }
}
