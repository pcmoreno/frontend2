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
                participants: {
                    entities: '/section/participant'
                },
                organisations: {
                    rootEntities: '/section/fieldvalue/organisation/organisationType?value=organisation',
                    childEntities: '/section/{type}/id/{identifier}',
                    detailPanelData: '/section/{type}/id/{identifier}' // todo: insert proper custom endpoint here and also allow injecting {type}
                }
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
