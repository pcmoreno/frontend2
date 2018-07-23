import AbstractAuthoriser from '../abstract';

// below seems unused, but is required for jest to mock/overwrite it
import AppConfig from '../../../App.config';

// Mock the application authorize config
jest.mock('../../../App.config', () => {
    return {
        authoriser: {
            neon: {
                x: 'y',
                report: {
                    writeAction: [
                        'Administrator',
                        'Manager'
                    ]
                },
                loginRedirect: '/login'
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

test('Authorise should return true on matching correct roles', () => {
    const authoriser = new AbstractAuthoriser('neon');
    const user = {
        getRoles: () => {
            return [
                'administrator'
            ];
        }
    };

    spyOn(authoriser, 'getAllowedRolesForComponentAction').and.callThrough();

    const authorised = authoriser.authorise(user, 'report', 'writeAction');

    expect(authorised).toBe(true);
    expect(authoriser.getAllowedRolesForComponentAction.calls.count()).toBe(1);
    expect(authoriser.getAllowedRolesForComponentAction.calls.allArgs()).toEqual([
        [
            'report',
            'writeAction'
        ]
    ]);
});

test('Authorise should return false on not matching correct roles', () => {
    const authoriser = new AbstractAuthoriser('neon');
    const user = {
        getRoles: () => {
            return [
                'cleaner'
            ];
        }
    };

    spyOn(authoriser, 'getAllowedRolesForComponentAction').and.callThrough();


    const authorised = authoriser.authorise(user, 'report', 'writeAction');

    expect(authorised).toBe(false);
    expect(authoriser.getAllowedRolesForComponentAction.calls.count()).toBe(1);
    expect(authoriser.getAllowedRolesForComponentAction.calls.allArgs()).toEqual([
        [
            'report',
            'writeAction'
        ]
    ]);
});

// todo: add unit test for getComponentConfig

// todo: add unit test for getAllowedRolesForComponentAction
