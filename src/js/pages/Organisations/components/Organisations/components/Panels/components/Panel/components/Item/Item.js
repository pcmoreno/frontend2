import { h, Component } from 'preact';

/** @jsx h */

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/item.scss';

export default class Item extends Component {
    constructor(props) {
        super(props);
    }

    openDetailPanel(event) {
        event.stopPropagation();

        document.querySelector('#detailpanel').classList.remove('hidden');
    }

    render() {
        const { itemName, itemId, panelId, type, panelItemActive, fetchEntities, productName } = this.props;

        let fontAwesomeIcon;

        switch (type) {
            case 'organisation':
                fontAwesomeIcon = 'building';
                break;

            case 'project':
                fontAwesomeIcon = 'suitcase';
                break;

            case 'jobfunction':
                fontAwesomeIcon = 'clipboard-list';
                break;

            default:
                fontAwesomeIcon = 'building';
                break;
        }

        return (
            <li className={ `${panelItemActive && 'list_item__active'}` } onClick = { () => {
                fetchEntities({ id: itemId, name: itemName }, panelId);
            } }>
                <ul className={ style.listitem }>
                    <li><FontAwesomeIcon icon={ fontAwesomeIcon } /></li>
                    <li className={ style.listitem_properties }>
                        <div>
                            <span className={ style.title }>{ itemName }</span>
                            <span className={ style.subtitle }>{ productName }</span>
                        </div>
                    </li>
                    <li>
                        <span tabIndex="0" onClick={ event => this.openDetailPanel(event) } role="button">
                            <FontAwesomeIcon icon="eye"/>
                        </span>
                    </li>
                </ul>
            </li>
        );
    }
}
