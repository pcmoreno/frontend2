import { h, Component } from 'preact';

/** @jsx h */

import Item from './components/Item/Item';
import PanelHeader from './components/PanelHeader/PanelHeader';
import style from './style/panel.scss';

export default class Panel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            pathNodes,
            panelId,
            fetchEntities,
            fetchDetailPanelData,
            openModalToAddOrganisation,
            isPanelActive,
            entities,
            i18n
        } = this.props;
        const itemOutput = [];

        if (entities && entities.length > 0) {
            entities.forEach(entity => {

                let isPanelItemActive = false;

                // see if the entity is active (highlighted in the panel)
                pathNodes.forEach(pathNode => {

                    // note you HAVE to check for id AND type: id's are NOT unique between organisations and projects!
                    if (pathNode.id === entity.id && pathNode.type === entity.type) {
                        isPanelItemActive = true;
                    }
                });

                itemOutput.push(<Item
                    entity={entity}
                    panelId={panelId}
                    fetchEntities={fetchEntities}
                    fetchDetailPanelData={fetchDetailPanelData}
                    isPanelItemActive={isPanelItemActive}
                />);
            });
        }

        return (
            <section className={ `${style.panel}${isPanelActive ? ' active' : ''}` } >
                <PanelHeader
                    openModalToAddOrganisation={openModalToAddOrganisation}
                    i18n={i18n}
                />
                <section className={ style.itemlist }>
                    <ul>
                        { itemOutput }
                    </ul>
                </section>
            </section>
        );
    }
}
