import { h, Component } from 'preact';
import style from './style/content.scss';

/** @jsx h */

export default class Content extends Component {
    render() {
        const { component, tabId, isContentActive } = this.props;

        return (
            <section className={ `${style.content} ${isContentActive ? 'active' : ''}` } id={ `content_${tabId}` }>
                { component }
            </section>
        );
    }
}
