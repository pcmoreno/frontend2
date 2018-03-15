/**
 * @class Authenticator
 * @description Generic Authenticator module to perform and handle (api) authentication
 */
class Authenticator {

    /**
     * Creates an instance of the abstract Authenticator class
     *
     * @param {class} authenticatorInstance - authenticator instance
     * @returns {Authenticator} authenticator
     */
    static create(authenticatorInstance) {
        return new Authenticator(authenticatorInstance);
    }

    /**
     * Constructs the abstract authenticator class with a given authenticator instance
     * @param {class} authenticatorInstance - authenticator instance
     */
    constructor(authenticatorInstance) {
        this.authenticator = authenticatorInstance;

        if (!this.authenticator) {
            throw new Error('The given authenticator is not valid.');
        }
    }

    /**
     * Returns whether the system or user is authenticated with this authenticator
     * @returns {boolean} is authenticated
     */
    isAuthenticated() {
        return this.authenticator.isAuthenticated();
    }

    /**
     * Call the authenticator to authenticate with the given credentials
     * @param {Object} credentials - credentials object
     * @param {string} [credentials.username] - credentials username
     * @param {string} [credentials.password] - credentials password
     * @returns {promise} authentication promise
     */
    authenticate(credentials) {
        return this.authenticator.authenticate(credentials);
    }

    /**
     * Returns the authentication headers that are stored for this authenticator
     * @returns {{headers: {}}} headers key-value pair objects
     */
    getAuthenticationHeaders() {
        return this.authenticator.getAuthenticationHeaders();
    }
}

export default Authenticator;
