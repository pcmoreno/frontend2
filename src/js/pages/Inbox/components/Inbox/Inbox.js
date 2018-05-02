import { h, Component } from 'preact';

/** @jsx h */

import { getTranslations } from '../../../../utils/lokaliser.js';
import style from './style/inbox.scss';

export default class Inbox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const i18n = getTranslations();

        return (
            <main className={ style.inbox }>
                { i18n.complete_before }
            </main>
        );
    }
}
