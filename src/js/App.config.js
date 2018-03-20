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
                abstractSection: '/section',
                organisation: '/section/organisation'
            },
            urlEncodeParams: false,
            skipPrefixIndexParams: true,
            requestFailedMessage: 'An error occurred while processing your request.'
        }
    },
    authenticator: {
        cognito: {
            userPoolId: `${process.env.COGNITO_USER_POOL_ID}`, //  default is dev, which is set in webpack.config.js
            appClientId: `${process.env.COGNITO_APP_CLIENT_ID}`
        }
    }
};
