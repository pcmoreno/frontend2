import { h, Component } from 'preact';

/** @jsx h */

import Login from './components/Login/Login';

export default class Index extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Login
            />
        );
    }
}
