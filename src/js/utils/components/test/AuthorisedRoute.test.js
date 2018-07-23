import { shallow } from 'preact-render-spy';
import AuthorisedRoute from '../AuthorisedRoute';
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
        const context = <AuthorisedRoute component={{}} path={{}}>
            <div/>
        </AuthorisedRoute>;
    } catch (e) {
        expect(e.message).toBe('<AuthorisedRoute> api property must be defined');
    }
});

test('Should throw an error if component is undefined', () => {
    try {
        const context = <AuthorisedRoute api={{}} path={{}}>
            <div/>
        </AuthorisedRoute>;
    } catch (e) {
        expect(e.message).toBe('<AuthorisedRoute> component property must be defined');
    }
});

test('Should throw an error if path is undefined', () => {
    try {
        const context = <AuthorisedRoute api={{}} component={{}}>
            <div/>
        </AuthorisedRoute>;
    } catch (e) {
        expect(e.message).toBe('<AuthorisedRoute> path property must be defined');
    }
});

test('Should render an async route when a user is authenticated and authorized', () => {
    const authenticator = {
        isAuthenticated: () => {
            return true;
        },
        getUser: () => {
            return {

            };
        }
    };
    const authoriser = {
        authorise: (user, component, action) => {
            return true;
        },
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

    // authorise flow
    spyOn(api, 'getAuthoriser').and.callThrough();
    spyOn(api, 'getAuthenticator').and.callThrough();
    spyOn(authenticator, 'getUser').and.callThrough();
    spyOn(authoriser, 'authorise').and.callThrough();

    // render flow
    spyOn(utils, 'excludeProps').and.callThrough();

    // redirect flow
    spyOn(RedirectHelper.instance, 'setRedirectPath').and.callThrough();
    spyOn(authoriser, 'getLoginRedirect').and.callThrough();

    const context = shallow(<AuthorisedRoute api={api} path='/path' component='report'/>);

    // authorise flow
    expect(api.getAuthoriser.calls.count()).toBe(1);
    expect(api.getAuthenticator.calls.count()).toBe(2);
    expect(authenticator.getUser.calls.count()).toBe(1);
    expect(authoriser.authorise.calls.count()).toBe(1);
    expect(authoriser.authorise.calls.allArgs()).toEqual([
        [
            authenticator.getUser(),
            "report",
            "route"
        ]
    ]);

    expect(utils.excludeProps.calls.count()).toBe(1);
    expect(utils.excludeProps.calls.allArgs()).toEqual([
        [
            [
                "api",
                "component"
            ],
            {
                "api": api,
                "children": [],
                "component": "report",
                "path": "/path"
            }
        ]
    ]);

    // redirect flow
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

test('Should render a redirect route when a user is not authenticated', () => {
    const authenticator = {
        isAuthenticated: () => {
            return false;
        },
        getUser: () => {
            return {

            };
        }
    };
    const authoriser = {
        authorise: (user, component, action) => {
            return false;
        },
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

    // authorise flow
    spyOn(api, 'getAuthoriser').and.callThrough();
    spyOn(api, 'getAuthenticator').and.callThrough();
    spyOn(authenticator, 'getUser').and.callThrough();
    spyOn(authoriser, 'authorise').and.callThrough();

    // render flow
    spyOn(utils, 'excludeProps').and.callThrough();

    // redirect flow
    spyOn(RedirectHelper.instance, 'setRedirectPath').and.callThrough();
    spyOn(authoriser, 'getLoginRedirect').and.callThrough();

    const context = shallow(<AuthorisedRoute api={api} path='/path' component='report'/>);

    // authorise flow
    expect(api.getAuthoriser.calls.count()).toBe(2);
    expect(api.getAuthenticator.calls.count()).toBe(2);
    expect(authenticator.getUser.calls.count()).toBe(1);
    expect(authoriser.authorise.calls.count()).toBe(1);
    expect(authoriser.authorise.calls.allArgs()).toEqual([
        [
            authenticator.getUser(),
            "report",
            "route"
        ]
    ]);

    expect(utils.excludeProps.calls.count()).toBe(1);
    expect(utils.excludeProps.calls.allArgs()).toEqual([
        [
            [
                "api",
                "component"
            ],
            {
                "api": api,
                "children": [],
                "component": "report",
                "path": "/path"
            }
        ]
    ]);

    // redirect flow
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

test('Should render a redirect route when a user is authenticated and not authorized', () => {
    const authenticator = {
        isAuthenticated: () => {
            return true;
        },
        getUser: () => {
            return {

            };
        }
    };
    const authoriser = {
        authorise: (user, component, action) => {
            return false;
        },
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

    // authorise flow
    spyOn(api, 'getAuthoriser').and.callThrough();
    spyOn(api, 'getAuthenticator').and.callThrough();
    spyOn(authenticator, 'getUser').and.callThrough();
    spyOn(authoriser, 'authorise').and.callThrough();

    // render flow
    spyOn(utils, 'excludeProps').and.callThrough();

    // redirect flow
    spyOn(RedirectHelper.instance, 'setRedirectPath').and.callThrough();
    spyOn(authoriser, 'getLoginRedirect').and.callThrough();

    const context = shallow(<AuthorisedRoute api={api} path='/path' component='report'/>);

    // authorise flow
    expect(api.getAuthoriser.calls.count()).toBe(1);
    expect(api.getAuthenticator.calls.count()).toBe(2);
    expect(authenticator.getUser.calls.count()).toBe(1);
    expect(authoriser.authorise.calls.count()).toBe(1);
    expect(authoriser.authorise.calls.allArgs()).toEqual([
        [
            authenticator.getUser(),
            "report",
            "route"
        ]
    ]);

    expect(utils.excludeProps.calls.count()).toBe(1);
    expect(utils.excludeProps.calls.allArgs()).toEqual([
        [
            [
                "api",
                "component"
            ],
            {
                "api": api,
                "children": [],
                "component": "report",
                "path": "/path"
            }
        ]
    ]);

    // redirect flow
    expect(RedirectHelper.instance.setRedirectPath.calls.count()).toBe(0);
    expect(RedirectHelper.instance.setRedirectPath.calls.allArgs()).toEqual([]);
    expect(authoriser.getLoginRedirect.calls.count()).toBe(0);

    expect(context.find('Redirect')[0].attributes).toEqual({
        "to": "/"
    });
    expect(context.find('Redirect')[0].children).toEqual([]);
    expect(context.find('AsyncRoute')).toEqual({
        "length": 0
    });
});
