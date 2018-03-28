/**
 * Configuration module
 * Write any (default) configuration here
 * @type {{}}
 */
// todo: rename organisation, division to rootEntities, childEntities
module.exports = {
    api: {
        neon: {
            baseUrl: `${process.env.NEON_API_BASE_URL}`, // default is dev api, which is set in webpack.config.js
            endpoints: {
                abstractSection: '/section',
                participants: '/section/participant',
                organisation: '/section/fieldvalue/organisation/organisationType?value=organisation',
                division: '/section/organisation/id/{identifier}'
            },
            urlEncodeParams: false,
            skipPrefixIndexParams: true,
            requestFailedMessage: 'An error occurred while processing your request.'
        }
    }
};
