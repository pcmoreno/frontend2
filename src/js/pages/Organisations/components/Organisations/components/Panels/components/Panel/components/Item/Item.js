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
            panelId,
            entity,
            isPanelItemActive,
            fetchEntities,
            fetchDetailPanelData
        } = this.props;

        let fontAwesomeIcon;
        let entityType;
        let section = null;

        // correctly determine the icon and the key to construct the endpoint used to fetch detail panel data
        switch (entity.type) {
            case 'organisation':
                fontAwesomeIcon = 'building';
                entityType = 'organisation';

                // this is where its children should be fetched from
                section = 'organisation';
                break;

            case 'project':
                fontAwesomeIcon = 'clipboard-list';
                entityType = 'organisation';

                // note there is no section here. a project cannot have children.
                break;

            case 'jobFunction':
                fontAwesomeIcon = 'suitcase';
                entityType = 'jobFunction';

                // this is where its children should be fetched from
                section = 'organisation';
                break;

            default:
                fontAwesomeIcon = 'building';
                entityType = 'organisation';
                break;
        }

        return (
            <li
                key = { entity.id }
                id = { entity.id }
                className={ `${isPanelItemActive && 'list_item__active'}` }
                // todo: there shouldnt be an onClick when section === null (which means its a project)
                onClick = { () => {

                    // note that entityType overwrites entity.type in order to reach the right endpoint (see switch)
                    // todo: use spread here
                    fetchEntities({ id: entity.id, name: entity.name, section: section }, panelId);
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

                                // ensure fetchEntities is not called
                                event.stopPropagation();

                                // fetch data to populate detail panel (again, entityType overwrites entity.type)
                                // todo: use spread here
                                fetchDetailPanelData({ id: entity.id, name: entity.name, section: section });

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
