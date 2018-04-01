import { h, Component } from 'preact';
import Logger from '../../../../../../utils/logger';

/** @jsx h */

import Panel from './components/Panel/Panel';
import style from './style/panels.scss';

export default class Panels extends Component {
    constructor(props) {
        super(props);

        this.logger = Logger.instance;
    }

    render() {
        const {
            panels,
            pathNodes,
            fetchEntities,
            openModalToAddOrganisation,
            fetchDetailPanelData
        } = this.props;

        const panelCollection = [];
        let panelIndex = 1;

        // for each of the nodes in path, find the matching panel in panels and add it to the collection for output
        pathNodes.forEach(pathNode => {

            // if the current panel index matches the length of the pathNodes, this is the last panel, and it is active
            let isPanelActive = false;

            if (panelIndex === pathNodes.length) {
                isPanelActive = true;
            }

            let currentPanel;

            panels.forEach(panel => {
                if (panel.parentId === pathNode.id) {
                    currentPanel = panel;
                }
            });

            // be sure to check if currentPanel was found: for projects there wont be any panel data stored in state!
            if (currentPanel) {
                panelCollection.push(<Panel
                    panelId = { panelIndex++ }
                    entities = { currentPanel.entities }
                    parentId = { currentPanel.parentId }
                    fetchEntities = { fetchEntities }
                    fetchDetailPanelData = { fetchDetailPanelData }
                    openModalToAddOrganisation = { openModalToAddOrganisation }
                    isPanelActive = { isPanelActive }
                    pathNodes = { pathNodes }
                />);
            }
        });

        return (
            <section className={ style.panels } id="panels">
                { panelCollection }
            </section>
        );
    }
}
