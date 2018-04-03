import { Component } from 'preact'; // h: this import is required, otherwise we will get render issues (although it may seem unused)
import utils from '../utils';

/**
 * Authorised component. Can be used to make sure that child components are only rendered
 * when a user is authorised.
 * See config example below
 *
 * authorisers: {
 *     authoriser: {
 *         componentName: {
 *             editAction: ['role']
 *         }
 *     }
 * }
 *
 * @example
 * // only renders Component when the api authoriser find matching user roles for this component/action
 * <Authorised api={api} component="componentName" action="action">
 *     <Component ...props />
 * </Authorised>
 */
export default class Authorised extends Component {

    render() {
        const api = this.props.api;
        const component = this.props.component;
        const action = this.props.action;

        if (!api || !component || !action) {
            throw new Error('<Authorised> api, component and action properties must be defined.');
        }

        // the authoriser will validate the user roles
        const authorised = api.getAuthoriser().authorise(api.getAuthenticator().getUser(), component, action);

        // we want to forward all original props, except api (which we used here)
        const propsToForward = utils.excludeProps(['api'], this.props);

        // create given root elements, so that the stack can be rendered
        // the children of this (Authorised) component are considered the root elements
        return authorised ? utils.createRootElement(this.props.children, propsToForward) : null;
    }
}
