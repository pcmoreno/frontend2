import { h, Component } from 'preact';
import style from './style/details.scss';

/** @jsx h */

export default class Details extends Component {
    render() {
        const { children, i18n, title } = this.props;

        if (!children) {
            return null;
        }

        return (
            <div className={ `${style.details}` }>
                <h4 className="attachment-details_header">{ i18n.report_report_details }</h4>
                <section className={ style.sections }>
                    { title }
                    { children }
                </section>
            </div>
        );
    }
}
