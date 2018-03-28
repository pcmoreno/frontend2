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
                participants: '/section/participant',
                rootEntities: '/section/fieldvalue/organisation/organisationType?value=organisation',
                childEntities: '/section/organisation/id/{identifier}'
            },
            urlEncodeParams: false,
            skipPrefixIndexParams: true,
            requestFailedMessage: 'An error occurred while processing your request.'
        }
    },
    global: {
        organisations: {
            rootEntitiesParentName: 'LTP'
        }
    }
};
