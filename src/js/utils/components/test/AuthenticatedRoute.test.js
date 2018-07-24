import { shallow } from 'preact-render-spy';
import AuthenticatedRoute from '../AuthenticatedRoute';
import utils from '../../utils';
import RedirectHelper from '../../redirectHelper';

// Mock the utils
jest.mock('../../utils', () => {
    return {
        excludeProps: (exclude, props) => {
            return {
                path: '/path'
            }
        }
    }
});

// Mock the redirectHelper
jest.mock('../../redirectHelper', () => {
    return {
        instance: {
            setRedirectPath: (path) => {
                return null;
            }
        }
    };
});

test('Should throw an error if api is undefined', () => {
    try {
        const context = <AuthenticatedRoute>
            <div/>
        </AuthenticatedRoute>;
    } catch (e) {
        expect(e.message).toBe('<AuthenticatedRoute> api property must be defined');
    }
});

test('Should throw an error if path is undefined', () => {
    try {
        const context = <AuthenticatedRoute>
            <div/>
        </AuthenticatedRoute>;
    } catch (e) {
        expect(e.message).toBe('<AuthenticatedRoute> path property must be defined');
    }
});

test('Should render an async route when a user is authenticated', () => {
    const authenticator = {
        isAuthenticated: () => {
            return true;
        }
    };
    const authoriser = {
        getLoginRedirect: () => {
            return '/login';
        }
    };
    const api = {
        getAuthenticator: () => {
            return authenticator;
        },
        getAuthoriser: () => {
            return authoriser;
        }
    };

    // regular flow
    spyOn(api, 'getAuthenticator').and.callThrough();
    spyOn(authenticator, 'isAuthenticated').and.callThrough();

    spyOn(utils, 'excludeProps').and.callThrough();

    // redirect flow
    spyOn(api, 'getAuthoriser').and.callThrough();
    spyOn(RedirectHelper.instance, 'setRedirectPath').and.callThrough();
    spyOn(authoriser, 'getLoginRedirect').and.callThrough();

    const context = shallow(<AuthenticatedRoute api={api} path='/path' />);

    // regular flow
    expect(api.getAuthenticator.calls.count()).toBe(1);
    expect(authenticator.isAuthenticated.calls.count()).toBe(1);

    expect(utils.excludeProps.calls.count()).toBe(1);
    expect(utils.excludeProps.calls.allArgs()).toEqual([
        [
            ["api"],
            {
                "api": api,
                "children": [],
                "path": "/path"
            }
        ]
    ]);

    // redirect flow
    expect(api.getAuthoriser.calls.count()).toBe(0);
    expect(RedirectHelper.instance.setRedirectPath.calls.count()).toBe(0);
    expect(authoriser.getLoginRedirect.calls.count()).toBe(0);

    expect(context.find('AsyncRoute')[0].attributes).toEqual({
        "path": "/path"
    });
    expect(context.find('AsyncRoute')[0].children).toEqual([]);
    expect(context.find('Redirect')).toEqual({
        "length": 0
    });
});

test('Should render a redirect when a user is not authenticated', () => {
    const authenticator = {
        isAuthenticated: () => {
            return false;
        }
    };
    const authoriser = {
        getLoginRedirect: () => {
            return '/login';
        }
    };
    const api = {
        getAuthenticator: () => {
            return authenticator;
        },
        getAuthoriser: () => {
            return authoriser;
        }
    };

    // regular flow
    spyOn(api, 'getAuthenticator').and.callThrough();
    spyOn(authenticator, 'isAuthenticated').and.callThrough();

    spyOn(utils, 'excludeProps').and.callThrough();

    // redirect flow
    spyOn(api, 'getAuthoriser').and.callThrough();
    spyOn(RedirectHelper.instance, 'setRedirectPath').and.callThrough();
    spyOn(authoriser, 'getLoginRedirect').and.callThrough();

    const context = shallow(<AuthenticatedRoute api={api} path='/path' />);

    // regular flow
    expect(api.getAuthenticator.calls.count()).toBe(1);
    expect(authenticator.isAuthenticated.calls.count()).toBe(1);

    expect(utils.excludeProps.calls.count()).toBe(1);
    expect(utils.excludeProps.calls.allArgs()).toEqual([
        [
            ["api"],
            {
                "api": api,
                "children": [],
                "path": "/path"
            }
        ]
    ]);

    // redirect flow
    expect(api.getAuthoriser.calls.count()).toBe(1);
    expect(RedirectHelper.instance.setRedirectPath.calls.count()).toBe(1);
    expect(RedirectHelper.instance.setRedirectPath.calls.allArgs()).toEqual([
        [
            "/" // default window.location.pathname
        ]
    ]);
    expect(authoriser.getLoginRedirect.calls.count()).toBe(1);

    expect(context.find('Redirect')[0].attributes).toEqual({
        "to": "/login"
    });
    expect(context.find('Redirect')[0].children).toEqual([]);
    expect(context.find('AsyncRoute')).toEqual({
        "length": 0
    });
});
