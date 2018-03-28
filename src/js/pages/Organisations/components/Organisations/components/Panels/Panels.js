import { h, Component } from 'preact';

/** @jsx h */

import Panel from './components/Panel/Panel';
import style from './style/panels.scss';

export default class Panels extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { panels, pathNodes, fetchEntities, openModalToAddOrganisation, addAlert } = this.props;

        const panelCollection = [];
        let panelIndex = 1;

        // for each of the nodes in path, find the matching panel in panels and add it to the collection for output
        pathNodes.forEach(pathNode => {

            let currentPanel;

            panels.forEach(panel => {
                if (panel.parentId === pathNode.id) {
                    currentPanel = panel;
                }
            });

            if (!currentPanel) {
                // todo: make this a (working) logError instead of alert
                addAlert({ type: 'error', text: `Couldnt find matching panel with id ${pathNode.id}` });
                //self.logError(`Couldnt find matching panel with id ${pathNode.id}`);
            }

            panelCollection.push(<Panel
                panelId = { panelIndex++ }
                entities = { currentPanel.entities }
                fetchEntities = { fetchEntities }
                openModalToAddOrganisation = { openModalToAddOrganisation }
                active = { currentPanel.active }
                pathNodes = { pathNodes }
            />);
        });

        return (
            <section className={ style.panels } id="panels">
                { panelCollection }
            </section>
        );
    }
}
