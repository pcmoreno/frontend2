import { h, Component } from 'preact';

/** @jsx h */

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/item.scss';

export default class Item extends Component {
    constructor(props) {
        super(props);
    }

    openDetailPanel() {
        document.querySelector('#detailpanel').classList.remove('hidden');
    }

    render() {
        const { itemName } = this.props;

        return (
            <li onClick = { this.props.getChildElements }>
                <ul className={ style.listitem }>
                    <li><FontAwesomeIcon icon="suitcase" /></li>
                    <li className={ style.listitem_properties }>
                        <div>
                            <span className={ style.title }>{ itemName }</span>
                            <span className={ style.subtitle }>product type</span>
                        </div>
                    </li>
                    <li>
                        <span tabIndex="0" onClick={ this.openDetailPanel } role="button">
                            <FontAwesomeIcon icon="eye"/>
                        </span>
                    </li>
                </ul>
            </li>
        );
    }
}
