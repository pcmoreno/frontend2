import { h, Component } from 'preact';
import style from './style/error.scss';

/** @jsx h */

export default class Error extends Component {
    render() {
        const { i18n } = this.props;

        return (
            <section className={ style.error }>
                <h1>{ i18n.error_page_not_found }</h1>
            </section>
        );
    }
}
