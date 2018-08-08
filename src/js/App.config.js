import { UserRoles } from './constants/UserRoles';

/**
 * Configuration module
 * Write any (default) configuration here
 * @type {{}}
 */
const AppConfig = {
    headerRoutes: [
        {
            label: 'Inbox',
            link: '/inbox',
            component: 'inbox'
        },
        {
            label: 'Organisations',
            link: '/organisations',
            component: 'organisations'
        },
        {
            label: 'Tasks',
            link: '/tasks',
            component: 'tasks'
        },
        {
            label: 'Users',
            link: '/users',
            component: 'users'
        },
        {
            label: 'Participants',
            link: '/participants',
            component: 'participants'
        }
    ],
    api: {
        neon: {
            baseUrl: `${process.env.NEON_API_BASE_URL}`, // default is dev api, which is set in webpack.config.js
            endpoints: {
                authorise: '/v1/user/authorize',
                logout: '/v1/user/logout',
                abstractSection: '/v1/section',
                updateAbstractSection: '/v1/section/{section}/slug/{slug}',
                sectionInfo: '/v1/section/info', // This call gives information on how to build the form
                inbox: {
                    messages: '/v1/get-inbox-messages/{accountSlug}'
                },
                participants: {
                    entities: '/v1/section/fieldvalue/participantSession/{filter}'
                },
                competencies: {
                    availableCompetencies: '/v1/competencies-for-organisation/{slug}',
                    selectedCompetencies: '/v1/section/project/slug/{slug}',
                    addCompetency: '/v1/section/competency',
                    updateSelectedCompetencies: '/v1/section/project/slug/{slug}'
                },
                tasks: {
                    entities: '/v1/section/fieldvalue/participantSession/{filter}'
                },
                users: {
                    entities: '/v1/section/fieldvalue/account/{filter}'
                },
                organisations: {
                    rootEntities: '/v1/section/fieldvalue/organisation/organisationType?value=organisation',
                    childEntities: '/v1/section/{type}/id/{identifier}',
                    detailPanelData: '/v1/section/{type}/id/{identifier}',
                    inviteParticipants: '/v1/participant/invite'
                },
                report: {
                    entity: '/v1/get-report-data/{slug}',
                    createTextField: '/v1/section/textFieldInReport',
                    updateTextField: '/v1/section/textFieldInReport/slug/{slug}',
                    downloadIntermediateReport: '/v1/download-intermediate-report/{slug}',
                    createCompetencyScore: '/v1/section/competencyScoredInReport',
                    updateCompetencyScore: '/v1/section/competencyScoredInReport/slug/{slug}'
                },
                register: {
                    accountStatus: '/v1/user/status/{slug}',
                    createAccount: '/v1/user/invite/create-account/{slug}',
                    accountLogin: '/v1/user/invite/login/{slug}',
                    participantAcceptTerms: '/v1/participant/invite/terms-and-conditions/{slug}',
                    participantAccountHasRole: '/v1/participant/invite/account-has-role/{slug}' // todo: remove later, legacy link support
                }
            },
            urlEncodeParams: true,
            skipPrefixIndexParams: true,
            requestFailedMessage: 'An error occurred while processing your request.',

            // allow to use cross-domain cookies for authentication
            // https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
            credentials: 'include',
            logoutRedirect: '/login',
            loggingExclusions: {

                // endpoints of api errors should not be logged at all
                endpoints: [],

                // header fields from the api call that failed that should be excluded from logging
                headers: [],

                // fields from the post body of an api error that should be excluded from logging
                postBody: [
                    'password'
                ],

                // fields from the response body of an api error that should be excluded from logging
                responseBody: []
            }
        }
    },
    report: {
        textSaveInterval: 10000
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
            header: {
                featureToggleAction: [UserRoles.ROLE_APPLICATION_MANAGERS]
            },
            inbox: {
                loadAction: [UserRoles.ROLE_PARTICIPANT],
                route: [
                    UserRoles.ROLE_APPLICATION_MANAGERS,
                    UserRoles.ROLE_CONSULTANTS,
                    UserRoles.ROLE_BEDRIJFSBUREAU,
                    UserRoles.ROLE_BACKOFFICE,
                    UserRoles.ROLE_CLIENT_CENTER,
                    UserRoles.ROLE_ASSESSMENT_TEAM,
                    UserRoles.ROLE_ASSESSORS,
                    UserRoles.ROLE_PARTICIPANT
                ]
            },
            organisations: {
                route: [
                    UserRoles.ROLE_APPLICATION_MANAGERS,
                    UserRoles.ROLE_BACKOFFICE,
                    UserRoles.ROLE_BEDRIJFSBUREAU,
                    UserRoles.ROLE_CLIENT_CENTER
                ]
            },
            tasks: {
                route: [
                    UserRoles.ROLE_APPLICATION_MANAGERS,
                    UserRoles.ROLE_BACKOFFICE,
                    UserRoles.ROLE_BEDRIJFSBUREAU,
                    UserRoles.ROLE_CONSULTANTS,
                    UserRoles.ROLE_CLIENT_CENTER
                ]
            },
            report: {
                route: [
                    UserRoles.ROLE_APPLICATION_MANAGERS,
                    UserRoles.ROLE_BACKOFFICE,
                    UserRoles.ROLE_BEDRIJFSBUREAU,
                    UserRoles.ROLE_CONSULTANTS,
                    UserRoles.ROLE_CLIENT_CENTER
                ],
                writeAction: [
                    UserRoles.ROLE_APPLICATION_MANAGERS,
                    UserRoles.ROLE_BACKOFFICE,
                    UserRoles.ROLE_CONSULTANTS,
                    UserRoles.ROLE_CLIENT_CENTER
                ]
            },
            users: {
                route: [
                    UserRoles.ROLE_APPLICATION_MANAGERS,
                    UserRoles.ROLE_CLIENT_CENTER
                ]
            },
            participants: {
                route: [
                    UserRoles.ROLE_APPLICATION_MANAGERS,
                    UserRoles.ROLE_ASSESSMENT_TEAM,
                    UserRoles.ROLE_BEDRIJFSBUREAU,
                    UserRoles.ROLE_CLIENT_CENTER
                ]
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
            en: 'en_GB',
            'nl-nl': 'nl_NL',
            'nl_nl': 'nl_NL', // eslint-disable-line
            'en-gb': 'en_GB',
            'en_gb': 'en_GB', // eslint-disable-line
            'en-us': 'en_GB',
            'en_us': 'en_GB' // eslint-disable-line
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
