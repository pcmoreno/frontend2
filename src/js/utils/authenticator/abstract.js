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
        this.config = AppConfig.authenticator[authenticatorName];
        this.user = null;

        if (!this.config) {
            throw new Error(`AppConfig.authenticator.${authenticatorName} is not set. Cannot create authenticator instance.`);
        }
    }

    /**
     * Returns the user. You must've been authenticated before calling this method
     * @returns {AbstractUser|null} user
     */
    getUser() {
        return this.user;
    }

    /**
     * Returns whether the user should be authenticated.
     * This does not guarantee that there are valid tokens, just that this user WAS/IS authenticated.
     * @returns {boolean} authenticated
     */
    isAuthenticated() {
        return (this.user !== null);
    }

    /**
     * Returns the login redirect
     * @returns {string} login redirect
     */
    getLoginRedirect() {
        return this.config.loginRedirect;
    }

    refreshAndGetUser() {
        throw new Error('Method not implemented.');
    }

    authenticate() {
        throw new Error('Method not implemented.');
    }

    refreshTokens() {
        throw new Error('Method not implemented.');
    }

    logout() {
        throw new Error('Method not implemented.');
    }
}

export default AbstractAuthenticator;
