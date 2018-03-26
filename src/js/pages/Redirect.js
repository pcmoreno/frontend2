import { Component } from 'preact';

export default class Redirect extends Component {
    componentWillMount() {

        // todo change to route() https://github.com/developit/preact-router/issues/197
        window.location = this.props.path;
    }

    render() {
        return null;
    }
}
