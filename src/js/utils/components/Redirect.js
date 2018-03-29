import { Component } from 'preact';
import { route } from 'preact-router';

export default class Redirect extends Component {
    componentWillMount() {

        // todo: is there another possibility to rerender certain components, for example the header after a login
        if (this.props.refresh) {
            window.location = this.props.path;
        } else {
            route(this.props.path);
        }
    }

    render() {
        return null;
    }
}
