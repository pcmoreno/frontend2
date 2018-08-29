import ApiFactory from '../../api/factory';

// below seems unused, but is required for jest to mock/overwrite it
import AppConfig from '../../../App.config';

// Mock the application api config
jest.mock('../../../App.config', () => {
    return {
        logger: {
            devModeBaseUrl: 'https://neon-api.acceptance.ltponline.com',
            devMode: false
        },
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

test('ApiFactory create method should create and return an API instance', () => {
    let api = ApiFactory.create('neon', null);

    expect(api.getBaseUrl()).toEqual('https://ltp.nl');
    expect(typeof api.getConfig()).toEqual('object');
});

test('ApiFactory create method should throw an error when trying to create an existing API instance', () => {
    try {
        ApiFactory.create('neon', null);
    } catch (e) {
        expect(e).toEqual(new Error('ApiFactory: API neon already exists'));
    }
});

test('ApiFactory get method should return an API instance', () => {
    let api = ApiFactory.get('neon');

    expect(api.getBaseUrl()).toEqual('https://ltp.nl');
    expect(typeof api.getConfig()).toEqual('object');
});

test('ApiFactory get method should throw an error if the API instance was not previously created', () => {
    try {
        ApiFactory.get('unknown');
    } catch (e) {
        expect(e).toEqual(new Error('ApiFactory: API unknown did not exist. Call create first.'));
    }
});
