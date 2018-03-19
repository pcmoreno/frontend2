/**
 * @class AbstractAuthenticator
 * @description Generic Authenticator interface that can be extended
 */
class AbstractAuthenticator {

    constructor() {

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
