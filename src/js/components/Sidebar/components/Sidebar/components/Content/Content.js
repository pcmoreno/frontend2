import { h, Component } from 'preact';

/** @jsx h */

import style from './style/content.scss';

export default class Content extends Component {
    constructor() {
        super();
    }

    render() {
        const { component, tabId, isContentActive } = this.props;

        return (
            <section className={ `${style.content} ${isContentActive ? 'active' : ''}` } id={ `content_${tabId}` }>
                { component }
            </section>
        );
    }
}
