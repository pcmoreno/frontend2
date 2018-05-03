import { h, Component } from 'preact';
// todo: translate this
/** @jsx h */

import updateNavigationArrow from '../../utils/updateNavigationArrow.js';
import Error from './components/Error/Error';

export default class Index extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        updateNavigationArrow();
    }

    componentWillMount() {
        document.title = 'Page not found!';
    }

    render() {
        return (
            <Error />
        );
    }
}
