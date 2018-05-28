import UserRoles from './constants/UserRoles';

/**
 * Configuration module
 * Write any (default) configuration here
 * @type {{}}
 */
const AppConfig = {
    api: {
        neon: {
            baseUrl: `${process.env.NEON_API_BASE_URL}`, // default is dev api, which is set in webpack.config.js
            endpoints: {
                authorise: '/user/authorize',
                logout: '/user/logout',
                abstractSection: '/section',
                sectionInfo: '/section/info', // This call gives information on how to build the form
                participants: {
                    entities: '/section/participantSession'
                },
                tasks: {
                    entities: '/section/participantSession'
                },
                users: {
                    entities: '/section/fieldvalue/accountHasRole/role?value=1,2,3,4,5,6,7'
                },
                organisations: {
                    rootEntities: '/section/fieldvalue/organisation/organisationType?value=organisation',
                    childEntities: '/section/{type}/id/{identifier}',
                    detailPanelData: '/section/{type}/id/{identifier}' // todo: insert proper custom endpoint here
                },
                report: {
                    entities: '/section/participantSession/slug/{slug}',
                    createTextField: '/section/textFieldInReport',
                    updateTextField: '/section/textFieldInReport/slug/{slug}'
                },
                register: {
                    participant: '/section/participantSession/slug/{slug}',
                    participantStatus: '/participant/status/{slug}',
                    participantAcceptTerms: '/participant/invite/terms-and-conditions/{slug}',
                    createAccount: '/participant/invite/create-account/{slug}',
                    participantLogin: '/participant/invite/login/{slug}'
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
        neon: {
            loginRedirect: '/login'
        },
        cognito: {
            userPoolId: `${process.env.COGNITO_USER_POOL_ID}`, //  default is dev, which is set in webpack.config.js
            appClientId: `${process.env.COGNITO_APP_CLIENT_ID}`
        }
    },
    authoriser: {
        neon: {

            // example component. Can be removed once a real component/action is added.
            component: {
                editAction: [UserRoles.APPLICATION_MANAGER],
                route: [UserRoles.APPLICATION_MANAGER]
            },
            report: {
                route: [UserRoles.APPLICATION_MANAGER]
            },
            loginRedirect: '/login'
        }
    },
    global: {
        alertTimeout: 5000,
        organisations: {
            rootEntity: {
                id: 0,
                name: 'LTP',
                type: 'organisation'
            }
        }
    },
    languages: {
        supported: [
            'nl_NL',
            'en_GB'
        ],
        defaultLanguage: 'en_GB',
        mapped: {
            nl: 'nl_NL',
            en: 'en_GB'
        }
    },
    sources: {
        froala: '/web/assets/vendor/froala-editor/js/froala_editor.min.js',
        froalaParagraphPlugin: '/web/assets/vendor/froala-editor/js/paragraph_format.min.js',
        froalaListPlugin: '/web/assets/vendor/froala-editor/js/lists.min.js',
        jquery: '/web/assets/vendor/froala-editor/js/jquery.slim.min.js'
    }
};

export default AppConfig;
