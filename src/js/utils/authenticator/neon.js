import AbstractAuthenticator from './abstract';

/**
 * @class API
 * @description Generic API module to perform network requests to a backend
 */
class NeonAuthenticator extends AbstractAuthenticator {

    constructor() {
        super('neon');
    }

    /**
     * Returns whether the system or user is authenticated with this authenticator
     * @returns {boolean} is authenticated
     */
    isAuthenticated() {

    }

    /**
     * Call the authenticator to authenticate with the given credentials
     * @param {Object} credentials - credentials object
     * @param {string} [credentials.username] - credentials username
     * @param {string} [credentials.password] - credentials password
     * @returns {promise} authentication promise
     */
    authenticate() {

    }

    /**
     * Returns the authentication headers that are stored for this authenticator
     * @returns {{headers: {}}} headers key-value pair objects
     */
    getAuthenticationHeaders() {

    }
}

export default NeonAuthenticator;
