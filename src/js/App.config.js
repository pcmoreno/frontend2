/**
 * Configuration module
 * Write any (default) configuration here
 * @type {{}}
 */
module.exports = {
    api: {
        neon: {
            baseUrl: 'http://dev.ltponline.com:8001/api/v1',
            endpoints: {
                abstractSection: '/section',
                organisation: '/section/organisation'
            },
            urlEncodeParams: false,
            skipPrefixIndexParams: true,
            requestFailedMessage: 'An error occurred while processing your request.'
        }
    }
};
