import { Component } from 'preact';
import { route } from 'preact-router';
import RedirectHelper from '../redirectHelper';

/**
 * Redirect component
 * Routes to the given path (to). When refresh is true it will completely redirect (using window.location)
 *
 * @example
 * <Redirect to={'/path'} refresh={true} ...rest />
 *
 * @param {string} to - redirect path
 * @param {boolean} refresh - complete refresh of page
 * @param {{}} rest - rest params
 * @returns {*} Redirect component
 */
export default class Redirect extends Component {
    componentWillMount() {

        // based on the refresh property refresh full page or only route within the application
        if (this.props.to) {
            if (this.props.refresh) {
                window.location = this.props.to;
            } else {
                route(this.props.to, true);
                RedirectHelper.instance.setRedirectPath('');
            }
        }
    }

    render() {
        return null;
    }
}
