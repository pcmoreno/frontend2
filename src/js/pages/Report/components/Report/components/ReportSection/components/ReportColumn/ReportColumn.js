import { h, Component } from 'preact';

/** @jsx h */

export default class ReportColumn extends Component {

    render() {
        const { children } = this.props;

        return (
            <section>
                { children }
            </section>
        );
    }
}
