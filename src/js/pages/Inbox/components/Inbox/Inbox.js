import { h, Component } from 'preact';

/** @jsx h */

import style from './style/inbox.scss';

export default class Inbox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { i18n } = this.props;

        return (
            <main className={ style.inbox }>
                { i18n.about_this_report };
            </main>
        );
    }
}
