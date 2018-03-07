import Logger from '../logger';

// TODO: Implement test methods for logz.io when built in... (production env)
// TODO: console.error is being called (as intended to for the test), however this looks like an error in the console when running the unit tests

test('check if error calls console.error', () => {

    // declare logger and define mocked error objects
    let logger = Logger.instance;
    let error1 = {
        component: 'API',
        message: 'API call failed',
        code: '500',
        response: '{"message":"Internal Server Error"}'
    };

    let error2 = {
        component: 'Organisations overview',
        message: 'An error occurred',
        code: null,
        response: null
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
            'Error in component API: API call failed, code: 500, response: {"message":"Internal Server Error"}'
        ],
        [
            'Error in component Organisations overview: An error occurred, code: null, response: null'
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
    expect(global.console.log.calls.count()).toBe(1); // one correct notice call
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

test('check if warning calls console.warn', () => {

    // declare logger and define mocked warning objects
    let logger = Logger.instance;
    let warning1 = {
        component: 'API',
        message: 'Resource not found was unexpected',
        code: '404',
        response: '{"message":"Resource not found"}'
    };

    let warning2 = {
        component: 'Organisations overview',
        message: 'Somebody tried to click self-destruct',
        code: null,
        response: null
    };

    // spy on methods, so we can track count and eventually mock responses
    // mocking responses is also possible by appending .and.returnValue(value)
    spyOn(global.console, 'warn');

    // call logger warning twice with warning objects
    logger.warning(warning1);
    logger.warning(warning2);

    // expected result
    expect(global.console.warn.calls.count()).toBe(2);

    // regularly use expect(global.console.warn).toHaveBeenCalledWith(params);
    // but that does not work with multiple calls. Use the callArgs check instead.
    expect(global.console.warn.calls.allArgs()).toEqual([
        [
            'Warning in component API: Resource not found was unexpected, code: 404, response: {"message":"Resource not found"}'
        ],
        [
            'Warning in component Organisations overview: Somebody tried to click self-destruct, code: null, response: null'
        ]
    ]);
});

test('check if notice calls console.log', () => {

    // declare logger and define mocked notice objects
    let logger = Logger.instance;
    let notice1 = {
        component: 'API',
        message: 'Something was called',
        code: '200',
        response: '{"message":"Resource was found"}'
    };

    let notice2 = {
        component: 'Organisations overview',
        message: 'User did something interesting',
        code: null,
        response: null
    };

    // spy on methods, so we can track count and eventually mock responses
    // mocking responses is also possible by appending .and.returnValue(value)
    spyOn(global.console, 'log');

    // call logger notice twice with notice objects
    logger.notice(notice1);
    logger.notice(notice2);

    // expected result
    expect(global.console.log.calls.count()).toBe(2);

    // regularly use expect(global.console.log).toHaveBeenCalledWith(params);
    // but that does not work with multiple calls. Use the callArgs check instead.
    expect(global.console.log.calls.allArgs()).toEqual([
        [
            'Notice in component API: Something was called, code: 200, response: {"message":"Resource was found"}'
        ],
        [
            'Notice in component Organisations overview: User did something interesting, code: null, response: null'
        ]
    ]);
});
