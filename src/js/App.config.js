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
                participants: {
                    entities: '/section/participant'
                },
                organisations: {
                    rootEntities: '/section/fieldvalue/organisation/organisationType?value=organisation',
                    childEntities: '/section/organisation/id/{identifier}'
                }
            },
            urlEncodeParams: false,
            skipPrefixIndexParams: true,
            requestFailedMessage: 'An error occurred while processing your request.',

            // allow to use cross-domain cookies for authentication
            // https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
            credentials: 'include',
            logoutRedirect: '/login'
        }
    },
    authenticator: {
        neon: {},
        cognito: {
            userPoolId: `${process.env.COGNITO_USER_POOL_ID}`, //  default is dev, which is set in webpack.config.js
            appClientId: `${process.env.COGNITO_APP_CLIENT_ID}`
        }
    },
    authoriser: {
        neon: {

            // example component. Can be removed once a real component/action is added.
            component: {
                action: ['Application Manager']
            }
        }
    },
    global: {
        organisations: {
            rootEntitiesParentName: 'LTP'
        }
    }
};
