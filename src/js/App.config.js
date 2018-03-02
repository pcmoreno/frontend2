/**
 * Configuration module
 * Write any (default) configuration here
 * @type {{}}
 */
module.exports = {
    components: {

    },
    modules: {

    },
    utils: {
        api: {
            neon: {
                baseUrl: 'http://dev.ltponline.com:8001/api/v1',
                endpoints: {
                    organisations: '/section/organisation'
                },
                urlEncodeParams: false,
                skipPrefixIndexParams: true,
                requestFailedMessage: 'An error occurred while processing your request.'
            }
        }
    }
};
