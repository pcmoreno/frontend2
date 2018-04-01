import { h, Component } from 'preact';

/** @jsx h */

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/item.scss';

export default class Item extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            entity,
            panelId,
            isPanelItemActive,
            fetchEntities,
            fetchDetailPanelData
        } = this.props;

        let fontAwesomeIcon;

        switch (entity.type) {
            case 'organisation':
                fontAwesomeIcon = 'building';
                break;

            case 'project':
                fontAwesomeIcon = 'clipboard-list';
                break;

            case 'jobFunction':
                fontAwesomeIcon = 'suitcase';
                break;

            default:
                fontAwesomeIcon = 'building';
                break;
        }

        return (
            <li
                id = { entity.id }
                className={ `${isPanelItemActive && 'list_item__active'}` }
                onClick = { () => {

                    fetchEntities(entity, panelId);
                } }
            >
                <ul className={ style.listitem }>
                    <li><FontAwesomeIcon icon={ fontAwesomeIcon } /></li>
                    <li className={ style.listitem_properties }>
                        <div>
                            <span className={ style.title }>{ entity.name }</span>
                            <span className={ style.subtitle }>{ entity.productName }</span>
                        </div>
                    </li>
                    <li>
                        <span
                            tabIndex="0"
                            role="button"
                            onClick={ event => {

                                // ensure fetchEntities (on the parent element) is not called
                                event.stopPropagation();

                                fetchDetailPanelData(entity);

                                // ensure detail panel becomes visible (mostly important on responsive views)
                                document.querySelector('#detailpanel').classList.remove('hidden');
                            } }
                        >
                            <FontAwesomeIcon icon="eye"/>
                        </span>
                    </li>
                </ul>
            </li>
        );
    }
}
