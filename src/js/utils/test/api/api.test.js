import Logger from '../../logger';
import Utils from '../../utils';
import API from '../../api/api';
import AppConfig from '../../../App.config';

// Mock the application api config
jest.mock('../../../App.config', () => {
    return {
        api: {
            neon: {
                baseUrl: 'https://ltp.nl',
                endpoints: {
                    organisation: '/organisations',
                    organisationById: '/organisation/{id}',
                    twoIds: '/organisations/{orgId}/division/{divId}'
                },
                urlEncodeParams: false,
                skipPrefixIndexParams: true,
                requestFailedMessage: 'An error occurred while processing your request.'
            },
            fake: {
                baseUrl: 'http://fake.com',
                endpoints: {
                    fakeEndpoint: '/fake-endpoint/{fakeId}/{anotherFake}'
                },
                urlEncodeParams: true,
                skipPrefixIndexParams: false,
                requestFailedMessage: 'An error occurred while processing your request.'
            }
        }
    }
});

// mock fetch method and return json by default
global.fetch = jest.fn().mockImplementation((url, options) => {
    return new Promise((resolve, reject) => {
        resolve({
            ok: true,
            status: 200,
            statusText: 'OK',
            url: 'https://ltp.nl/organisations',
            json: () => {
                return new Promise((resolve, reject) => {
                    return resolve({id: '123'})
                });
            }
        });
    });
});

const apiConfig = AppConfig.api;

test('API should construct properly with the correct api key config', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // expect config to match
    expect(api.config).toEqual(apiConfig.neon);
});

test('API should through an error when it was constructed with a non existing api key (config)', () => {

    try {

        // api instance and mocked config
        let api = new API('doesnotexist', null);
    } catch (e) {

        // expected result
        expect(e).toEqual(new Error('AppConfig.api.doesnotexist is not set. Cannot create API instance.'));
    }
});

test('API should return the right config object when getConfig() is called', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // expected result
    expect(api.getConfig()).toEqual(apiConfig.neon);
});

test('API should return the right baseUrl when getBaseUrl() is called', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // expected result
    expect(api.getBaseUrl()).toEqual(apiConfig.neon.baseUrl);
});

test('API should return the right endpoint object when getEndpoints() is called', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // expected result
    expect(api.getEndpoints()).toEqual(apiConfig.neon.endpoints);
});

test('API should return the right authenticator with the one used for initialisation', () => {

    // api instance and mocked config
    let api = new API('neon', {
        prop: 'z'
    });

    // expected result
    expect(api.getAuthenticator()).toEqual({
        prop: 'z'
    });
});

test('API logWarning should call logger warning method with correct message', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // watch method
    spyOn(Logger.instance, 'warning');

    // call api warning
    api.logWarning('This is a warning message');

    // expected result
    expect(Logger.instance.warning.calls.count()).toBe(1);
    expect(Logger.instance.warning.calls.allArgs()).toEqual([
        [
            {
                component: 'API',
                message: 'This is a warning message'
            }
        ]
    ]);
});

test('API logError should call logger error method with correct message', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // watch method
    spyOn(Logger.instance, 'error');

    // call api warning
    api.logError('This is an error message');

    // expected result
    expect(Logger.instance.error.calls.count()).toBe(1);
    expect(Logger.instance.error.calls.allArgs()).toEqual([
        [
            {
                component: 'API',
                message: 'This is an error message'
            }
        ]
    ]);
});

test('API get should call to execute request with the correct parameters', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on methods
    spyOn(api, '_executeRequest');

    api.get(apiConfig.neon.baseUrl, api.getEndpoints().organisation, {
        t: 1,
        d: true,
        x: 'random'
    });

    // expected result
    expect(api._executeRequest.calls.count()).toBe(1);
    expect(api._executeRequest.calls.allArgs()).toEqual([
        [
            'https://ltp.nl/organisations',
            'get',
            {
                t: 1,
                d: true,
                x: 'random'
            }
        ]
    ]);
});

test('API post should call to execute request with the correct parameters', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on methods
    spyOn(api, '_executeRequest');

    api.post(api.getBaseUrl(), api.getEndpoints().organisation, {
        t: 2,
        d: false,
        x: 'random'
    });

    // expected result
    expect(api._executeRequest.calls.count()).toBe(1);
    expect(api._executeRequest.calls.allArgs()).toEqual([
        [
            'https://ltp.nl/organisations',
            'post',
            {
                t: 2,
                d: false,
                x: 'random'
            }
        ]
    ]);
});

test('API put should call to execute request with the correct parameters', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on methods
    spyOn(api, '_executeRequest');

    api.put(api.getBaseUrl(), api.getEndpoints().organisation, {
        t: 3,
        d: false,
        x: 'random'
    });

    // expected result
    expect(api._executeRequest.calls.count()).toBe(1);
    expect(api._executeRequest.calls.allArgs()).toEqual([
        [
            'https://ltp.nl/organisations',
            'put',
            {
                t: 3,
                d: false,
                x: 'random'
            }
        ]
    ]);
});

test('API options should call to execute request with the correct parameters', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on methods
    spyOn(api, '_executeRequest');

    api.options(api.getBaseUrl(), api.getEndpoints().organisation, {
        t: 4,
        d: true,
        p: ['x', 'y'],
        x: 'random'
    });

    // expected result
    expect(api._executeRequest.calls.count()).toBe(1);
    expect(api._executeRequest.calls.allArgs()).toEqual([
        [
            'https://ltp.nl/organisations',
            'options',
            {
                t: 4,
                d: true,
                p: ['x', 'y'],
                x: 'random'
            }
        ]
    ]);
});

test('API executeRequest should call buildURL to build the url', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(api, 'buildURL');

    // call method
    api._executeRequest(
        api.getBaseUrl() + api.getEndpoints().organisationById,
        'get',
        {
            urlParams: {
                identifiers: {
                    id: '123'
                },
                parameters: {
                    p: 'param'
                }
            },
            t: 4,
            d: true,
            p: ['x', 'y'],
            x: 'random'
        }
    );

    // expected result
    expect(api.buildURL.calls.count()).toBe(1);
    expect(api.buildURL.calls.allArgs()).toEqual([
        [
            'https://ltp.nl/organisation/{id}',
            {
                identifiers: {
                    id: '123'
                },
                parameters: {
                    p: 'param'
                }
            }
        ]
    ]);
});

test('API buildURL should replace the right identifiers in the url', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(api, 'buildURL').and.callThrough();
    spyOn(Utils, 'replaceString').and.callThrough();

    // call method
    let result = api.buildURL(
        api.getBaseUrl() + api.getEndpoints().twoIds,
        {
            identifiers: {
                orgId: '123',
                divId: '456'
            }
        });

    // expected result
    expect(Utils.replaceString.calls.count()).toBe(1);
    expect(result).toEqual('https://ltp.nl/organisations/123/division/456');
});

test('API buildURL should return null when not all identifiers could be replaced', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(api, 'buildURL').and.callThrough();
    spyOn(Utils, 'replaceString').and.callThrough();

    // call method
    let result = api.buildURL(
        api.getBaseUrl() + api.getEndpoints().twoIds,
        {
            identifiers: {
                orgId: '123'
            }
        });

    // expected result
    expect(Utils.replaceString.calls.count()).toBe(1);
    expect(result).toEqual(null);
});

test('API buildURL should parse the url parameters correctly with urlEncoding and with skipPrefixIndexParams', () => {

    // api instance and mocked config
    let api = new API('neon', null);
    api.config.urlEncodeParams = true;
    api.config.skipPrefixIndexParams = true;

    // spy on method
    spyOn(api, 'buildURL').and.callThrough();
    spyOn(Utils, 'serialise').and.callThrough();
    spyOn(Utils, 'buildQueryString').and.callThrough();

    // call method
    let result = api.buildURL(
        api.getBaseUrl() + api.getEndpoints().organisation,
        {
            parameters: {
                x: 'y,x',
                f: [
                    'd',
                    'x'
                ],
                y: 'x'
            }
        });

    expect(Utils.buildQueryString.calls.count()).toBe(1);
    expect(Utils.serialise.calls.count()).toBe(2); // expected the initial call plus one for a child array
    expect(result).toEqual('https://ltp.nl/organisations?x=y%2Cx&f%5B%5D=d&f%5B%5D=x&y=x');
});

test('API buildURL should parse the url parameters correctly with urlEncoding and without skipPrefixIndexParams', () => {

    // api instance and mocked config
    let api = new API('neon', null);
    api.config.urlEncodeParams = true;
    api.config.skipPrefixIndexParams = false;

    // spy on method
    spyOn(api, 'buildURL').and.callThrough();
    spyOn(Utils, 'serialise').and.callThrough();
    spyOn(Utils, 'buildQueryString').and.callThrough();

    // call method
    let result = api.buildURL(
        api.getBaseUrl() + api.getEndpoints().organisation,
        {
            parameters: {
                x: 'y,x',
                f: [
                    'd',
                    'x'
                ],
                y: 'x'
            }
        });

    expect(Utils.buildQueryString.calls.count()).toBe(1);
    expect(Utils.serialise.calls.count()).toBe(2); // expected the initial call plus one for a child array
    expect(result).toEqual('https://ltp.nl/organisations?x=y%2Cx&f%5B0%5D=d&f%5B1%5D=x&y=x');
});

test('API buildURL should parse the url parameters correctly without urlEncoding and without skipPrefixIndexParams', () => {

    // api instance and mocked config
    let api = new API('neon', null);
    apiConfig.neon.urlEncodeParams = false;
    apiConfig.neon.skipPrefixIndexParams = false;

    // spy on method
    spyOn(api, 'buildURL').and.callThrough();
    spyOn(Utils, 'serialise').and.callThrough();
    spyOn(Utils, 'buildQueryString').and.callThrough();

    // call method
    let result = api.buildURL(
        api.getBaseUrl() + api.getEndpoints().organisation,
        {
            parameters: {
                x: 'y,x',
                f: [
                    'd',
                    'x'
                ],
                y: 'x'
            }
        });

    expect(Utils.buildQueryString.calls.count()).toBe(1);
    expect(Utils.serialise.calls.count()).toBe(2); // expected the initial call plus one for a child array
    expect(result).toEqual('https://ltp.nl/organisations?x=y,x&f[0]=d&f[1]=x&y=x');
});

test('API buildURL should parse the url parameters correctly without urlEncoding and with skipPrefixIndexParams', () => {

    // api instance and mocked config
    let api = new API('neon', null);
    apiConfig.neon.urlEncodeParams = false;
    apiConfig.neon.skipPrefixIndexParams = true;

    // spy on method
    spyOn(api, 'buildURL').and.callThrough();
    spyOn(Utils, 'serialise').and.callThrough();
    spyOn(Utils, 'buildQueryString').and.callThrough();

    // call method
    let result = api.buildURL(
        api.getBaseUrl() + api.getEndpoints().organisation,
        {
            parameters: {
                x: 'y,x',
                f: [
                    'd',
                    'x'
                ],
                y: 'x'
            }
        });

    expect(Utils.buildQueryString.calls.count()).toBe(1);
    expect(Utils.serialise.calls.count()).toBe(2); // expected the initial call plus one for a child array
    expect(result).toEqual('https://ltp.nl/organisations?x=y,x&f[]=d&f[]=x&y=x');
});

test('API _executeRequest should use the parsed url with the correct identifiers and parameters', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(global, 'fetch').and.callThrough();
    spyOn(api, 'buildURL').and.callThrough();

    // call method
    api._executeRequest(
        api.getBaseUrl() + api.getEndpoints().organisationById,
        'get',
        {
            urlParams: {
                identifiers: {
                    id: '123'
                },
                parameters: {
                    x: 'y',
                    y: 'x'
                }
            }
        }
    );

    // expected result
    expect(api.buildURL.calls.count()).toBe(1);
    expect(api.buildURL.calls.allArgs()).toEqual([
        [
            'https://ltp.nl/organisation/{id}',
            {
                identifiers: {
                    id: '123'
                },
                parameters: {
                    x: 'y',
                    y: 'x'
                }
            }
        ]
    ]);
    expect(global.fetch.calls.count()).toBe(1);
    expect(global.fetch.calls.allArgs()).toEqual([
        [
            'https://ltp.nl/organisation/123?x=y&y=x',
            {
                method: 'get',

                headers: {}
            }
        ]
    ]);
});

test('API _executeRequest should return Promise.reject when buildURL was unsuccessful', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(global, 'fetch');
    spyOn(api, '_executeRequest').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api._executeRequest(
            api.getBaseUrl() + api.getEndpoints().organisationById,
            'post',
            {}
        ).then().catch(error => {

            expect(global.fetch.calls.count()).toBe(0);
            expect(Logger.instance.error.calls.count()).toBe(1);
            expect(Logger.instance.error.calls.allArgs()).toEqual([
                [
                    {
                        component: "API",
                        message: "buildURL failed. Please compare the given identifiers with the endpoint " +
                        "URL: https://ltp.nl/organisation/{id}"
                    }
                ]
            ]);

            expect(error).toEqual(new Error('An error occurred while processing your request.'));

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});

test('API buildPayload should return requestParams when no payload is set', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // watch method
    spyOn(Utils, 'serialise');

    // expected result
    expect(api.buildPayload(
        {
            method: 'post',
            headers: {}
        },
        null
    )).toEqual({
        headers: {},
        method: 'post'
    });

    expect(Utils.serialise.calls.count()).toBe(0);
});

test('API buildPayload should should parse the post body in JSON', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // watch method
    spyOn(Utils, 'serialise');

    // expected result
    expect(api.buildPayload(
        {
            method: 'post',
            headers: {}
        },
        {
            data: {
                x: 'y',
                y: [
                    'x',
                    'y'
                ],
                z: {
                    x: 'y'
                }
            },
            type: 'json'
        }
    )).toEqual({
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: "{\"x\":\"y\",\"y\":[\"x\",\"y\"],\"z\":{\"x\":\"y\"}}"
    });

    expect(Utils.serialise.calls.count()).toBe(0);
});

test('API buildPayload should should parse the post body in form data', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // watch method
    spyOn(Utils, 'serialise').and.callThrough();

    // expected result
    expect(api.buildPayload(
        {
            method: 'post',
            headers: {}
        },
        {
            data: {
                x: 'y',
                y: 'x',
                z: 'z'
            },
            type: 'form'
        }
    )).toEqual({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        body: "form[x]=y&form[y]=x&form[z]=z"
    });

    expect(Utils.serialise.calls.count()).toBe(1);
});

test('API buildPayload should return a string when given JSON payload is not an object or array', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // watch method
    spyOn(Utils, 'serialise');

    // expected result
    expect(api.buildPayload(
        {
            method: 'post',
            headers: {}
        },
        {
            data: 'invalid json should be returned as a string only []2497&^^424',
            type: 'json'
        }
    )).toEqual({
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'post',
        body: "\"invalid json should be returned as a string only []2497&^^424\""
    });

    expect(Utils.serialise.calls.count()).toBe(0);
});

test('API buildPayload should return an empty string when the form data post body cannot be parsed', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // watch method
    spyOn(Utils, 'serialise').and.callThrough();

    // expected result
    expect(api.buildPayload(
        {
            method: 'post',
            headers: {}
        },
        {
            data: null,
            type: 'form'
        }
    )).toEqual({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        body: ''
    });

    expect(Utils.serialise.calls.count()).toBe(1);
});

test('API buildPayload should return a char string when the form data post body cannot be parsed', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // watch method
    spyOn(Utils, 'serialise').and.callThrough();

    // expected result
    expect(api.buildPayload(
        {
            method: 'post',
            headers: {}
        },
        {
            data: 'bla',
            type: 'form'
        }
    )).toEqual({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        body: 'form[0]=b&form[1]=l&form[2]=a'
    });

    expect(Utils.serialise.calls.count()).toBe(1);
});

test('API buildPayload should log and throw an error when the post body is of an unknown format', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // watch method
    spyOn(Utils, 'serialise').and.callThrough();
    spyOn(api, 'logError');

    try {
        // expected result
        expect(api.buildPayload(
            {
                method: 'post',
                headers: {}
            },
            {
                data: {
                    x: 'y'
                },
                type: null
            }
        ));
    } catch (e) {
        expect(e).toEqual(new Error('Could not parse post body (payload.data). payload.type was not given on request: {"method":"post","headers":{}}'));
    }

    // expected result
    expect(Utils.serialise.calls.count()).toBe(0);
    expect(api.logError.calls.count()).toBe(1);
    expect(api.logError.calls.allArgs()).toEqual([
        [
            'Could not parse post body (payload.data). payload.type was not given on request: {"method":"post","headers":{}}'
        ]
    ]);
});

test('API _executeRequest should be set with the right JSON payload', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(global, 'fetch');

    // call method
    api._executeRequest(
        api.getBaseUrl() + api.getEndpoints().organisation,
        'post',
        {
            payload: {
                data: {
                    x: 'y',
                    y: [
                        'x',
                        'y'
                    ],
                    z: {
                        x: 'y'
                    }
                },
                type: 'json'
            }
        }
    );

    // expected result
    expect(global.fetch.calls.count()).toBe(1);
    expect(global.fetch.calls.allArgs()).toEqual([
        [
            'https://ltp.nl/organisations',
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body: "{\"x\":\"y\",\"y\":[\"x\",\"y\"],\"z\":{\"x\":\"y\"}}"
            }
        ]
    ]);
});

test('API _executeRequest should be set with the right form data payload', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(global, 'fetch');

    // call method
    api._executeRequest(
        api.getBaseUrl() + api.getEndpoints().organisation,
        'post',
        {
            payload: {
                data: {
                    x: 'y',
                    y: 'x',
                    z: 'z'
                },
                type: 'form'
            }
        }
    );

    // expected result
    expect(global.fetch.calls.count()).toBe(1);
    expect(global.fetch.calls.allArgs()).toEqual([
        [
            'https://ltp.nl/organisations',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'post',
                body: "form[x]=y&form[y]=x&form[z]=z"
            }
        ]
    ]);
});

test('API _executeRequest should return Promise.reject when payload parsing fails', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(global, 'fetch');
    spyOn(api, '_executeRequest').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(api, 'buildPayload').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api._executeRequest(
            api.getBaseUrl() + api.getEndpoints().organisation,
            'post',
            {
                payload: {
                    data: {
                        x: 'y'
                    },
                    type: null
                }
            }
        ).then().catch(error => {

            expect(global.fetch.calls.count()).toBe(0);
            expect(Logger.instance.error.calls.count()).toBe(1);
            expect(Logger.instance.error.calls.allArgs()).toEqual([
                [
                    {
                        component: "API",
                        message: "Could not parse post body (payload.data). payload.type was not given on request: {\"method\":\"post\",\"headers\":{}}"
                    }
                ]
            ]);

            expect(error).toEqual(new Error('An error occurred while processing your request.'));

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});

test('API buildRequestHeaders should return custom headers', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // expected result
    expect(api.buildRequestHeaders(
        {
            method: 'post',
            headers: {}
        },
        {
            'X-custom-header': 'xyz',
            'Authorization': 'hash'
        }
    )).toEqual({
        headers: {
            'X-custom-header': 'xyz',
            'Authorization': 'hash'
        },
        method: 'post'
    });
});

test('API buildRequestHeaders should return requestParams when no headers are set', () => {
    // api instance and mocked config
    let api = new API('neon', null);

    // expected result
    expect(api.buildRequestHeaders(
        {
            method: 'post',
            headers: {}
        },
        null
    )).toEqual({
        headers: {},
        method: 'post'
    });
});

test('API _executeRequest should set custom request headers', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(global, 'fetch');

    // call method
    api._executeRequest(
        api.getBaseUrl() + api.getEndpoints().organisation,
        'get',
        {
            headers: {
                'X-Custom-Key': 'secretkey'
            }
        }
    );

    // expected result
    expect(global.fetch.calls.count()).toBe(1);
    expect(global.fetch.calls.allArgs()).toEqual([
        [
            'https://ltp.nl/organisations',
            {
                headers: {
                    'X-Custom-Key': 'secretkey'
                },
                method: 'get'
            }
        ]
    ]);
});

test('API _executeRequest should accept no custom request headers', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(global, 'fetch');

    // call method
    api._executeRequest(
        api.getBaseUrl() + api.getEndpoints().organisation,
        'get',
        {}
    );

    // expected result
    expect(global.fetch.calls.count()).toBe(1);
    expect(global.fetch.calls.allArgs()).toEqual([
        [
            'https://ltp.nl/organisations',
            {
                method: 'get',
                headers: {}
            }
        ]
    ]);
});

test('API _executeRequest should return a JSON object on a request', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // mock fetch method and return json by default
    global.fetch = jest.fn().mockImplementation((url, options) => {
        return new Promise((resolve, reject) => {
            resolve({
                ok: true,
                status: 200,
                statusText: 'OK',
                url: 'https://ltp.nl/organisations',
                json: () => {
                    return new Promise((resolve, reject) => {
                        return resolve({id:'123'})
                    });
                }
            });
        });
    });

    // spy on method
    spyOn(global, 'fetch').and.callThrough();
    spyOn(api, '_executeRequest').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(Logger.instance, 'warning');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api._executeRequest(
            api.getBaseUrl() + api.getEndpoints().organisation,
            'get',
            {}
        ).then(response => {

            expect(Logger.instance.warning.calls.count()).toBe(0);
            expect(Logger.instance.error.calls.count()).toBe(0);
            expect(global.fetch.calls.count()).toBe(1);
            expect(global.fetch.calls.allArgs()).toEqual([
                [
                    'https://ltp.nl/organisations',
                    {
                        method: 'get',
                        headers: {}
                    }
                ]
            ]);

            // expect
            expect(response).toEqual({
                id: '123'
            });

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});

// Yes, the next few tests look completely redundant as only the status code is different in the fetch response
// and in the warning log expectation. However, this is required as we cannot mock different responses for global.fetch
// as we are doing multiple async calls to an async method. It would not be possible to overwrite the fetch mock
// and still tests all outcome within ONE test method.
test('API _executeRequest should log a warning and return json when fetch returns a warning code with valid JSON', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // mock fetch method and return json by default
    global.fetch = jest.fn().mockImplementation((url, options) => {
        return new Promise((resolve, reject) => {
            resolve({
                ok: true,
                status: 300,
                statusText: 'Multiple Choices',
                url: 'https://ltp.nl/organisations',
                json: () => {
                    return new Promise((resolve, reject) => {
                        return resolve({id: '123'})
                    });
                }
            });
        });
    });

    // spy on method
    spyOn(global, 'fetch').and.callThrough();
    spyOn(api, '_executeRequest').and.callThrough();
    spyOn(Logger.instance, 'warning');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api._executeRequest(
            api.getBaseUrl() + api.getEndpoints().organisation,
            'get',
            {}
        ).then(response => {

            expect(global.fetch.calls.count()).toBe(1);
            expect(global.fetch.calls.allArgs()).toEqual([
                [
                    'https://ltp.nl/organisations',
                    {
                        method: 'get',
                        headers: {}
                    }
                ]
            ]);
            expect(Logger.instance.warning.calls.count()).toBe(1);
            expect(Logger.instance.warning.calls.allArgs()).toEqual([
                [
                    {
                        component: 'API',
                        message: 'Call to https://ltp.nl/organisations returned code: 300 Multiple Choices with response: {"id":"123"}'
                    }
                ]
            ]);

            expect(response).toEqual({
                id: '123'
            });

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});

test('API _executeRequest should log an error and Promise.reject when fetch returns an error code with valid JSON', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // mock fetch method and return json by default
    global.fetch = jest.fn().mockImplementation((url, options) => {
        return new Promise((resolve, reject) => {
            resolve({
                ok: true,
                status: 400,
                statusText: 'Bad Request',
                url: 'https://ltp.nl/organisations',
                json: () => {
                    return new Promise((resolve, reject) => {
                        return resolve({id: '123'})
                    });
                }
            });
        });
    });

    // spy on method
    spyOn(global, 'fetch').and.callThrough();
    spyOn(api, '_executeRequest').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api._executeRequest(
            api.getBaseUrl() + api.getEndpoints().organisation,
            'get',
            {}
        ).then().catch(error => {

            expect(global.fetch.calls.count()).toBe(1);
            expect(global.fetch.calls.allArgs()).toEqual([
                [
                    'https://ltp.nl/organisations',
                    {
                        method: 'get',
                        headers: {}
                    }
                ]
            ]);
            expect(Logger.instance.error.calls.count()).toBe(1);
            expect(Logger.instance.error.calls.allArgs()).toEqual([
                [
                    {
                        component: 'API',
                        message: 'Call to https://ltp.nl/organisations returned code: 400 Bad Request with response: {"id":"123"}'
                    }
                ]
            ]);

            expect(error).toEqual(new Error('An error occurred while processing your request.'));

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});

test('API _executeRequest should return an empty object when fetch returns 204 No Content', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // mock fetch method and return json by default
    global.fetch = jest.fn().mockImplementation((url, options) => {
        return new Promise((resolve, reject) => {
            resolve({
                ok: true,
                status: 204,
                statusText: 'No Content',
                url: 'https://ltp.nl/organisations',
                json: () => {
                    return new Promise((resolve, reject) => {
                        return reject('Error parsing JSON')
                    });
                }
            });
        });
    });

    // spy on method
    spyOn(global, 'fetch').and.callThrough();
    spyOn(api, '_executeRequest').and.callThrough();
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api._executeRequest(
            api.getBaseUrl() + api.getEndpoints().organisation,
            'get',
            {}
        ).then(response => {

            expect(global.fetch.calls.count()).toBe(1);
            expect(global.fetch.calls.allArgs()).toEqual([
                [
                    'https://ltp.nl/organisations',
                    {
                        method: 'get',
                        headers: {}
                    }
                ]
            ]);

            // expect empty response
            expect(response).toEqual({});

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});

test('API _executeRequest should log an error and Promise.reject when fetch returns any response with invalid JSON', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // mock fetch method and return json by default
    global.fetch = jest.fn().mockImplementation((url, options) => {
        return new Promise((resolve, reject) => {
            resolve({
                ok: true,
                status: 400,
                statusText: 'Bad Request',
                url: 'https://ltp.nl/organisations',
                json: () => {
                    return new Promise((resolve, reject) => {
                        return reject('Error parsing JSON')
                    });
                }
            });
        });
    });

    // spy on method
    spyOn(global, 'fetch').and.callThrough();
    spyOn(api, '_executeRequest').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api._executeRequest(
            api.getBaseUrl() + api.getEndpoints().organisation,
            'get',
            {}
        ).then().catch(error => {

            expect(global.fetch.calls.count()).toBe(1);
            expect(global.fetch.calls.allArgs()).toEqual([
                [
                    'https://ltp.nl/organisations',
                    {
                        method: 'get',
                        headers: {}
                    }
                ]
            ]);
            expect(Logger.instance.error.calls.count()).toBe(1);
            expect(Logger.instance.error.calls.allArgs()).toEqual([
                [
                    {
                        component: 'API',
                        message: 'Call to https://ltp.nl/organisations returned code: 400 Bad Request with error: Error parsing JSON'
                    }
                ]
            ]);

            expect(error).toEqual(new Error('An error occurred while processing your request.'));

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});

test('API isWarningCode should return true between 300-399 and 404', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    expect(API.isWarningCode(300)).toEqual(true);
    expect(API.isWarningCode(302)).toEqual(true);
    expect(API.isWarningCode(399)).toEqual(true);
    expect(API.isWarningCode(400)).toEqual(false);
    expect(API.isWarningCode(402)).toEqual(false);
    expect(API.isWarningCode(404)).toEqual(true);
    expect(API.isWarningCode(500)).toEqual(false);
});

test('API isErrorCode should return true on 400+ except 404', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    expect(API.isErrorCode(300)).toEqual(false);
    expect(API.isErrorCode(302)).toEqual(false);
    expect(API.isErrorCode(399)).toEqual(false);
    expect(API.isErrorCode(400)).toEqual(true);
    expect(API.isErrorCode(402)).toEqual(true);
    expect(API.isErrorCode(404)).toEqual(false);
    expect(API.isErrorCode(500)).toEqual(true);
});

test('API _executeRequest should log an error and return Promise.reject when fetch response.ok is false', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // mock fetch method and return json by default
    global.fetch = jest.fn().mockImplementation((url, options) => {
        return new Promise((resolve, reject) => {
            reject('There was an error!');
        });
    });

    // spy on method
    spyOn(global, 'fetch').and.callThrough();
    spyOn(api, '_executeRequest').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api._executeRequest(
            api.getBaseUrl() + api.getEndpoints().organisation,
            'get',
            {}
        ).then().catch(error => {

            expect(global.fetch.calls.count()).toBe(1);
            expect(global.fetch.calls.allArgs()).toEqual([
                [
                    'https://ltp.nl/organisations',
                    {
                        method: 'get',
                        headers: {}
                    }
                ]
            ]);
            expect(Logger.instance.error.calls.count()).toBe(1);
            expect(Logger.instance.error.calls.allArgs()).toEqual([
                [
                    {
                        component: 'API',
                        message: 'Call to https://ltp.nl/organisations failed with error: There was an error!'
                    }
                ]
            ]);

            expect(error).toEqual(new Error('An error occurred while processing your request.'));

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});

test('API _executeRequest should log an error when the network request failed or did not complete', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // mock fetch method and return json by default
    global.fetch = jest.fn().mockImplementation((url, options) => {
        return new Promise((resolve, reject) => {
            resolve({
                ok: false,
                status: 400,
                statusText: 'Bad Request',
                url: 'https://ltp.nl/organisations',
                json: () => {
                    return new Promise((resolve, reject) => {
                        return reject('Error parsing JSON')
                    });
                }
            });
        });
    });

    // spy on method
    spyOn(global, 'fetch').and.callThrough();
    spyOn(api, '_executeRequest').and.callThrough();
    spyOn(API, 'isWarningCode').and.callThrough();
    spyOn(API, 'isErrorCode').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api._executeRequest(
            api.getBaseUrl() + api.getEndpoints().organisation,
            'get',
            {}
        ).then().catch(error => {

            expect(API.isWarningCode.calls.count()).toBe(0);
            expect(API.isErrorCode.calls.count()).toBe(0);
            expect(global.fetch.calls.count()).toBe(1);
            expect(global.fetch.calls.allArgs()).toEqual([
                [
                    'https://ltp.nl/organisations',
                    {
                        method: 'get',
                        headers: {}
                    }
                ]
            ]);
            expect(Logger.instance.error.calls.count()).toBe(1);
            expect(Logger.instance.error.calls.allArgs()).toEqual([
                [
                    {
                        component: 'API',
                        message: 'Call to https://ltp.nl/organisations returned code: 400 Bad Request with error: Error parsing JSON'
                    }
                ]
            ]);

            expect(error).toEqual(new Error('An error occurred while processing your request.'));

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});

test('API _executeRequest should resolve with an error object when the api returns input validation errors', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // mock fetch method and return json by default
    global.fetch = jest.fn().mockImplementation((url, options) => {
        return new Promise((resolve, reject) => {
            resolve({
                ok: false,
                status: 400,
                statusText: 'Bad Request',
                url: 'https://ltp.nl/organisations',
                json: () => {
                    return new Promise((resolve, reject) => {
                        return resolve({
                            code: 400,
                            errors: {
                                organisationName: [
                                    'Organisation name is required.'
                                ]
                            }
                        });
                    });
                }
            });
        });
    });

    // spy on method
    spyOn(global, 'fetch').and.callThrough();
    spyOn(api, '_executeRequest').and.callThrough();
    spyOn(API, 'isWarningCode').and.callThrough();
    spyOn(API, 'isErrorCode').and.callThrough();
    spyOn(Logger.instance, 'warning');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api._executeRequest(
            api.getBaseUrl() + api.getEndpoints().organisation,
            'get',
            {}
        ).then(response => {

            expect(API.isWarningCode.calls.count()).toBe(0);
            expect(API.isErrorCode.calls.count()).toBe(0);
            expect(global.fetch.calls.count()).toBe(1);
            expect(global.fetch.calls.allArgs()).toEqual([
                [
                    'https://ltp.nl/organisations',
                    {
                        method: 'get',
                        headers: {}
                    }
                ]
            ]);
            expect(Logger.instance.warning.calls.count()).toBe(1);
            expect(Logger.instance.warning.calls.allArgs()).toEqual([
                [
                    {
                        component: 'API',
                        message: 'Call to https://ltp.nl/organisations returned code: 400 Bad Request with response: {"code":400,"errors":{"organisationName":["Organisation name is required."]}}'
                    }
                ]
            ]);

            expect(response).toEqual({
                errors: {
                    organisationName: [
                        'Organisation name is required.'
                    ]
                }
            });

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});
