import { h, Component } from 'preact';

/** @jsx h */

export default class DateTimeField extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <input type="date" />
        );
    }
}
