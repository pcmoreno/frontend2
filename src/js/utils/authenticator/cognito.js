import AbstractAuthenticator from './abstract';

// examples from here: https://github.com/aws/aws-amplify/tree/amazon-cognito-identity-js%402.0.1/packages/amazon-cognito-identity-js
import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';

/**
 * @class CognitoAuthenticator
 * @description Generic API module to perform network requests to a backend
 */
class CognitoAuthenticator extends AbstractAuthenticator {

    constructor() {
        super('cognito');

        // this is used to store the user object for easy token access
        // don't worry about security, as it would otherwise be fetched from localStorage without validation
        this.cognitoUser = null;

        // prepare pool data
        const poolData = {
            UserPoolId: this.config.userPoolId,
            ClientId: this.config.appClientId
        };

        // prepare user pool
        this.userPool = new CognitoUserPool(poolData);
    }

    /**
     * Refreshes the token of the user
     * @returns {Promise} promise
     */
    refresh() {

        // recreate cognitoUser object when it was not set (for example when opening a new tab in browser)
        if (!this.cognitoUser) {
            this.cognitoUser = this.userPool.getCurrentUser();
        }

        // refresh session for cognito user
        return new Promise((resolve, reject) => {

            this.cognitoUser.getSession((sessionError, session) => {

                if (sessionError) {
                    reject(sessionError);
                } else {

                    // fetch the refresh token from the cognito user
                    const refreshToken = session.getRefreshToken();

                    this.cognitoUser.refreshSession(refreshToken, refreshError /* result */ => {

                        if (refreshError) {
                            reject(refreshError);
                        }

                        // if there was no error, resolve by default
                        // the new tokens are stored automatically
                        resolve();
                    });
                }
            });
        });
    }

    /**
     * Call the authenticator to authenticate with the given credentials
     * @param {Object} credentials - credentials object
     * @param {string} credentials.username - credentials username
     * @param {string} credentials.password - credentials password
     * @returns {Promise} authentication promise
     */
    authenticate(credentials = {}) {

        // validate input before proceeding
        if (!credentials.username || !credentials.password) {
            throw new Error('Cognito Provider: credentials username and/or password was not provided.');
        }

        // extract username and password
        const cognitoAuthDetails = {
            Username: credentials.username,
            Password: credentials.password
        };

        // prepare authentication details form user
        const authDetails = new AuthenticationDetails(cognitoAuthDetails);

        // prepare user data (connected with pool
        const userData = {
            Username: credentials.username,
            Pool: this.userPool
        };
        const cognitoUser = this.cognitoUser = new CognitoUser(userData);

        return new Promise((resolve, reject) => {

            cognitoUser.authenticateUser(authDetails, {
                onSuccess: result => {

                    // resolve with auth token. Refresh token is stored already by the sdk.
                    resolve(result.getAccessToken().getJwtToken());
                },
                onFailure: () => {

                    // for logging usage, it could be possible to check error.code
                    // UserNotFoundException (user not found)
                    // NotAuthorizedException (wrong credentials)
                    reject(new Error('Authentication failed'));
                }
            });
        });
    }
}

export default CognitoAuthenticator;
