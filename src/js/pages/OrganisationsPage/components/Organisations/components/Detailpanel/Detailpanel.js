import { h, Component } from 'preact';
/** @jsx h */

import style from './style/detailpanel.scss';

export default class Detailpanel extends Component {
    constructor(props) {
        super(props);
    }

    toggleFullWidthDetailPanel() {
        if (document.querySelector('body').classList.contains('detailpanel-full-width')) {
            document.querySelector('body').classList.remove('detailpanel-full-width');
        } else {
            document.querySelector('body').classList.add('detailpanel-full-width');
        }
    }

    render() {
        return (
            <aside className={ style.detailpanel }>
                <header>
                    <span className={ style.button_hide_detailpanel } onClick={ this.closeDetailPanel } role="button">x</span>
                    <span className={ style.button_fullwidth_detailpanel } onClick={ this.toggleFullWidthDetailPanel } role="button">&#11013;</span>
                    <p>Detail panel with very long name once again</p>
                </header>
                <nav>
                    <span>item</span>
                    <span>item</span>
                    <span>item</span>
                    <span>item</span>
                    <span>item</span>
                </nav>
                <section className={ style.detailpanel_divider }>some divider</section>
            </aside>
        )
    }
}

