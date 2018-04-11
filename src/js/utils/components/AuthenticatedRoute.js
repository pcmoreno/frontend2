import { h, Component } from 'preact'; // this import is required, otherwise we will get render issues (although it may seem unused)
import Redirect from './Redirect';
import AsyncRoute from 'preact-async-route';
import utils from '../utils';
import RedirectHelper from '../redirectHelper';
import AppConfig from "../../App.config";

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
export default class AuthenticatedRoute extends Component {

    render() {
        const { api, path } = this.props;

        if (!api) {
            throw new Error('<AuthenticatedRoute> api property must be defined.');
        }

        if (!path) {
            throw new Error('<AuthenticatedRoute> path property must be defined.');
        }

        // the authenticator will validate whether we have a user
        const authenticated = api.getAuthenticator().isAuthenticated();

        // we want to forward all original props, except api (which we used here)
        const propsToForward = utils.excludeProps(['api'], this.props);

        // set redirect path when not authenticated
        if (!authenticated) {
            RedirectHelper.instance.setRedirectPath(window.location.pathname);
        }

        // create given root elements, so that the stack can be rendered
        // the children of this (Authenticated) component are considered the root elements
        return authenticated ? <AsyncRoute { ...propsToForward } /> : <Redirect to={api.getAuthenticator().getLoginRedirect()} />;
    }
}
