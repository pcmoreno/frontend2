import { h, Component } from 'preact';

/** @jsx h */

import style from './style/detailpanel.scss';

export default class Detailpanel extends Component {
    constructor(props) {
        super(props);
    }

    toggleFullWidthDetailPanel() {

        // todo: ensure this actually toggles
        if (document.querySelector('#panels').classList.contains('hidden')) {
            document.querySelector('#panels').classList.remove('hidden');
            document.querySelector('#panels_container').classList.remove('single_fragment');
        } else {
            document.querySelector('#panels').classList.add('hidden');
            document.querySelector('#panels_container').classList.add('single_fragment');
        }
    }

    closeDetailPanel() {
        document.querySelector('#detailpanel').classList.add('hidden');
    }

    componentDidMount() {

        // hide the detail panel on page load (css overrides this for desktop)
        // todo: ensure this is done on the element itself using classnames
        document.querySelector('#detailpanel').classList.add('hidden');
    }

    render() {

        // todo: finish styling for detail panel

        return (
            <aside className={ style.detailpanel } id="detailpanel">
                <header>
                    <span tabIndex="0" className={ style.button_hide_detailpanel } onClick={ this.closeDetailPanel } role="button">x</span>
                    <span tabIndex="0" className={ style.button_fullwidth_detailpanel } onClick={ this.toggleFullWidthDetailPanel } role="button">&#11013;</span>
                    <h2>Detail panel with very long name once again</h2>
                </header>
                <nav>
                    <span>item</span>
                    <span>item</span>
                    <span>item</span>
                    <span>item</span>
                    <span>item</span>
                </nav>
                <main>
                    <p>some bla bla</p>
                    <span className={ style.detailpanel_divider }>some divider</span>
                    <p>some bla bla</p>
                </main>
            </aside>
        );
    }
}
