import { h, Component } from 'preact';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import style from './style/item.scss';

/** @jsx h */

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
            fetchDetailPanelData,
            i18n
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
                id = { `panel-${panelId}-${entity.id}` }
                className={ `${isPanelItemActive && 'list_item__active'}` }
                onClick = { () => {

                    fetchEntities(entity, panelId);
                } }
            >
                <ul className={ style.listitem }>
                    <li><FontAwesomeIcon icon={ fontAwesomeIcon } /></li>
                    <li className={ style.listitem_properties }>
                        <span className={ style.title }>{ entity.name }</span>
                        <span className={ style.subtitle }>{ i18n[entity.translationKey] ? i18n[entity.translationKey] : entity.productName }</span>
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
