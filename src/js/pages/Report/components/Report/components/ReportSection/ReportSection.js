import { h, Component } from 'preact';

/** @jsx h */

import style from './style/reportsection.scss';

export default class ReportSection extends Component {

    render() {
        const { title, children } = this.props;

        if (!title || !children) {
            return null;
        }

        // todo: title should be translated

        return (
            <section className={style.reportSection}>
                <h2>{ title }</h2>
                <div className={style.reportSectionChildren}>
                    { children }
                </div>
            </section>
        );
    }
}
