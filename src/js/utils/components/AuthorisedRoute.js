import { h, Component } from 'preact'; // this import is required, otherwise we will get render issues (although it may seem unused)
import Redirect from './Redirect';
import AsyncRoute from 'preact-async-route';
import utils from '../utils';
import RedirectHelper from '../redirectHelper';

/**
 * AuthorisedRoute component
 * This will either return an async route or a redirect, based on whether the user is authorised or not.
 * Redirect will only trigger once the path is visited.
 * By default the authoriser action is "route". See config example below.
 * authoriser: {
 *     neon: {
 *         componentName: {
 *             route: ['role']
 *         }
 *     }
 * }
 *
 * @example
 * <AuthorisedRoute api={api} component="componentName" path={'/path'} getComponent={ getComponent } ...rest />
 *
 * @param {API} api - api instance
 * @param {string} path - redirect path
 * @param {string} component - component name
 * @param {{}} rest - rest params
 * @returns {*} Redirect or AsyncRoute component
 */
export default class AuthorisedRoute extends Component {

    render() {
        const { api, component, path } = this.props;

        if (!api) {
            throw new Error('<AuthorisedRoute> api property must be defined.');
        }

        if (!component) {
            throw new Error('<AuthorisedRoute> component property must be defined.');
        }

        if (!path) {
            throw new Error('<AuthorisedRoute> path property must be defined.');
        }

        // the authoriser will validate whether we have a user
        const authenticated = api.getAuthenticator().isAuthenticated();
        const authorised = api.getAuthoriser().authorise(api.getAuthenticator().getUser(), component, 'route');

        // we want to forward all original props, except api (which we used here)
        const propsToForward = utils.excludeProps(['api', 'component'], this.props);

        // determine redirect path, login if not authenticated. If authenticated, then just go to the main/default page
        let redirectPath = '/';

        // if not authenticated then redirect to login and save redirect path
        if (!authenticated) {
            RedirectHelper.instance.setRedirectPath(window.location.pathname);
            redirectPath = api.getAuthoriser().getLoginRedirect();
        }

        // create given root elements, so that the stack can be rendered
        // the children of this (Authorised) component are considered the root elements
        return authorised ? <AsyncRoute { ...propsToForward } /> : <Redirect to={redirectPath} />;
    }
}
