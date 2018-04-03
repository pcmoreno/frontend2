import { h } from 'preact'; // this import is required, otherwise we will get render issues (although it may seem unused)
import Redirect from './Redirect';
import AsyncRoute from 'preact-async-route';

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
const AuthorisedRoute = ({ api, path, component, ...rest }) => ( // eslint-disable-line no-confusing-arrow
    api.getAuthoriser().authorise(api.getAuthenticator().getUser(), component, 'route') === true
        ? <AsyncRoute {...rest} />
        : <Redirect path={`/login?redirectPath=${path}`} />
);

export default AuthorisedRoute;
