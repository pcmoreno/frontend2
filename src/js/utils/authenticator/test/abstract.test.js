import AbstractAuthenticator from '../abstract';

test('AbstractAuthenticator should have method authenticate, but should throw is not implemented', () => {
    const authenticator = new AbstractAuthenticator();

    try {
        authenticator.authenticate();
    } catch (e) {
        expect(e).toEqual(new Error('Method not implemented.'));
    }
});

test('AbstractAuthenticator should have method isAuthenticated, but should throw is not implemented', () => {
    const authenticator = new AbstractAuthenticator();

    try {
        authenticator.isAuthenticated();
    } catch (e) {
        expect(e).toEqual(new Error('Method not implemented.'));
    }
});

test('AbstractAuthenticator should have method getAuthenticationHeaders, but should throw is not implemented', () => {
    const authenticator = new AbstractAuthenticator();

    try {
        authenticator.getAuthenticationHeaders();
    } catch (e) {
        expect(e).toEqual(new Error('Method not implemented.'));
    }
});
