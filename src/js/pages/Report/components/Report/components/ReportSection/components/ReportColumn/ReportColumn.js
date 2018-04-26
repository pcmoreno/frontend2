import { h, Component } from 'preact';

/** @jsx h */

export default class ReportColumn extends Component {

    render() {
        const { children } = this.props;

        if (!children) {
            return null;
        }

        return (
            <section>
                { children }
            </section>
        );
    }
}
