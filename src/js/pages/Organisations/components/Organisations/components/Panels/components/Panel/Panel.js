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
        const { pathNodes, panelId, fetchEntities, fetchDetailPanelData } = this.props;
        const entities = this.props.entities;
        const itemOutput = [];

        if (entities && entities.length > 0) {
            entities.forEach(entity => {

                let panelItemActive = false;

                pathNodes.forEach(pathNode => {
                    if (pathNode.id === entity.id) {
                        panelItemActive = true;
                    }
                });

                itemOutput.push(<Item
                    panelId={panelId}
                    itemName={entity.name}
                    itemId={entity.id}
                    fetchEntities={fetchEntities}
                    fetchDetailPanelData={fetchDetailPanelData}
                    panelItemActive={panelItemActive}
                    type={entity.type}
                    productName={entity.productName}
                />);
            });
        }

        return (
            <section className={ `${style.panel}${this.props.active ? ' active' : ''}` } >
                <PanelHeader openModalToAddOrganisation={this.props.openModalToAddOrganisation} />
                <section className={ style.itemlist }>
                    <ul>
                        { itemOutput }
                    </ul>
                </section>
            </section>
        );
    }
}
