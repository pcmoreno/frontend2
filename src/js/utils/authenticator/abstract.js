import Logger from '../logger';
import AppConfig from '../../App.config';

/**
 * @class AbstractAuthenticator
 * @description Generic Authenticator interface that can be extended
 */
class AbstractAuthenticator {

    /**
     * Constructs the authenticator
     * @param {string} authenticatorName - authenticator name
     */
    constructor(authenticatorName) {
        this.logger = Logger.instance;
        this.config = AppConfig.authenticator[authenticatorName];

        if (!this.config) {
            throw new Error(`AppConfig.authenticator.${authenticatorName} is not set. Cannot create authenticator instance.`);
        }
    }

    isAuthenticated() {
        throw new Error('Method not implemented.');
    }

    authenticate() {
        throw new Error('Method not implemented.');
    }

    getAuthenticationHeaders() {
        throw new Error('Method not implemented.');
    }
}

export default AbstractAuthenticator;
