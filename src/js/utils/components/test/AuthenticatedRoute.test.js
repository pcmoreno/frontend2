import { shallow } from 'preact-render-spy';
import AuthenticatedRoute from '../AuthenticatedRoute';

test('Should render an async route when a user is authenticated', () => {
    const api = {
        getAuthenticator: () => {
            return {
                isAuthenticated: () => {
                    return true;
                }
            }
        }
    };

    const context = shallow(<AuthenticatedRoute api={api} path='/path' />);

    expect(context.find('AsyncRoute')[0].attributes).toEqual({
        "path": "/path"
    });
    expect(context.find('AsyncRoute')[0].children).toEqual([]);
    expect(context.find('Redirect')).toEqual({
        "length": 0
    });
});

test('Should render a redirect when a user is not authenticated', () => {
    const api = {
        getAuthenticator: () => {
            return {
                isAuthenticated: () => {
                    return false;
                }
            };
        },
        getAuthoriser: () => {
            return {
                getLoginRedirect: () => {
                    return '/login';
                }
            }
        }
    };

    const context = shallow(<AuthenticatedRoute api={api} path='/path' />);

    expect(context.find('Redirect')[0].attributes).toEqual({
        "to": "/login"
    });
    expect(context.find('Redirect')[0].children).toEqual([]);
    expect(context.find('AsyncRoute')).toEqual({
        "length": 0
    });
});
