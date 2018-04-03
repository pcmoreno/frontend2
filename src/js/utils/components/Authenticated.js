import { Component } from 'preact'; // h: this import is required, otherwise we will get render issues (although it may seem unused)
import utils from '../utils';

/**
 * Authenticated component. Can be used to make sure that child components are only rendered
 * when a user is logged in.
 *
 * @example
 * // only renders Component when the api authenticator has a user
 * <Authenticated api={api}>
 *     <Component ...props />
 * </Authenticated>
 */
export default class Authenticated extends Component {

    render() {
        const api = this.props.api;

        if (!api) {
            throw new Error('<Authenticated> api property must be defined.');
        }

        // the authenticator will validate whether we have a user
        const authenticated = api.getAuthenticator().isAuthenticated();

        // we want to forward all original props, except api (which we used here)
        const propsToForward = utils.excludeProps(['api'], this.props);

        // create given root elements, so that the stack can be rendered
        // the children of this (Authenticated) component are considered the root elements
        return authenticated ? utils.createRootElement(this.props.children, propsToForward) : null;
    }
}
