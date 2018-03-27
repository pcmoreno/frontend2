import ApiFactory from '../../api/factory';

test('ApiFactory create method should create and return an API instance', () => {
    let api = ApiFactory.create('neon', null);

    expect(typeof api.getBaseUrl()).toEqual('string');
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

    expect(typeof api.getBaseUrl()).toEqual('string');
    expect(typeof api.getConfig()).toEqual('object');
});

test('ApiFactory get method should throw an error if the API instance was not previously created', () => {
    try {
        ApiFactory.get('unknown');
    } catch (e) {
        expect(e).toEqual(new Error('ApiFactory: API unknown did not exist. Call create first.'));
    }
});
