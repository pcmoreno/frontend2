import { h, Component } from 'preact';
import style from './style/reportsection.scss';

/** @jsx h */

export default class ReportSection extends Component {
    render() {
        const { title, children, fullWidth } = this.props;
        let childrenClass = style.reportSectionChildren;

        if (!children) {
            return null;
        }

        if (fullWidth) {
            childrenClass = '';
        }

        return (
            <section className={ style.reportSection }>
                { title && <h2>{ title }</h2>}
                <div className={ childrenClass }>
                    { children }
                </div>
            </section>
        );
    }
}
