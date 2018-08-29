import Logger from '../logger';

// TODO: Implement test methods for logz.io when built in... (production env)
// TODO: console.error is being called (as intended to for the test), however this looks like an error in the console when running the unit tests

test('check if error calls console.error', () => {

    // declare logger and define mocked error objects
    let logger = Logger.instance;
    let error1 = {
        component: 'API',
        message: 'API call failed',
        responseStatus: 500,
        responseBody: '{"message":"Internal Server Error"}'
    };

    let error2 = {
        component: 'Organisations overview',
        message: 'An error occurred',
        responseStatus: null,
        responseBody: null
    };

    // spy on methods, so we can track count and eventually mock responses
    // mocking responses is also possible by appending .and.returnValue(value)
    spyOn(global.console, 'error');

    // call logger error twice with error objects
    logger.error(error1);
    logger.error(error2);

    // expected result
    expect(global.console.error.calls.count()).toBe(2);

    // regularly use expect(global.console.error).toHaveBeenCalledWith(params);
    // but that does not work with multiple calls. Use the callArgs check instead.
    expect(global.console.error.calls.allArgs()).toEqual([
        [
            'Error in component API: ',
            {
                application: 'neon-frontend',
                applicationUrl: 'http://localhost:9000/',
                responseStatus: 500,
                component: 'API',
                environment: 'test',
                message: 'API call failed',
                neonApiResponse: null,
                responseBody: '{"message":"Internal Server Error"}',
                session: Logger.instance.sessionId,
                type: 'error',
                userAgent: navigator.userAgent
            }
        ],
        [
            'Error in component Organisations overview: ',
            {
                application: 'neon-frontend',
                applicationUrl: 'http://localhost:9000/',
                responseStatus: null,
                component: 'Organisations overview',
                environment: 'test',
                message: 'An error occurred',
                neonApiResponse: null,
                responseBody: null,
                session: Logger.instance.sessionId,
                type: 'error',
                userAgent: navigator.userAgent
            }
        ]
    ]);
});

test('check if validation of logObject is correct', () => {

    // declare logger and define mocked error objects
    let logger = Logger.instance;
    let errors = [
        {
            component: null,
            message: 'API call failed'
        },
        {
            component: '',
            message: 'API call failed'
        },
        {
            component: 'Organisations overview',
            message: null
        },
        {
            component: 'Organisations overview',
            message: ''
        },
        {
            component: 'Organisations overview',
            message: 'Message'
        }
    ];

    // expected result for direct validation
    expect(Logger.validateLogObject(errors[0])).toEqual(false);
    expect(Logger.validateLogObject(errors[1])).toEqual(false);
    expect(Logger.validateLogObject(errors[2])).toEqual(false);
    expect(Logger.validateLogObject(errors[3])).toEqual(false);
    expect(Logger.validateLogObject(errors[4])).toEqual(true);

    // test console methods not to be called once validation fails
    spyOn(global.console, 'error');
    spyOn(global.console, 'warn');
    spyOn(global.console, 'log');

    // call logger methods with a set of incorrect log objects
    logger.error(errors[0]);
    logger.error(errors[1]);
    logger.warning(errors[2]);
    logger.notice(errors[3]);
    logger.notice(errors[4]);

    // expected result
    expect(global.console.warn.calls.count()).toBe(0);
    expect(global.console.log.calls.count()).toBe(0);
    expect(global.console.error.calls.count()).toBe(4); // for 4 validation failed errors
    expect(global.console.error.calls.allArgs()).toEqual([
        [
            'component is required'
        ],
        [
            'component is required'
        ],
        [
            'message is required'
        ],
        [
            'message is required'
        ]
    ]);
});

// test('check if warning calls console.warn', () => {
//
//     // declare logger and define mocked warning objects
//     let logger = Logger.instance;
//     let warning1 = {
//         component: 'API',
//         message: 'Resource not found was unexpected',
//         responseStatus: 404,
//         responseBody: '{"message":"Resource not found"}'
//     };
//
//     let warning2 = {
//         component: 'Organisations overview',
//         message: 'Somebody tried to click self-destruct',
//         responseStatus: null,
//         responseBody: null
//     };
//
//     // spy on methods, so we can track count and eventually mock responses
//     // mocking responses is also possible by appending .and.returnValue(value)
//     spyOn(global.console, 'warn');
//
//     // call logger warning twice with warning objects
//     logger.warning(warning1);
//     logger.warning(warning2);
//
//     // expected result
//     expect(global.console.warn.calls.count()).toBe(2);
//
//     // regularly use expect(global.console.warn).toHaveBeenCalledWith(params);
//     // but that does not work with multiple calls. Use the callArgs check instead.
//     expect(global.console.warn.calls.allArgs()).toEqual([
//         [
//             'Warning in component API: ',
//             {
//                 application: 'neon-frontend',
//                 applicationUrl: 'http://localhost:9000/',
//                 responseStatus: 404,
//                 component: 'API',
//                 environment: 'test',
//                 message: 'Resource not found was unexpected',
//                 neonApiResponse: null,
//                 responseBody: '{"message":"Resource not found"}',
//                 session: Logger.instance.sessionId,
//                 type: 'warning',
//                 userAgent: navigator.userAgent
//             }
//         ],
//         [
//             'Warning in component Organisations overview: ',
//             {
//                 application: 'neon-frontend',
//                 applicationUrl: 'http://localhost:9000/',
//                 responseStatus: null,
//                 component: 'Organisations overview',
//                 environment: 'test',
//                 message: 'Somebody tried to click self-destruct',
//                 neonApiResponse: null,
//                 responseBody: null,
//                 session: Logger.instance.sessionId,
//                 type: 'warning',
//                 userAgent: navigator.userAgent
//             }
//         ]
//     ]);
// });

// test('check if notice calls console.log', () => {
//
//     // declare logger and define mocked notice objects
//     let logger = Logger.instance;
//     let notice1 = {
//         component: 'API',
//         message: 'Something was called',
//         responseStatus: 200,
//         responseBody: '{"message":"Resource was found"}'
//     };
//
//     let notice2 = {
//         component: 'Organisations overview',
//         message: 'User did something interesting',
//         responseStatus: null,
//         responseBody: null
//     };
//
//     // spy on methods, so we can track count and eventually mock responses
//     // mocking responses is also possible by appending .and.returnValue(value)
//     spyOn(global.console, 'log');
//
//     // call logger notice twice with notice objects
//     logger.notice(notice1);
//     logger.notice(notice2);
//
//     // expected result
//     expect(global.console.log.calls.count()).toBe(2);
//
//     // regularly use expect(global.console.log).toHaveBeenCalledWith(params);
//     // but that does not work with multiple calls. Use the callArgs check instead.
//     expect(global.console.log.calls.allArgs()).toEqual([
//         [
//             'Notice in component API: ',
//             {
//                 application: 'neon-frontend',
//                 applicationUrl: 'http://localhost:9000/',
//                 responseStatus: 200,
//                 component: 'API',
//                 environment: 'test',
//                 message: 'Something was called',
//                 neonApiResponse: null,
//                 responseBody: '{"message":"Resource was found"}',
//                 session: Logger.instance.sessionId,
//                 type: 'notice',
//                 userAgent: navigator.userAgent
//             }
//         ],
//         [
//             'Notice in component Organisations overview: ',
//             {
//                 application: 'neon-frontend',
//                 applicationUrl: 'http://localhost:9000/',
//                 responseStatus: null,
//                 component: 'Organisations overview',
//                 environment: 'test',
//                 message: 'User did something interesting',
//                 neonApiResponse: null,
//                 responseBody: null,
//                 session: Logger.instance.sessionId,
//                 type: 'notice',
//                 userAgent: navigator.userAgent
//             }
//         ]
//     ]);
// });
