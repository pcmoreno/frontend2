/**
 * Configuration module
 * Write any (default) configuration here
 * @type {{}}
 */
// todo: note that participants is currently modeled as organisations due to the relationship fix not being deployed yet
module.exports = {
    api: {
        neon: {
            baseUrl: `${process.env.NEON_API_BASE_URL}`, // default is dev api, which is set in webpack.config.js
            endpoints: {
                abstractSection: '/section',
                organisation: '/section/organisation',
                participants: '/section/organisation'
            },
            urlEncodeParams: false,
            skipPrefixIndexParams: true,
            requestFailedMessage: 'An error occurred while processing your request.'
        }
    }
};
