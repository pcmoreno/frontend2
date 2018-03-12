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
                organisation: '/section/organisation'
            },
            urlEncodeParams: false,
            skipPrefixIndexParams: true,
            requestFailedMessage: 'An error occurred while processing your request.'
        }
    }
};
