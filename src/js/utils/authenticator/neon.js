import AbstractAuthenticator from './abstract';
import CognitoAuthenticator from './cognito';
import ApiFactory from '../api/factory';

/**
 * @class API
 * @description Generic API module to perform network requests to a backend
 */
class NeonAuthenticator extends AbstractAuthenticator {

    constructor() {
        super('neon');

        this.cognitoAuthenticator = new CognitoAuthenticator();
    }

    /**
     * This method will fetch a new token (automatically set as a cookie) and return the authenticated user as json response
     * @param {string} [cognitoToken] - cognito token, if this is set, the neon api will automatically renew the neon token if necessary
     * @returns {Promise} promise
     */
    fetchNeonApiTokenAndUser(cognitoToken) {
        return new Promise((resolve, reject) => {
            const api = ApiFactory.get('neon');
            const headers = new Headers();

            // set the cognito header for automatic renewal, if available
            if (cognitoToken) {
                headers.append('Authorization', cognitoToken);
            }

            fetch(
                api.getBaseUrl() + api.getEndpoints().authorise,
                {
                    method: 'get',
                    headers,
                    credentials: 'include', // allows cookies to be sent and received
                    cache: 'no-store' // make sure no responses are cached
                }
            ).then(response => {

                if (response.status === 200) {

                    // authenticate was ok, resolve with json response (user)
                    response.json().then(user => {
                        resolve(user);
                    });
                } else if (response.status === 401) {

                    // either the cognito token or the neon token is expired. We will try again by refreshing them both
                    this.refreshTokens().then(user => {
                        resolve(user);
                    }).catch(error => {

                        // refreshing failed, meaning that the cognito token is expired
                        reject(error);
                    });

                } else {

                    // unexpected response
                    reject(new Error('Unexpected authentication error'));
                }
            }).catch(error => {

                // unexpected result, means we are not authenticated and not trying again.
                reject(error);
            });
        });
    }

    /**
     * Refreshes the cognito token and neon token
     * @returns {Promise} promise
     */
    refreshTokens() {
        return new Promise((resolve, reject) => {

            // refresh cognito token
            this.cognitoAuthenticator.refreshTokens().then(cognitoToken => {

                // fetch a new neon token and return the user. Renewal of neon token is covered in this method.
                this.fetchNeonApiTokenAndUser(cognitoToken).then(user => {
                    resolve(user);
                }).catch(error => {

                    // cognito token is expired or there was an unexpected error. Token renewal failed here.
                    reject(error);
                });

            }).catch(error => {

                // cognito token is expired or there was an unexpected error. Token renewal failed here.
                reject(error);
            });
        });
    }

    /**
     * Returns the authenticated user. If a token refresh is required, then this will be handled by this method automatically
     * @returns {Promise} promise
     */
    getAuthenticatedUser() {
        return new Promise((resolve, reject) => {

            // fetch the neon api token and authenticated user. Token renewal is covered in this method
            this.fetchNeonApiTokenAndUser().then(user => {
                resolve(user);
            }).catch(error => {

                // cognito token is expired or there was an unexpected error. Token renewal failed here.
                reject(error);
            });
        });
    }

    /**
     * Call the authenticator to authenticate with the given credentials
     * @param {Object} credentials - credentials object
     * @param {string} [credentials.username] - credentials username
     * @param {string} [credentials.password] - credentials password
     * @returns {Promise} authentication promise
     */
    authenticate(credentials) {
        return new Promise((resolve, reject) => {
            this.cognitoAuthenticator.authenticate(credentials).then(cognitoToken => {

                // fetch a new neon token and return the user
                this.fetchNeonApiTokenAndUser(cognitoToken).then(user => {
                    resolve(user);
                }).catch(error => {

                    // cognito token is expired or there was an unexpected error. Token renewal failed here.
                    reject(error);
                });

            }).catch(error => {

                // reject by default when cognito authentication failed. Credentials are most likely wrong.
                reject(error);
            });
        });
    }
}

export default NeonAuthenticator;
