import { h, Component } from 'preact';

/** @jsx h */

export default class TabbedComponent extends Component {
    render() {
        return (
            <section>
                { this.props.children }
            </section>
        );
    }
}
