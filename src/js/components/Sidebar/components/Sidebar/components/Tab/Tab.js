import { h, Component } from 'preact';

/** @jsx h */

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/tab.scss';

export default class Tab extends Component {
    constructor() {
        super();
    }

    switchTab(tabId) {

        // remove 'active' class from active tab
        document.querySelector('#sidebar header nav section.active').classList.remove('active');

        // add 'active' class to the requested tab
        document.querySelector(`#sidebar header nav #tab_${tabId}`).classList.add('active');

        // remove 'active' class from active content section
        document.querySelector('#sidebar main section.active').classList.remove('active');

        // add 'active' class to the requested content section
        document.querySelector(`#sidebar main #content_${tabId}`).classList.add('active');

        this.props.updateDimensions();
    }

    render() {
        const { tabId, name, icon, isTabActive } = this.props;

        return (
            <div className={ `${style.tab}` }>
                <section className={ `${isTabActive ? 'active' : ''}` }
                    onClick={ () => {
                        this.switchTab(tabId);
                    } }
                    id={ `tab_${tabId}` }
                    role="button"
                    tabIndex="0"
                >
                    <figure><FontAwesomeIcon icon={ icon } /></figure>
                    <span>{ name }</span>
                </section>
            </div>
        );
    }
}
