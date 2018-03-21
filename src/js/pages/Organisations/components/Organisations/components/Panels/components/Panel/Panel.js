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
        const { entities, pathNodes, panelId, fetchEntities } = this.props;

        let itemOutput = [];

        // if (entities.length > 1) {
        //     entities.forEach(entity => {
        //
        //         // todo: extract to separate helper function
        //         let panelItemActive = false;
        //
        //         pathNodes.forEach(pathNode => {
        //             if (pathNode.id === entity.id) {
        //                 panelItemActive = true;
        //             }
        //         });
        //
        //         itemOutput.push(<Item
        //             panelId = { panelId }
        //             itemName = { entity.organisation_name }
        //             itemId = { entity.id }
        //             fetchEntities = { fetchEntities }
        //             panelItemActive = { panelItemActive }
        //         />);
        //     });
        // } else {
        //
        //     // todo: a single entry is not wrapped inside an array, thus cannot forEach it. fix this in the API (NEON-3633)
        //     itemOutput = <Item
        //         itemName = { entities.organisation_name }
        //         itemId = { entities.id }
        //         fetchEntities = { fetchEntities }
        //     />;
        // }

        entities.forEach(entity => {

            // todo: extract to separate helper function
            let panelItemActive = false;

            pathNodes.forEach(pathNode => {
                if (pathNode.id === entity.id) {
                    panelItemActive = true;
                }
            });

            itemOutput.push(<Item
                panelId = { panelId }
                itemName = { entity.organisation_name }
                itemId = { entity.id }
                fetchEntities = { fetchEntities }
                panelItemActive = { panelItemActive }
            />);
        });

        return (
            <section className={ `${style.panel} ${ this.props.active && 'active' }` } >
                <PanelHeader openModalToAddOrganisation={ this.props.openModalToAddOrganisation } />
                <section className={ style.itemlist }>
                    <ul>
                        { itemOutput }
                    </ul>
                </section>
            </section>
        );
    }
}
