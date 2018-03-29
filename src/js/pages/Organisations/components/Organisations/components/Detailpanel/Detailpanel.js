import { h, Component } from 'preact';

/** @jsx h */

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/detailpanel.scss';

export default class Detailpanel extends Component {
    constructor(props) {
        super(props);
    }

    toggleFullWidthDetailPanel() {

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

    render() {
        const { data, name } = this.props;

        // todo: just an example of how data is passed through. this data comes in from the API and is sent over props
        let outputTab = <p />;

        if (data && data.hasOwnProperty('entityId') && data.hasOwnProperty('entityType')) {
            outputTab = <p>{name} ({data.entityId})<br />{data.entityType}</p>;
        }

        return (
            <aside className={`${style.detailpanel} hidden`} id="detailpanel">
                <header>
                    <div className={ style.spinner_container }>
                        <span id="spinner_detail_panel" className={ `${style.spinner} hidden` }><FontAwesomeIcon icon="spinner"/></span>
                    </div>
                    <span tabIndex="0" className={ style.button_hide_detailpanel } onClick={ this.closeDetailPanel } role="button">x</span>
                    <span tabIndex="0" className={ style.button_fullwidth_detailpanel } onClick={ this.toggleFullWidthDetailPanel } role="button">&#11013;</span>
                    <h2>{ name }</h2>
                </header>
                <nav>
                    <span>tab</span>
                    <span>tab</span>
                    <span>tab</span>
                    <span>tab</span>
                    <span>tab</span>
                </nav>
                <main>
                    <p>(any data below comes from the API)</p>
                    <span className={ style.detailpanel_divider }>some divider</span>
                    <p>{ outputTab }</p>
                </main>
            </aside>
        );
    }
}
