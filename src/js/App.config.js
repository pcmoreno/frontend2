/**
 * Configuration module
 * Write any (default) configuration here
 * @type {{}}
 */
module.exports = {
    api: {
        neon: {
            baseUrl: `${process.env.NEON_API_BASE_URL}`, // default is dev api, which is set in webpack.config.js
            endpoints: {
                authorise: '/user/authorize',
                logout: '/user/logout',
                abstractSection: '/section',
                organisation: '/section/organisation'
            },
            urlEncodeParams: false,
            skipPrefixIndexParams: true,
            requestFailedMessage: 'An error occurred while processing your request.',

            // allow to use cross-domain cookies for authentication
            // https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
            credentials: 'include'
        }
    },
    authenticator: {
        neon: {},
        cognito: {
            userPoolId: `${process.env.COGNITO_USER_POOL_ID}`, //  default is dev, which is set in webpack.config.js
            appClientId: `${process.env.COGNITO_APP_CLIENT_ID}`
        }
    }
};
