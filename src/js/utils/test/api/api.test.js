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
                    pdf: '/pdf',
                    organisationById: '/organisation/{id}',
                    twoIds: '/organisations/{orgId}/division/{divId}'
                },
                urlEncodeParams: false,
                skipPrefixIndexParams: true,
                requestFailedMessage: 'An error occurred while processing your request.',
                loggingExclusions: {

                    // endpoints of api errors should not be logged at all
                    endpoints: [
                        '/excluded/endpoint'
                    ],

                    // header fields from the api call that failed that should be excluded from logging
                    headers: [
                        'Authorization'
                    ],

                    // fields from the post body of an api error that should be excluded from logging
                    postBody: [
                        'password'
                    ],

                    // fields from the response body of an api error that should be excluded from logging
                    responseBody: [
                        'password'
                    ]
                }
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
            headers: {
                get: (header) => { }
            },
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

test('API get should call to execute request with the correct parameters', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on methods
    spyOn(api, 'executeRequest');

    api.get(apiConfig.neon.baseUrl, api.getEndpoints().organisation, {
        t: 1,
        d: true,
        x: 'random'
    });

    // expected result
    expect(api.executeRequest.calls.count()).toBe(1);
    expect(api.executeRequest.calls.allArgs()).toEqual([
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
    spyOn(api, 'executeRequest');

    api.post(api.getBaseUrl(), api.getEndpoints().organisation, {
        t: 2,
        d: false,
        x: 'random'
    });

    // expected result
    expect(api.executeRequest.calls.count()).toBe(1);
    expect(api.executeRequest.calls.allArgs()).toEqual([
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
    spyOn(api, 'executeRequest');

    api.put(api.getBaseUrl(), api.getEndpoints().organisation, {
        t: 3,
        d: false,
        x: 'random'
    });

    // expected result
    expect(api.executeRequest.calls.count()).toBe(1);
    expect(api.executeRequest.calls.allArgs()).toEqual([
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
    spyOn(api, 'executeRequest');

    api.options(api.getBaseUrl(), api.getEndpoints().organisation, {
        t: 4,
        d: true,
        p: ['x', 'y'],
        x: 'random'
    });

    // expected result
    expect(api.executeRequest.calls.count()).toBe(1);
    expect(api.executeRequest.calls.allArgs()).toEqual([
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

// todo: add test that checks the credentials property

// todo: add test that checks the 401 refresh/authorize call, that will execute api call again and eventually trigger logout

test('API executeRequest should call buildURL to build the url', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(api, 'buildURL');

    // call method
    api.executeRequest(
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

test('API executeRequest should use the parsed url with the correct identifiers and parameters', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(global, 'fetch').and.callThrough();
    spyOn(api, 'buildURL').and.callThrough();

    // call method
    api.executeRequest(
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

test('API executeRequest should return Promise.reject when buildURL was unsuccessful', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(global, 'fetch');
    spyOn(api, 'executeRequest').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api.executeRequest(
            api.getBaseUrl() + api.getEndpoints().organisationById,
            'post',
            {}
        ).then().catch(error => {

            expect(global.fetch.calls.count()).toBe(0);
            expect(Logger.instance.error.calls.count()).toBe(1);
            expect(Logger.instance.error.calls.allArgs()).toEqual([
                [
                    {
                        component: 'API',
                        message: 'Build url failed. Could not parse all identifiers',
                        requestOptions: '{}',
                        requestUrl: 'https://ltp.nl/organisation/{id}',
                        responseBody: '{}',
                        responseStatus: 0,
                        responseText: ''
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

test('API buildPayload should parse the post body in JSON', () => {

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

test('API buildPayload should parse the post body in form data', () => {

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

test('API buildPayload should parse the post body in form data with custom form key', () => {

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
            type: 'form',
            formKey: 'customKey'
        }
    )).toEqual({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        body: "customKey[x]=y&customKey[y]=x&customKey[z]=z"
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
    spyOn(Logger.instance, 'error');

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
    expect(Logger.instance.error.calls.count()).toBe(1);
    expect(Logger.instance.error.calls.allArgs()).toEqual([
        [
            {
                component: 'API',
                message: 'Could not parse post data',
                requestOptions: '{"method":"post","headers":{}}',
                requestUrl: '',
                responseBody: '{}',
                responseStatus: 0,
                responseText: ''
            }
        ]
    ]);
});

test('API executeRequest should be set with the right JSON payload', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(global, 'fetch');

    // call method
    api.executeRequest(
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

test('API executeRequest should be set with the right form data payload', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(global, 'fetch');

    // call method
    api.executeRequest(
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

test('API executeRequest should return Promise.reject when payload parsing fails', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(global, 'fetch');
    spyOn(api, 'executeRequest').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(api, 'buildPayload').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api.executeRequest(
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
                        component: 'API',
                        message: 'Could not parse post data',
                        requestOptions: '{"method":"post","headers":{}}',
                        requestUrl: '',
                        responseBody: '{}',
                        responseStatus: 0,
                        responseText: ''
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

test('API executeRequest should set custom request headers', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(global, 'fetch');

    // call method
    api.executeRequest(
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

test('API executeRequest should accept no custom request headers', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // spy on method
    spyOn(global, 'fetch');

    // call method
    api.executeRequest(
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

test('API executeRequest should return a JSON object on a request', () => {

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
                headers: {
                    get: (header) => { }
                },
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
    spyOn(api, 'executeRequest').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(Logger.instance, 'warning');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api.executeRequest(
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

test('API executeRequest should return a Blob object on a request', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // mock fetch method and return json by default
    global.fetch = jest.fn().mockImplementation((url, options) => {
        return new Promise((resolve, reject) => {
            resolve({
                ok: true,
                status: 200,
                statusText: 'OK',
                url: 'https://ltp.nl/pdf',
                headers: {
                    get: (header) => {
                        switch (header) {
                            case 'content-type':
                                return 'application/pdf';
                        }
                    }
                },
                blob: () => {
                    return new Promise((resolve, reject) => {
                        return resolve('JVBERi0xLjQKJeLjz9MKNCAwIG9iaiA8PC9MZW5ndGggNzA5L0ZpbHRlci9GbGF0ZURlY29kZT4+c3')
                    });
                }
            });
        });
    });

    // spy on method
    spyOn(global, 'fetch').and.callThrough();
    spyOn(api, 'executeRequest').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(Logger.instance, 'warning');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api.executeRequest(
            api.getBaseUrl() + api.getEndpoints().pdf,
            'get',
            {}
        ).then(response => {

            expect(Logger.instance.warning.calls.count()).toBe(0);
            expect(Logger.instance.error.calls.count()).toBe(0);
            expect(global.fetch.calls.count()).toBe(1);
            expect(global.fetch.calls.allArgs()).toEqual([
                [
                    'https://ltp.nl/pdf',
                    {
                        method: 'get',
                        headers: {}
                    }
                ]
            ]);

            // expect
            expect(response).toEqual('JVBERi0xLjQKJeLjz9MKNCAwIG9iaiA8PC9MZW5ndGggNzA5L0ZpbHRlci9GbGF0ZURlY29kZT4+c3');

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});
test('API executeRequest should return a Blob object on a request', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // mock fetch method and return json by default
    global.fetch = jest.fn().mockImplementation((url, options) => {
        return new Promise((resolve, reject) => {
            resolve({
                ok: true,
                status: 200,
                statusText: 'OK',
                url: 'https://ltp.nl/pdf',
                headers: {
                    get: (header) => {
                        switch (header) {
                            case 'content-type':
                                return 'application/pdf';
                        }
                    }
                },
                blob: () => {
                    return new Promise((resolve, reject) => {
                        throw Error('Could not parse blob');
                    });
                }
            });
        });
    });

    // spy on method
    spyOn(global, 'fetch').and.callThrough();
    spyOn(api, 'executeRequest').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(Logger.instance, 'warning');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api.executeRequest(
            api.getBaseUrl() + api.getEndpoints().pdf,
            'get',
            {}
        ).then().catch(error => {

            expect(Logger.instance.warning.calls.count()).toBe(0);
            expect(Logger.instance.error.calls.count()).toBe(1);
            expect(global.fetch.calls.count()).toBe(1);
            expect(global.fetch.calls.allArgs()).toEqual([
                [
                    'https://ltp.nl/pdf',
                    {
                        method: 'get',
                        headers: {}
                    }
                ]
            ]);
            expect(Logger.instance.error.calls.allArgs()).toEqual([
                [
                    {
                        component: 'API',
                        message: 'Parsing BLOB response failed',
                        requestOptions: '{}',
                        requestUrl: 'https://ltp.nl/pdf',
                        responseBody: '{}',
                        responseStatus: 200,
                        responseText: 'OK'
                    }
                ]
            ]);

            expect(error).toEqual(new Error('An error occurred while processing your request.'));

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});

// Yes, the next few tests look completely redundant as only the status code is different in the fetch response
// and in the warning log expectation. However, this is required as we cannot mock different responses for global.fetch
// as we are doing multiple async calls to an async method. It would not be possible to overwrite the fetch mock
// and still tests all outcome within ONE test method.
test('API executeRequest should log a warning and return json when fetch returns a warning code with valid JSON', () => {

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
                headers: {
                    get: (header) => { }
                },
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
    spyOn(api, 'executeRequest').and.callThrough();
    spyOn(Logger.instance, 'warning');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api.executeRequest(
            api.getBaseUrl() + api.getEndpoints().organisation,
            'get',
            {
                headers: {
                    'X-Custom-Header': 'header-value'
                }
            }
        ).then(response => {

            expect(global.fetch.calls.count()).toBe(1);
            expect(global.fetch.calls.allArgs()).toEqual([
                [
                    'https://ltp.nl/organisations',
                    {
                        method: 'get',
                        headers: {
                            'X-Custom-Header': 'header-value'
                        }
                    }
                ]
            ]);
            expect(Logger.instance.warning.calls.count()).toBe(1);
            expect(Logger.instance.warning.calls.allArgs()).toEqual([
                [
                    {
                        component: 'API',
                        message: 'API call succeeded but with a warning flagged response code',
                        requestOptions: '{"headers":{"X-Custom-Header":"header-value"}}',
                        requestUrl: 'https://ltp.nl/organisations',
                        responseBody: '{"id":"123"}',
                        responseStatus: 300,
                        responseText: 'Multiple Choices'
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

test('API executeRequest should log an error and Promise.reject when fetch returns an error code with valid JSON', () => {

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
                headers: {
                    get: (header) => { }
                },
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
    spyOn(api, 'executeRequest').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api.executeRequest(
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
                        message: 'API call succeeded but with an error flagged response code',
                        requestOptions: '{}',
                        requestUrl: 'https://ltp.nl/organisations',
                        responseBody: '{"id":"123"}',
                        responseStatus: 400,
                        responseText: 'Bad Request'
                    }
                ]
            ]);

            expect(error).toEqual(new Error('An error occurred while processing your request.'));

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});

test('API executeRequest should return an empty object when fetch returns 204 No Content', () => {

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
                headers: {
                    get: (header) => { }
                },
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
    spyOn(api, 'executeRequest').and.callThrough();
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api.executeRequest(
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

test('API executeRequest should log an error and Promise.reject when fetch returns any response with invalid JSON', () => {

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
                headers: {
                    get: (header) => { }
                },
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
    spyOn(api, 'executeRequest').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api.executeRequest(
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
                        message: 'Parsing JSON response failed',
                        requestOptions: '{}',
                        requestUrl: 'https://ltp.nl/organisations',
                        responseBody: 'Error parsing JSON',
                        responseStatus: 400,
                        responseText: 'Bad Request'
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

test('API executeRequest should log an error and return Promise.reject when fetch response.ok is false', () => {

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
    spyOn(api, 'executeRequest').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api.executeRequest(
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
                        message: 'Unexpected API request error',
                        requestOptions: '{}',
                        requestUrl: 'https://ltp.nl/organisations',
                        responseBody: 'There was an error!',
                        responseStatus: 0,
                        responseText: ''
                    }
                ]
            ]);

            expect(error).toEqual(new Error('An error occurred while processing your request.'));

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});

test('API executeRequest should log an error when the network request failed or did not complete', () => {

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
                headers: {
                    get: (header) => { }
                },
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
    spyOn(api, 'executeRequest').and.callThrough();
    spyOn(API, 'isWarningCode').and.callThrough();
    spyOn(API, 'isErrorCode').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api.executeRequest(
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
                        message: 'Parsing JSON response failed',
                        requestOptions: '{}',
                        requestUrl: 'https://ltp.nl/organisations',
                        responseBody: 'Error parsing JSON',
                        responseStatus: 400,
                        responseText: 'Bad Request'
                    }
                ]
            ]);

            expect(error).toEqual(new Error('An error occurred while processing your request.'));

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});

test('API executeRequest should resolve with an error object when the api returns 400 Bad Request input validation errors', () => {

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
                headers: {
                    get: (header) => { }
                },
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
    spyOn(api, 'executeRequest').and.callThrough();
    spyOn(API, 'isWarningCode').and.callThrough();
    spyOn(API, 'isErrorCode').and.callThrough();
    spyOn(Logger.instance, 'warning');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api.executeRequest(
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
                        message: 'API call succeeded but with 400 or 409 response',
                        requestOptions: '{}',
                        requestUrl: 'https://ltp.nl/organisations',
                        responseBody: '{"code":400,"errors":{"organisationName":["Organisation name is required."]}}',
                        responseStatus: 400,
                        responseText: 'Bad Request'
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

test('API executeRequest should resolve with an error object when the api returns 409 Duplicate input validation errors', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // mock fetch method and return json by default
    global.fetch = jest.fn().mockImplementation((url, options) => {
        return new Promise((resolve, reject) => {
            resolve({
                ok: false,
                status: 409,
                statusText: 'Bad Request',
                url: 'https://ltp.nl/organisations',
                headers: {
                    get: (header) => { }
                },
                json: () => {
                    return new Promise((resolve, reject) => {
                        return resolve({
                            code: 409,
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
    spyOn(api, 'executeRequest').and.callThrough();
    spyOn(API, 'isWarningCode').and.callThrough();
    spyOn(API, 'isErrorCode').and.callThrough();
    spyOn(Logger.instance, 'warning');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api.executeRequest(
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
                        message: 'API call succeeded but with 400 or 409 response',
                        requestOptions: '{}',
                        requestUrl: 'https://ltp.nl/organisations',
                        responseBody: '{"code":409,"errors":{"organisationName":["Organisation name is required."]}}',
                        responseStatus: 409,
                        responseText: 'Bad Request'
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

test('API executeRequest should log an error and print all request information', () => {

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
                headers: {
                    get: (header) => { }
                },
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
    spyOn(api, 'executeRequest').and.callThrough();
    spyOn(Logger.instance, 'error');
    spyOn(api, 'buildURL').and.callThrough();

    // expected (async) result
    return new Promise((resolve, reject) => {
        api.executeRequest(
            api.getBaseUrl() + api.getEndpoints().organisation,
            'post',
            {
                headers: {
                    'X-Custom-Header': 'header-value'
                },
                payload: {
                    type: 'json',
                    data: {
                        x: 'y'
                    }
                }
            }
        ).then().catch(error => {
            expect(global.fetch.calls.count()).toBe(1);
            expect(global.fetch.calls.allArgs()).toEqual([
                [
                    'https://ltp.nl/organisations',
                    {
                        body: '{"x":"y"}',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Custom-Header': 'header-value'
                        },
                        method: 'post'
                    }
                ]
            ]);
            expect(Logger.instance.error.calls.count()).toBe(1);
            expect(Logger.instance.error.calls.allArgs()).toEqual([
                [
                    {
                        component: 'API',
                        message: 'API call succeeded but with an error flagged response code',
                        requestOptions: '{"headers":{"X-Custom-Header":"header-value"},"payload":{"type":"json","data":{"x":"y"}}}',
                        requestUrl: 'https://ltp.nl/organisations',
                        responseBody: '{"id":"123"}',
                        responseStatus: 400,
                        responseText: 'Bad Request',
                    }
                ]
            ]);

            // always resolve test to give the signal that we are done
            resolve();
        });
    });
});

test('API logApiMessage should log a warning', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // watch method
    spyOn(Logger.instance, 'warning');

    // call api warning
    api.logApiMessage(
        'warning',
        'Warning message',
        'https://google.com/',
        {
            x: 'y'
        },
        {
            status: 400,
            statusText: 'Bad request'
        },
        'Response string or object'
    );

    // expected result
    expect(Logger.instance.warning.calls.count()).toBe(1);
    expect(Logger.instance.warning.calls.allArgs()).toEqual([
        [
            {
                component: 'API',
                message: 'Warning message',
                requestOptions: '{"x":"y"}',
                requestUrl: 'https://google.com/',
                responseBody: 'Response string or object',
                responseStatus: 400,
                responseText: 'Bad request',
            }
        ]
    ]);
});

test('API logApiMessage should log an error', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // watch method
    spyOn(Logger.instance, 'error');

    // call api warning
    api.logApiMessage(
        'error',
        'Error message',
        'https://google.com/',
        {
            x: 'y'
        },
        {
            status: 400,
            statusText: 'Bad request'
        },
        'Response string or object'
    );

    // expected result
    expect(Logger.instance.error.calls.count()).toBe(1);
    expect(Logger.instance.error.calls.allArgs()).toEqual([
        [
            {
                component: 'API',
                message: 'Error message',
                requestOptions: '{"x":"y"}',
                requestUrl: 'https://google.com/',
                responseBody: 'Response string or object',
                responseStatus: 400,
                responseText: 'Bad request',
            }
        ]
    ]);
});

test('API logApiMessage should not log an exclude endpoint', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // watch method
    spyOn(Logger.instance, 'error');

    // call api warning
    api.logApiMessage(
        'error',
        'Error message',
        'https://google.com/excluded/endpoint',
        {
            x: 'y'
        },
        {
            status: 400,
            statusText: 'Bad request'
        },
        'Response string or object'
    );

    // expected result
    expect(Logger.instance.error.calls.count()).toBe(0);
});

test('API logApiMessage should exclude headers', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // watch method
    spyOn(Logger.instance, 'error');

    // call api warning
    api.logApiMessage(
        'error',
        'Error message',
        'https://google.com/endpoint',
        {
            x: 'y',
            headers: {
                Authorization: 'AuthorizationHeader'
            }
        },
        {
            status: 400,
            statusText: 'Bad request'
        },
        {}
    );

    // expected result
    expect(Logger.instance.error.calls.count()).toBe(1);
    expect(Logger.instance.error.calls.allArgs()).toEqual([
        [
            {
                component: 'API',
                message: 'Error message',
                requestOptions: '{"x":"y","headers":{}}',
                requestUrl: 'https://google.com/endpoint',
                responseBody: '{}',
                responseStatus: 400,
                responseText: 'Bad request',
            }
        ]
    ]);
});

test('API logApiMessage should exclude post body fields', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // watch method
    spyOn(Logger.instance, 'error');

    // call api warning
    api.logApiMessage(
        'error',
        'Error message',
        'https://google.com/endpoint',
        {
            x: 'y',
            payload: {
                data: {
                    password: 'PostedPassword'
                }
            }
        },
        {
            status: 400,
            statusText: 'Bad request'
        },
        {}
    );

    // expected result
    expect(Logger.instance.error.calls.count()).toBe(1);
    expect(Logger.instance.error.calls.allArgs()).toEqual([
        [
            {
                component: 'API',
                message: 'Error message',
                requestOptions: '{"x":"y","payload":{"data":{}}}',
                requestUrl: 'https://google.com/endpoint',
                responseBody: '{}',
                responseStatus: 400,
                responseText: 'Bad request',
            }
        ]
    ]);
});

test('API logApiMessage should exclude response body fields', () => {

    // api instance and mocked config
    let api = new API('neon', null);

    // watch method
    spyOn(Logger.instance, 'error');

    // call api warning
    api.logApiMessage(
        'error',
        'Error message',
        'https://google.com/endpoint',
        {
            x: 'y'
        },
        {
            status: 400,
            statusText: 'Bad request'
        },
        {
            field: 'value',
            password: 'PostedPassword'
        }
    );

    // expected result
    expect(Logger.instance.error.calls.count()).toBe(1);
    expect(Logger.instance.error.calls.allArgs()).toEqual([
        [
            {
                component: 'API',
                message: 'Error message',
                requestOptions: '{"x":"y"}',
                requestUrl: 'https://google.com/endpoint',
                responseBody: '{"field":"value"}',
                responseStatus: 400,
                responseText: 'Bad request',
             }
        ]
    ]);
});
