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
        const { panels, pathNodes, fetchEntities, openModalToAddOrganisation } = this.props;

        const panelCollection = [];
        let panelIndex = 1;

        // for each of the nodes in path, find the matching panel in panels and add it to the collection for output
        pathNodes.forEach(pathNode => {

            let active = false;

            if (panelIndex === pathNodes.length) {
                active = true;
            }

            let currentPanel;

            panels.forEach(panel => {
                if (panel.parentId === pathNode.id) {
                    currentPanel = panel;
                }
            });

            // log error if a panel could not be created
            if (!currentPanel) {
                this.logger.error({
                    component: 'Panels',
                    message: `could not find matching panel for Pathnode ${pathNode.id}`
                });
            }

            panelCollection.push(<Panel
                panelId = { panelIndex++ }
                entities = { currentPanel.entities }
                fetchEntities = { fetchEntities }
                openModalToAddOrganisation = { openModalToAddOrganisation }
                active = { active }
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
