import { h, Component } from 'preact';

/** @jsx h */

import style from './style/report.scss';
import Header from './components/Header/Header';

export default class Report extends Component {
    render() {

        const { report } = this.props;

        return (
            <section className={ style.report }>
                <Header
                    participant={report.participant}
                    product={report.product}
                    organisation={report.organisation}
                    consultant={report.consultant}
                />
            </section>
        );
    }
}
