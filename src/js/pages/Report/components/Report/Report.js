import { h, Component } from 'preact';

/** @jsx h */

import style from './style/report.scss';

export default class Report extends Component {
    render() {

        // const { participants } = this.props;

        return (
            <section className={ style.report }>
                report goes here
            </section>
        );
    }
}
