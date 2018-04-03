import AbstractAuthoriser from '../abstract';

// below seems unused, but is required for jest to mock/overwrite it
import AppConfig from '../../../App.config';

// Mock the application api config
jest.mock('../../../App.config', () => {
    return {
        authoriser: {
            neon: {
                x: 'y'
            },
            fake: {

            }
        }
    }
});

test('AbstractAuthoriser should fetch the correct config when constructing', () => {
    const authoriser = new AbstractAuthoriser('neon');

    expect(authoriser.config.x).toEqual('y');
});

test('AbstractAuthoriser should throw an error when the authoriser config is not available', () => {
    try {
        new AbstractAuthoriser(null);
    } catch (e) {
        expect(e).toEqual(new Error('AppConfig.authoriser.null is not set. Cannot create authoriser instance.'));
    }
});

// todo: add unit test for getComponentConfig

// todo: add unit test for getAllowedRolesForComponentAction

// todo: add unit test for authorize
