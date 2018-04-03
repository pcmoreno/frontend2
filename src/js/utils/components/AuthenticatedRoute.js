import { h } from 'preact'; // this import is required, otherwise we will get render issues (although it may seem unused)
import Redirect from './Redirect';
import AsyncRoute from 'preact-async-route';

/**
 * AuthenticatedRoute component
 * This will either return an async route or a redirect, based on whether the user is logged in or not.
 * Redirect will only trigger once the path is visited.
 *
 * @example
 * <AuthenticatedRoute api={api} path={'/path'} ...rest />
 *
 * @param {API} api - api instance
 * @param {string} path - redirect path
 * @param {{}} rest - rest params
 * @returns {*} Redirect or AsyncRoute component
 */
const AuthenticatedRoute = ({ api, path, ...rest }) => ( // eslint-disable-line no-confusing-arrow
    api.getAuthenticator().isAuthenticated() === true
        ? <AsyncRoute {...rest} />
        : <Redirect path={`/login?redirectPath=${path}`} />
);

export default AuthenticatedRoute;
