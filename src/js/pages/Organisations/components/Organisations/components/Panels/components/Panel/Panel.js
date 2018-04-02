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
            entities
        } = this.props;
        const itemOutput = [];

        if (entities && entities.length > 0) {
            entities.forEach(entity => {

                let isPanelItemActive = false;

                // see if the entity is active (highlighted in the panel)
                // todo: there seems to be an issue here. entity.id is not unique between organisations and projects.
                pathNodes.forEach(pathNode => {
                    if (pathNode.id === entity.id) {
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
                <PanelHeader openModalToAddOrganisation={openModalToAddOrganisation} />
                <section className={ style.itemlist }>
                    <ul>
                        { itemOutput }
                    </ul>
                </section>
            </section>
        );
    }
}
