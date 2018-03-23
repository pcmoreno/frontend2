import AbstractAuthenticator from '../abstract';

// below seems unused, but is required for jest to mock/overwrite it
import AppConfig from '../../../App.config';

// Mock the application api config
jest.mock('../../../App.config', () => {
    return {
        authenticator: {
            neon: {
                x: 'y'
            },
            fake: {

            }
        }
    }
});

test('AbstractAuthenticator should fetch the correct config when constructing', () => {
    const authenticator = new AbstractAuthenticator('neon');

    expect(authenticator.config.x).toEqual('y');
});

test('AbstractAuthenticator should throw an error when the authenticator config is not available', () => {
    try {
        new AbstractAuthenticator(null);
    } catch (e) {
        expect(e).toEqual(new Error('AppConfig.authenticator.null is not set. Cannot create authenticator instance.'));
    }
});

test('AbstractAuthenticator should have method authenticate, but should throw is not implemented', () => {
    const authenticator = new AbstractAuthenticator('neon');

    try {
        authenticator.authenticate();
    } catch (e) {
        expect(e).toEqual(new Error('Method not implemented.'));
    }
});

test('AbstractAuthenticator should have method getAuthenticatedUser, but should throw is not implemented', () => {
    const authenticator = new AbstractAuthenticator('neon');

    try {
        authenticator.getAuthenticatedUser();
    } catch (e) {
        expect(e).toEqual(new Error('Method not implemented.'));
    }
});

test('AbstractAuthenticator should have method refreshTokens, but should throw is not implemented', () => {
    const authenticator = new AbstractAuthenticator('neon');

    try {
        authenticator.refreshTokens();
    } catch (e) {
        expect(e).toEqual(new Error('Method not implemented.'));
    }
});

test('AbstractAuthenticator should have method isAuthenticated, but should throw is not implemented', () => {
    const authenticator = new AbstractAuthenticator('neon');

    try {
        authenticator.isAuthenticated();
    } catch (e) {
        expect(e).toEqual(new Error('Method not implemented.'));
    }
});

test('AbstractAuthenticator should have method getUser, but should throw is not implemented', () => {
    const authenticator = new AbstractAuthenticator('neon');

    try {
        authenticator.getUser();
    } catch (e) {
        expect(e).toEqual(new Error('Method not implemented.'));
    }
});
